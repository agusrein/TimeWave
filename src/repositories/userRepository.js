const EmailManager = require('../services/email.js');
const emailManager = new EmailManager;
const generateResetToken = require('../utils/resetTocken.js');
const { createHash, isValidPassword } = require('../utils/hashbcrypt.js');
const userModel = require('../models/user.model.js')

class UserRepository {
    async requestPasswordReset(email) {
        try {
            const user = await userModel.findOne({ email })
            if (!user) {
                return { status: false, message: 'Usuario no encontrado' }
            }
            const token = generateResetToken();
            user.resetToken = {
                token: token,
                expire: new Date(Date.now() + 300000)
            }
            await user.save();
            await emailManager.sendEmailPasswordReset(email, user.first_name, token);
            return { status: true, message: 'El token se ha enviado exitosamente.' }
        } catch (error) {
            return { status: false, message: 'Error en el servidor' }
        }
    }

    async resetPassword(email, pass, token) {
        try {
            const user = await userModel.findOne({ email });
            if (!user) {
                return { status: false, code: 1, message: 'Usuario no encontrado' }
            }
            const resetToken = user.resetToken;
            if (!resetToken || resetToken.token !== token) {
                return { status: false, code: 2, message: 'Código Inválido' }
            }
            if (Date() < resetToken.expire) {
                return { status: false, code: 3, message: 'El token ingresado ha Expirado' }
            }
            if (isValidPassword(pass, user)) {
                return { status: false, code: 4, message: 'La nueva contraseña no puede ser igual a la anterior' }
            }
            user.pass = createHash(pass);
            user.resetToken = undefined;
            await user.save();
            return { status: true, message: 'Su contraseña ha sido cambiada con éxito' }
        } catch (error) {
            return { status: false, message: 'Error en el servidor' }
        }
    }

    async changePremiumRol(uid) {
        try {
            const user = await userModel.findById(uid);
            if (!user) {
                return { status: false, message: 'Usuario no encontrado' }
            }
            if (user.role == 'admin') {
                return { status: false, message: 'No puedes cambiar el rol de un administrador.' }
            }
            if (user.role == 'user') {
                const requiredDocuments = ['identificacion', 'comprobante de domicilio', 'comprobante de estado de cuenta'];
                const uploadedDocuments = user.documents.map(doc => doc.name.split('.')[0].trim().toLowerCase()); //Le saco el formato del documento al nombre del archivo subido y lo paso a minúscula.
                const hasDocuments = requiredDocuments.every(doc => uploadedDocuments.includes(doc)); //Corroboro que los archivos requeridos estén dentro de los archivos subidos.
                if (!hasDocuments) {
                    return {status: false, message: 'Error. Debe adjuntar todos los documentos solicitados para poder cambiar de rol'};
                }
            }
            const newRole = user.role === "user" ? "premium" : "user"
            await userModel.findByIdAndUpdate(uid, { role: newRole })
            return { status: true, message: 'Rol Actualizado' }

        } catch (error) {
            return { status: false, message: 'Error en el servidor' }

        }
    }

    async uploadFiles(uid, uploadedDocuments) {
        try {
            const user = await userModel.findById(uid);
            if (user && uploadedDocuments) {
                const documentTypes = ['documents', 'products', 'profiles'];

                documentTypes.forEach(type => {
                    if (uploadedDocuments[type]) {
                        user.documents = user.documents.concat(
                            uploadedDocuments[type].map(doc => ({
                                name: doc.originalname,
                                reference: doc.path
                            }))
                        );
                    }
                });
                await user.save();
                return ({ status: true, message: 'Documentos cargados exitosamente' })
            }
            return ({ status: false, message: 'Usuario no encontrado' })

        } catch (error) {
            return ({ status: false, message: `LO SENTIMOS, HA OCURRIDO UN ERROR ${error}` })
        }
    }


}

module.exports = UserRepository
