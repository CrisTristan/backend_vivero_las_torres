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
            subject: "🌿 Verifica tu correo - Vivero Porto Bello",
            html: `
<div style="margin:0; padding:40px 20px; background-color:#f4f8f2;">
<!--[if mso]>
<table role="presentation" width="600" align="center" cellpadding="0" cellspacing="0" border="0"><tr><td>
<![endif]-->
<table role="presentation" align="center" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px; margin:0 auto; background-color:#ffffff; border-radius:18px; font-family:'Segoe UI', Arial, sans-serif;">
    <tr>
        <td style="padding:0;">

            <!-- Encabezado -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                    <td align="center" bgcolor="#2d6a4f" style="background-color:#2d6a4f; padding:40px 30px; border-radius:18px 18px 0 0;">
                        <h1 style="margin:0; color:#ffffff; font-size:32px; font-weight:700; font-family:'Segoe UI', Arial, sans-serif;">
                            🌿 Vivero Porto Bello
                        </h1>
                        <p style="margin-top:10px; color:#ffffff; font-size:16px; font-family:'Segoe UI', Arial, sans-serif;">
                            Verificación de correo electrónico
                        </p>
                    </td>
                </tr>
            </table>

            <!-- Contenido -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                    <td style="padding:40px 35px; font-family:'Segoe UI', Arial, sans-serif;">
                        <h2 style="margin-top:0; color:#1b4332; font-size:24px;">
                            ¡Bienvenido, ${userName}!
                        </h2>

                        <p style="color:#555; line-height:1.8; font-size:16px;">
                            Gracias por registrarte en <strong>Vivero Porto Bello</strong>.
                            Para garantizar la seguridad de tu cuenta y brindarte una mejor experiencia,
                            necesitamos verificar tu dirección de correo electrónico.
                        </p>

                        <p style="color:#555; line-height:1.8; font-size:16px;">
                            Haz clic en el siguiente botón para confirmar tu correo:
                        </p>

                        <!-- Botón -->
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:35px 0;">
                            <tr>
                                <td align="center" bgcolor="#2d6a4f" style="background-color:#2d6a4f; padding:30px 20px; border-radius:14px;">
                                    <!--[if mso]>
                                    <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${verificationLink}" style="height:52px;v-text-anchor:middle;width:260px;" arcsize="50%" strokecolor="#ffffff" fillcolor="#ffffff">
                                    <w:anchorlock/>
                                    <center style="color:#1b4332;font-family:'Segoe UI', Arial, sans-serif;font-size:16px;font-weight:700;">✓ Verificar mi correo</center>
                                    </v:roundrect>
                                    <![endif]-->
                                    <!--[if !mso]><!-->
                                    <a href="${verificationLink}"
                                       target="_blank"
                                       style="
                                           display:inline-block;
                                           background-color:#ffffff;
                                           color:#1b4332;
                                           text-decoration:none;
                                           padding:16px 36px;
                                           border-radius:50px;
                                           font-size:16px;
                                           font-weight:700;
                                           font-family:'Segoe UI', Arial, sans-serif;
                                       ">
                                        ✓ Verificar mi correo
                                    </a>
                                    <!--<![endif]-->
                                </td>
                            </tr>
                        </table>

                        <p style="color:#666; font-size:14px; line-height:1.7;">
                            Si el botón no funciona, copia y pega el siguiente enlace en tu navegador:
                        </p>

                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:15px 0;">
                            <tr>
                                <td bgcolor="#f8f9fa" style="background-color:#f8f9fa; border:1px solid #e9ecef; border-radius:10px; padding:15px;">
                                    <p style="margin:0; word-break:break-all; color:#40916c; font-size:13px;">
                                        ${verificationLink}
                                    </p>
                                </td>
                            </tr>
                        </table>

                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:30px;">
                            <tr>
                                <td bgcolor="#fff8e6" style="background-color:#fff8e6; border-left:4px solid #f4a261; border-radius:6px; padding:15px;">
                                    <p style="margin:0; color:#6c757d; font-size:14px;">
                                        ⏰ Este enlace expirará en <strong>30 minutos</strong>.
                                        Si no realizaste este registro, puedes ignorar este correo de forma segura.
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>

            <!-- Footer -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                    <td align="center" bgcolor="#f8f9fa" style="background-color:#f8f9fa; padding:25px; border-top:1px solid #e9ecef; border-radius:0 0 18px 18px; font-family:'Segoe UI', Arial, sans-serif;">
                        <p style="margin:0; color:#6c757d; font-size:13px;">
                            © ${new Date().getFullYear()} Vivero Porto Bello
                        </p>
                        <p style="margin:8px 0 0 0; color:#999; font-size:12px;">
                            Jardinería • Paisajismo • Diseño de Exteriores • Mantenimiento Integral
                        </p>
                    </td>
                </tr>
            </table>

        </td>
    </tr>
</table>
<!--[if mso]>
</td></tr></table>
<![endif]-->
</div>
            `,
            text: `Bienvenido a Vivero Porto Bello. Verifica tu correo usando este enlace: ${verificationLink}`
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
