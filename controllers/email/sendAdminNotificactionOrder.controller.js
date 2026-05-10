import "dotenv/config";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const from = process.env.EMAIL_FROM || "Acme <onboarding@resend.dev>";

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:4200";


export default class NotificationOrderController{
        constructor() {
        this.resend = resend;
        this.from = from;
        this.FRONTEND_URL = FRONTEND_URL;
    }

    
    async sendAdminNotificationEmail(to, nombre, apellidos, orderId) {
        const nombreCompleto = `${nombre} ${apellidos}`.trim();
        const { data, error } = await this.resend.emails.send({
            from: this.from,
            to: [to],
            subject: "🌱 Nueva orden recibida - Vivero Las Torres",
            html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); padding: 20px; border-radius: 10px;">
                    <!-- Header -->
                    <div style="background: linear-gradient(135deg, #2d5016 0%, #3d7024 100%); border-radius: 10px 10px 0 0; padding: 30px 20px; text-align: center; color: white;">
                        <h1 style="margin: 0; font-size: 32px; color: #fff; text-shadow: 2px 2px 4px rgba(0,0,0,0.2);">🌿 Nueva Orden Recibida</h1>
                    </div>

                    <!-- Content -->
                    <div style="background: white; padding: 30px 20px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                        <!-- Greeting -->
                        <p style="font-size: 16px; color: #2d5016; margin: 0 0 20px 0; font-weight: 600;">¡Hola, ${nombreCompleto}!</p>
                        
                        <!-- Main message -->
                        <div style="background: #f0f8e8; border-left: 4px solid #2d5016; padding: 15px; border-radius: 5px; margin-bottom: 25px;">
                            <p style="font-size: 15px; color: #333; margin: 0; line-height: 1.6;">
                                Nos complace informarte que <strong style="color: #2d5016;">alguien ha realizado una nueva orden</strong> en nuestro Vivero Las Torres. 🎉
                            </p>
                        </div>

                        <!-- Order Details -->
                        <div style="background: #f9f9f9; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
                            <h3 style="color: #2d5016; margin: 0 0 15px 0; font-size: 18px;">📋 Detalles de la Orden</h3>
                            <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #e0e0e0;">
                                <span style="color: #666; font-weight: 500;">ID de la Orden:</span>
                                <span style="background: #2d5016; color: white; padding: 8px 16px; border-radius: 5px; font-weight: bold; font-size: 14px;">${orderId}</span>
                            </div>
                            <p style="color: #999; font-size: 13px; margin: 15px 0 0 0;">Por favor, revisa el panel de administración para más detalles sobre esta orden.</p>
                        </div>

                        <!-- CTA Button -->
                        <div style="text-align: center; margin-bottom: 25px;">
                            <a href="${this.FRONTEND_URL}/panel-admin-main" style="background: linear-gradient(135deg, #2d5016 0%, #3d7024 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; box-shadow: 0 4px 6px rgba(45, 80, 22, 0.3); transition: transform 0.3s ease;">
                                📱 Ir al Panel de Administración
                            </a>
                        </div>

                        <!-- Footer message -->
                        <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; text-align: center; border-top: 1px solid #e0e0e0; margin-top: 25px;">
                            <p style="color: #999; font-size: 13px; margin: 0; line-height: 1.6;">
                                Gracias por ser parte de <strong style="color: #2d5016;">Vivero Las Torres</strong>. <br>
                            </p>
                        </div>
                    </div>

                    <!-- Signature -->
                    <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
                        <p style="margin: 0;">© 2026 Vivero Las Torres. Todos los derechos reservados.</p>
                    </div>
                </div>
            `
        });

        if (error) {
            console.error("Error sending email:", error);
            throw new Error(error.message);
        }

        console.log("Email sent successfully!");
        console.log("Email ID:", data?.id);
        return data;
    }
}