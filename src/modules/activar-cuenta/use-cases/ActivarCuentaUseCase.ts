import { IUsuarioRepository } from '../../../domain/interfaces/IUsuarioRepository';
import { EmailService } from '../../../infrastructure/services/EmailService';
import { ActivarCuentaDto, ActivarCuentaResponseDto } from '../dtos/ActivarCuentaDto';

export class ActivarCuentaUseCase {
  constructor(
    private usuarioRepository: IUsuarioRepository,
    private emailService: EmailService
  ) {}

  async execute(dto: ActivarCuentaDto): Promise<ActivarCuentaResponseDto> {
    // 1. Validar que el token sea proporcionado
    if (!dto.token) {
      throw new Error('Token de activación es requerido');
    }

    // 2. Buscar usuario por token de activación
    const usuario = await this.usuarioRepository.findByActivationToken(dto.token);

    if (!usuario) {
      return {
        success: false,
        message: 'Token inválido',
        expired: false
      };
    }

    // 3. Verificar si el token expiró
    if (usuario.token_expires_at && new Date() > new Date(usuario.token_expires_at)) {
      return {
        success: false,
        message: 'El token de activación ha expirado',
        expired: true
      };
    }

    // 4. Verificar si la cuenta ya está activa
    if (usuario.isActive) {
      return {
        success: false,
        message: 'La cuenta ya está activa',
        expired: false
      };
    }

    // 5. Activar la cuenta y limpiar el token
    await this.usuarioRepository.update(usuario.usuario_id, {
      isActive: true,
      activation_token: null,
      token_expires_at: null
    });

    // 6. Enviar email de bienvenida
    try {
      await this.emailService.sendWelcomeEmail(usuario.correo, usuario.cliente?.nombre || 'Usuario');
      console.log('✅ Email de bienvenida enviado a:', usuario.correo);
    } catch (emailError) {
      console.error('❌ Error enviando email de bienvenida:', emailError);
    }

    return {
      success: true,
      message: 'Cuenta activada exitosamente',
      data: {
        usuario_id: usuario.usuario_id,
        correo: usuario.correo,
        nombre: usuario.cliente?.nombre,
        apellido: usuario.cliente?.apellido,
        isActive: true
      }
    };
  }
}
