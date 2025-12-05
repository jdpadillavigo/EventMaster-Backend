import nodemailer from 'nodemailer';

/**
 * Servicio de Email para envío de correos electrónicos
 * Utiliza Nodemailer con configuración SMTP
 * Compatible con servicios como Resend, SendGrid, Gmail, etc.
 */
export class EmailService {
  private transporter!: nodemailer.Transporter;

  constructor() {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    const isProduction = process.env.NODE_ENV === 'production';

    // Configuración robusta para SMTP
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true', // true para 465, false para otros
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      },
      // Opciones críticas para evitar timeouts en la nube (Railway/AWS)
      connectionTimeout: 10000, // 10 segundos
      greetingTimeout: 10000,
      socketTimeout: 10000,
      pool: true, // Usar pool de conexiones para mejor rendimiento
      maxConnections: 5,
      maxMessages: 100,
      // Deshabilitar verificación de certificados en desarrollo si es necesario
      tls: {
        rejectUnauthorized: isProduction
      }
    });

    this.verifyConnection();
  }

  /**
   * Verifica la conexión SMTP al iniciar
   */
  private async verifyConnection() {
    try {
      await this.transporter.verify();
      console.log('✅ Servidor SMTP listo para enviar correos');
    } catch (error: any) {
      console.error('❌ Error de conexión SMTP:', error.message);
      console.warn('⚠️ El servicio de correos no funcionará hasta que se corrija la configuración SMTP');
    }
  }

  /**
   * Envía email de activación de cuenta
   */
  async sendActivationEmail(email: string, activationToken: string, userName: string): Promise<{ success: boolean; messageId?: string }> {
    try {
      console.log('📧 Preparando email de activación para:', email);

      // Usar URL del frontend configurada o fallback seguro
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      // Asegurar que no tenga slash final para evitar doble slash
      const baseUrl = frontendUrl.endsWith('/') ? frontendUrl.slice(0, -1) : frontendUrl;
      const activationUrl = `${baseUrl}/activate/${activationToken}`;

      const mailOptions = {
        from: `"EventMaster" <${process.env.SMTP_FROM || process.env.SMTP_USER || 'noreply@eventmaster.com'}>`,
        to: email,
        subject: '🎉 Activa tu cuenta en EventMaster',
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 0; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden;">
            <div style="text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">¡Bienvenido a EventMaster!</h1>
            </div>
            
            <div style="background: #ffffff; padding: 40px 30px;">
              <h2 style="color: #333; margin-top: 0; font-size: 22px;">Hola ${userName},</h2>
              
              <p style="color: #555; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
                Gracias por registrarte. Estás a un solo paso de comenzar a crear y gestionar eventos increíbles.
                Por favor, activa tu cuenta haciendo clic en el botón de abajo:
              </p>
              
              <div style="text-align: center; margin: 35px 0;">
                <a href="${activationUrl}" 
                   style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                          color: white; 
                          padding: 16px 32px; 
                          text-decoration: none; 
                          border-radius: 50px; 
                          font-weight: bold; 
                          font-size: 16px;
                          display: inline-block;
                          box-shadow: 0 4px 15px rgba(118, 75, 162, 0.3);
                          transition: transform 0.2s;">
                  Activar Mi Cuenta
                </a>
              </div>
              
              <p style="color: #666; font-size: 14px; line-height: 1.6; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
                <strong>¿Problemas con el botón?</strong> Copia y pega este enlace en tu navegador:<br>
                <a href="${activationUrl}" style="color: #667eea; word-break: break-all;">${activationUrl}</a>
              </p>
              
              <div style="background: #fff8e1; border-left: 4px solid #ffc107; padding: 15px; margin-top: 25px; border-radius: 4px;">
                <p style="color: #856404; margin: 0; font-size: 14px;">
                  ⏰ <strong>Nota:</strong> Este enlace expira en 24 horas por seguridad.
                </p>
              </div>
            </div>
            
            <div style="background: #f8f9fa; text-align: center; padding: 20px; color: #999; font-size: 12px; border-top: 1px solid #e0e0e0;">
              <p style="margin: 0;">© ${new Date().getFullYear()} EventMaster. Todos los derechos reservados.</p>
              <p style="margin: 5px 0 0;">Si no creaste esta cuenta, puedes ignorar este mensaje.</p>
            </div>
          </div>
        `
      };

      console.log('📤 Enviando email de activación...');
      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email enviado. ID:', info.messageId);
      return { success: true, messageId: info.messageId };

    } catch (error: any) {
      console.error('❌ Error CRÍTICO enviando email:', error.message);
      // No lanzamos error para no romper el flujo de registro, pero logueamos detalladamente
      return { success: false };
    }
  }

  /**
   * Envía email de bienvenida después de activación exitosa
   */
  async sendWelcomeEmail(email: string, userName: string): Promise<{ success: boolean; messageId?: string }> {
    try {
      const mailOptions = {
        from: `"EventMaster" <${process.env.SMTP_FROM || process.env.SMTP_USER || 'noreply@eventmaster.com'}>`,
        to: email,
        subject: '🎉 ¡Cuenta activada exitosamente!',
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 0; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden;">
            <div style="text-align: center; background: linear-gradient(135deg, #28a745 0%, #20c997 100%); padding: 40px 20px;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">¡Cuenta Activada!</h1>
            </div>
            
            <div style="background: #ffffff; padding: 40px 30px;">
              <h2 style="color: #333; margin-top: 0; font-size: 22px;">¡Hola ${userName}!</h2>
              
              <p style="color: #555; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
                Tu cuenta ha sido verificada correctamente. Ya eres parte oficial de la comunidad EventMaster.
              </p>
              
              <div style="background: #d4edda; border: 1px solid #c3e6cb; padding: 20px; border-radius: 8px; margin: 25px 0; text-align: center;">
                <p style="color: #155724; margin: 0; font-size: 16px; font-weight: 500;">
                  ✅ Tu cuenta está lista para usar
                </p>
              </div>
            </div>
            
            <div style="background: #f8f9fa; text-align: center; padding: 20px; color: #999; font-size: 12px; border-top: 1px solid #e0e0e0;">
              <p style="margin: 0;">© ${new Date().getFullYear()} EventMaster. Todos los derechos reservados.</p>
            </div>
          </div>
        `
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email de bienvenida enviado:', info.messageId);
      return { success: true, messageId: info.messageId };

    } catch (error) {
      console.error('❌ Error enviando email de bienvenida:', error);
      return { success: false };
    }
  }
}
