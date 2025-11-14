import { IUsuarioRepository } from '../../../domain/interfaces/IUsuarioRepository';
import { IClienteRepository } from '../../../domain/interfaces/IClienteRepository';
import { EmailService } from '../../../infrastructure/services/EmailService';
import { RegistrarUsuarioDto, RegistrarUsuarioResponseDto } from '../dtos/RegistrarUsuarioDto';

export class RegistrarUsuarioUseCase {
  constructor(
    private usuarioRepository: IUsuarioRepository,
    private clienteRepository: IClienteRepository,
    private emailService: EmailService
  ) {}

  async execute(dto: RegistrarUsuarioDto): Promise<RegistrarUsuarioResponseDto> {
    // 1. Validar campos requeridos
    if (!dto.correo || !dto.clave || !dto.nombre || !dto.apellido) {
      throw new Error('Todos los campos son requeridos: correo, clave, nombre, apellido');
    }

    // 2. Validar formato de correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(dto.correo)) {
      throw new Error('Formato de correo inválido');
    }

    // 3. Validar longitud de clave (mínimo 6 caracteres)
    if (dto.clave.length < 6) {
      throw new Error('La clave debe tener al menos 6 caracteres');
    }

    // 4. Validar longitud de campos según el modelo
    if (dto.correo.length > 30) {
      throw new Error('El correo no puede exceder 30 caracteres');
    }

    if (dto.clave.length > 20) {
      throw new Error('La clave no puede exceder 20 caracteres');
    }

    if (dto.nombre.length > 50 || dto.apellido.length > 50) {
      throw new Error('El nombre y apellido no pueden exceder 50 caracteres');
    }

    // 5. Verificar si el correo ya existe
    const usuarioExistente = await this.usuarioRepository.findByEmail(dto.correo);

    // Si el usuario existe y YA está activo, no permitir re-registro
    if (usuarioExistente) {
      throw new Error('El correo ya está registrado');
    } 

    // 6. Generar token de activación
    const activationToken = Math.random().toString(36).substring(2, 15) + 
                           Math.random().toString(36).substring(2, 15);
                           
    const tokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas

    let usuarioId: number;

    // 7. Crear nuevo usuario
    const usuario = await this.usuarioRepository.create({
      correo: dto.correo,
      clave: dto.clave,
      isActive: false,
      activation_token: activationToken,
      token_expires_at: tokenExpiresAt
    });

    await this.clienteRepository.create({
      nombre: dto.nombre,
      apellido: dto.apellido,
      usuario_id: usuario.usuario_id
    });

    usuarioId = usuario.usuario_id;
   

    // 8. Enviar correo de activación (asíncrono, no bloquea la respuesta)
    this.emailService.sendActivationEmail(dto.correo, activationToken, dto.nombre)
      .then(() => {
        console.log('✅ Email de activación enviado exitosamente a:', dto.correo);
      })
      .catch((emailError: any) => {
        console.error('❌ Error enviando email:', emailError?.message);
        console.error('⚠️ El usuario puede activar su cuenta manualmente si es necesario');
      });

    return {
      success: true,
      message: 'Usuario registrado exitosamente. Por favor, revisa tu correo para activar tu cuenta.',
      data: {
        usuario_id: usuarioId,
        correo: dto.correo,
        nombre: dto.nombre,
        apellido: dto.apellido,
        isActive: false,
        activation_token: activationToken,
        token_expires_at: tokenExpiresAt
      }
    };
  }
}
