const nodemailer = require('nodemailer');
const { EMAIL_PASS, EMAIL_USER } = require('../config/config.js')
class EmailManager {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: "gmail",
            port: 587,
            auth: {
                user: EMAIL_USER,
                pass: EMAIL_PASS
            }
        })
    }
    async sendEmailPurchase(email, first_name, ticket) {
        try {
            const mailOptions = {
                from: `Coder Test <${EMAIL_USER}>`,
                to: email,
                subject: "Confirmación de Compra",
                html: `
                <h3>Confirmación de compra</h3>
                <p>Gracias por tu compra ${first_name}</p>
                <p>El numero de tu orden es: ${ticket}</p>`
            }
            await this.transporter.sendMail(mailOptions);
        } catch (error) {
            console.log('error al enviar el mail')
        }
    }

    async sendEmailPasswordReset(email, first_name, token) {
        try {
            const mailOptions = {
                from: `Coder Test <${EMAIL_USER}>`,
                to: email,
                subject: "Restablecimiento de Contraseña",
                html: `
                        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                         <h2 style="color: #333;">Restablecimiento de contraseña</h2>
                         <p>Hola ${first_name},</p>
                         <p>Recuerda que el código es válido por 24hs.</p>
                         <p style="font-size: 18px;">Tu código de restablecimiento: <strong>${token}</strong></p>
                         <p><a href="https://timewave-production.up.railway.app/change-password" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Click Aquí para restablecer tu contraseña</a></p>
                        </div>
`
            }
            await this.transporter.sendMail(mailOptions);

        } catch (error) {
            console.log('error al enviar el mail restablecimiento')
        }
    }

    async sendDeleteEmailAccount(email, first_name) {
        try {
            const mailOptions = {
                from: `Coder Test <${EMAIL_USER}>`,
                to: email, 
                subject: "Notificación de Eliminación de Cuenta", 
                html: `
                    <h3>Notificación de Eliminación de Cuenta</h3>
                    <p>Estimado/a ${first_name},</p>
                    <p>Tu cuenta ha sido eliminada debido a inactividad prolongada.</p>
                    <p>Gracias por tu comprensión.</p>
                    <p>Esperamos tu visita nuevamente!<a href="https://timewave-production.up.railway.app/login">Nuestra App</a></p>`
            };
            await this.transporter.sendMail(mailOptions);
            console.log('Correo de eliminación enviado');
        } catch (error) {
            console.log('Error al enviar el correo de eliminación de cuenta:', error);
        }
    }

    async sendDeleteProductInfo(email,product){
        try {
            const mailOptions = {
                from: `Coder Test <${EMAIL_USER}>`,
                to: email, 
                subject: "Notificación de Eliminación de Producto", 
                html: `
                    <h3>Notificación de Eliminación de Producto</h3>
                    <p>Estimado/a</p>
                    <p>Queremos informarte que el siguiente producto ha sido eliminado:</p>
                    <ul>
                        <li><strong>Título:</strong> ${product.title}</li>
                        <li><strong>Descripción:</strong> ${product.description}</li>
                        <li><strong>Codigo:</strong> ${product.code}</li>
                    </ul>
                    <p>Si tienes alguna pregunta o necesitas más información, no dudes en contactarnos.</p>
                    <p>Gracias por tu comprensión.</p>
                    <p>Esperamos tu visita nuevamente!</p>
                    <a href="https://timewave-production.up.railway.app/login">Nuestra App</a>`
            };
            await this.transporter.sendMail(mailOptions);
            console.log('Correo enviado');
            
        } catch (error) {
            console.log('Error al enviar el correo de eliminación de producto:', error);
        }
    }
}



module.exports = EmailManager;