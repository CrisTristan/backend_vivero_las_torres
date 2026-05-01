//Este metodo confirma el email del usuario, cambiando su estado a "verified" en la base de datos. Luego redirige al usuario a una página de confirmación en el frontend.
import "dotenv/config";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const from = process.env.EMAIL_FROM || "Acme <onboarding@resend.dev>";

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:4200";

export default class VerifyEmailController {
    constructor() {
        this.resend = resend;
        this.from = from;
        this.FRONTEND_URL = FRONTEND_URL;
    }

    // Nuevo método para enviar email de verificación de registro
    async sendVerificationEmail(to, verificationToken, userName = 'Usuario') {
        const verificationLink = `${this.FRONTEND_URL}/email-verification?token=${verificationToken}`;

        const { data, error } = await this.resend.emails.send({
            from: this.from,
            to: [to],
            subject: "Verifica tu correo - Vivero Las Torres",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #2d5016;">Bienvenido a Vivero Las Torres</h1>
                    <p>Hola ${userName},</p>
                    <p>Gracias por registrarte. Para completar tu registro, necesitamos verificar tu correo electrónico.</p>
                    <p>Haz clic en el siguiente botón para verificar tu correo:</p>
                    <a href="${verificationLink}" target="_blank" style="display: inline-block; padding: 12px 24px; background-color: #2d5016; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">
                        Verificar mi correo
                    </a>
                    <p>O copia y pega este enlace en tu navegador:</p>
                    <p style="word-break: break-all; color: #666;">${verificationLink}</p>
                    <p style="margin-top: 30px; color: #999; font-size: 12px;">
                        Este enlace expirará en 30 minutos. Si no realizaste este registro, ignora este correo.
                    </p>
                </div>
            `,
            text: `Bienvenido a Vivero Las Torres. Verifica tu correo usando este enlace: ${verificationLink}`
        });

        if (error) {
            console.error("Error sending verification email:", error);
            throw new Error(error.message);
        }

        console.log("Verification email sent successfully!");
        console.log("Email ID:", data?.id);
        return data;
    }
}
