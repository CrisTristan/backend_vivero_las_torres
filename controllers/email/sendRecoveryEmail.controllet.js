import "dotenv/config";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const from = process.env.EMAIL_FROM || "Acme <onboarding@resend.dev>";

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:4200";

export default class EmailController {
    constructor() {
        this.resend = resend;
        this.from = from;
        this.FRONTEND_URL = FRONTEND_URL;
    }

    async sendRecoveryEmail(to, recoveryToken) {
        const { data, error } = await this.resend.emails.send({
            from: this.from,
            to: ['cristian_abad777@outlook.com'],
            subject: "Recuperación de contraseña",
            html: `
                <h1>Recuperación de contraseña</h1>
                <p>Hola,</p>
                <p>Has solicitado recuperar tu contraseña. Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
                <a href="${this.FRONTEND_URL}/reset-password?token=${recoveryToken}" target="_blank">Restablecer contraseña</a>
                <p>Si no has solicitado esta acción, ignora este correo.</p>
            `,
  text: "Welcome! This email was sent using Resend's Node.js SDK.",
});

if (error) {
  console.error("Error sending email:", error);
  process.exit(1);
}

console.log("Email sent successfully!");
console.log("Email ID:", data?.id);
    }
}