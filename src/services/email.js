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
                         <p><a href="http://localhost:8080/change-password" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Click Aquí para restablecer tu contraseña</a></p>
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
                    <p>Esperamos tu visita nuevamente!<a href="http://localhost:8080/login"></p>
                    <p>Gracias por tu comprensión.</p>`
            };
            await this.transporter.sendMail(mailOptions);
            console.log('Correo de eliminación enviado');
        } catch (error) {
            console.log('Error al enviar el correo de eliminación:', error);
        }
    }
}



module.exports = EmailManager;