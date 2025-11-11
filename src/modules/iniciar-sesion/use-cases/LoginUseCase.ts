import { UsuarioRepository } from '../../../infrastructure/repositories/UsuarioRepository'
import { LoginParamsDto, LoginResultDto } from '../dtos/LoginDto'

export class LoginUseCase {
  constructor(private usuarioRepository: UsuarioRepository) {}

  async execute(params: LoginParamsDto): Promise<LoginResultDto> {
    const correo = (params?.correo ?? '').trim()
    const clave = (params?.clave ?? '').trim()

    if (!correo || !clave) {
      throw new Error('correo y clave son requeridos')
    }

    const user = await this.usuarioRepository.findByEmail(correo)
    if (!user) {
      throw new Error('Credenciales inválidas')
    }

    if (String(user.clave) !== clave) {
      throw new Error('Credenciales inválidas')
    }

    if (user.isActive === false) {
      throw new Error('Cuenta no activa')
    }

    const result: LoginResultDto = {
      success: true,
      user: {
        usuario_id: user.usuario_id,
        correo: user.correo,
        nombre: user.cliente?.nombre ?? null,
        apellido: user.cliente?.apellido ?? null,
      },
    }
    return result
  }
}
