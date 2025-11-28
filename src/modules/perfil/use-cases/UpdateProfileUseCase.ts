import { UsuarioRepository } from '../../../infrastructure/repositories/UsuarioRepository'
import { ClienteRepository } from '../../../infrastructure/repositories/ClienteRepository'
import { ProfileResultDto } from '../dtos/ProfileResultDto'
import { UpdateProfileParamsDto } from '../dtos/UpdateProfileParamsDto'

export class UpdateProfileUseCase {
  constructor(
    private usuarioRepository: UsuarioRepository,
    private clienteRepository: ClienteRepository,
  ) {}

  async execute(params: UpdateProfileParamsDto): Promise<ProfileResultDto> {
    const { usuarioId, correo, nombre, apellido, foto_perfil } = params

    // Validar correo duplicado si cambia
    if (typeof correo === 'string' && correo.trim() !== '') {
      const existing = await this.usuarioRepository.findByEmail(correo.trim())
      if (existing && Number(existing.usuario_id) !== Number(usuarioId)) {
        const err: any = new Error('El correo ya está registrado por otro usuario')
        err.code = 'EMAIL_TAKEN'
        throw err
      }
    }

    // Validar formato/tamaño de imagen (permitidos: jpg, jpeg, png; máx 2MB si base64)
    if (typeof foto_perfil === 'string' && foto_perfil) {
      const isDataUrl = foto_perfil.startsWith('data:')
      if (isDataUrl) {
        // data:[mime];base64,....
        const match = foto_perfil.match(/^data:(.*?);base64,(.*)$/)
        if (!match) {
          const err: any = new Error('Formato de imagen inválido')
          err.code = 'INVALID_IMAGE_FORMAT'
          throw err
        }
        const mime = (match[1] || '').toLowerCase()
        if (!['image/jpeg', 'image/jpg', 'image/png'].includes(mime)) {
          const err: any = new Error('Formato de imagen no permitido. Usa JPG o PNG')
          err.code = 'INVALID_IMAGE_MIME'
          throw err
        }
        // tamaño en bytes del base64: (longitud * 3/4) - padding
        const b64 = match[2] as string
        const sizeBytes = Math.floor(b64.length * 0.75)
        const maxBytes = 2 * 1024 * 1024 // 2MB
        if (sizeBytes > maxBytes) {
          const err: any = new Error('La imagen excede el tamaño máximo de 2MB')
          err.code = 'IMAGE_TOO_LARGE'
          throw err
        }
      } else {
        // URL: validar extensión
        const lower = foto_perfil.toLowerCase()
        if (!/(\.jpg|\.jpeg|\.png)(\?.*)?$/.test(lower)) {
          const err: any = new Error('La URL de la imagen debe terminar en .jpg, .jpeg o .png')
          err.code = 'INVALID_IMAGE_URL'
          throw err
        }
      }
    }

    if (typeof correo === 'string' && correo.trim() !== '') {
      await this.usuarioRepository.update(usuarioId, { correo })
    }

    await this.clienteRepository.update(usuarioId, {
      ...(typeof nombre === 'string' ? { nombre } : {}),
      ...(typeof apellido === 'string' ? { apellido } : {}),
      ...(typeof foto_perfil === 'string' || foto_perfil === null ? { foto_perfil: foto_perfil ?? null } : {}),
    })

    const user = await this.usuarioRepository.findById(usuarioId)
    if (!user) {
      throw new Error('Usuario no encontrado tras actualización')
    }

    return {
      success: true,
      user: {
        usuario_id: user.usuario_id,
        correo: user.correo,
        nombre: user.cliente?.nombre ?? null,
        apellido: user.cliente?.apellido ?? null,
        foto_perfil: user.cliente?.foto_perfil ?? null,
      },
    }
  }
}