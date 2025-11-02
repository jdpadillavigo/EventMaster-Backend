import { IInvitacionUsuarioRepository } from '../../../domain/interfaces/IInvitacionUsuarioRepository'
import { GetInvitacionesPrivadasParamsDto, GetInvitacionesPrivadasResultDto, InvitacionPrivadaItemDto } from '../dtos/GetInvitacionesPrivadasDto'

export class GetInvitacionesPrivadasUseCase {
  constructor(
    private invitacionUsuarioRepository: IInvitacionUsuarioRepository
  ) {}

  async execute(params: GetInvitacionesPrivadasParamsDto): Promise<GetInvitacionesPrivadasResultDto> {
    if (!params || typeof params.usuario_id !== 'number') {
      throw new Error('usuario_id es requerido')
    }

    const rows = await this.invitacionUsuarioRepository.findAllByUsuarioIdWithDetalles(params.usuario_id)

    const invitaciones: InvitacionPrivadaItemDto[] = rows.map((r: any) => {
      const invitacion = r.invitacion || null
      const notificacion = invitacion?.notificacion || null
      const evento = notificacion?.evento || null
      return {
        invitacion_usuario_id: r.invitacion_usuario_id,
        estado: r.estado?.nombre || null,
        fechaLimite: invitacion?.fechaLimite ? new Date(invitacion.fechaLimite).toISOString() : null,
        evento: evento
          ? {
              evento_id: evento.evento_id,
              titulo: evento.titulo ?? null,
              fechaInicio: evento.fechaInicio ? new Date(evento.fechaInicio).toISOString() : null,
              fechaFin: evento.fechaFin ? new Date(evento.fechaFin).toISOString() : null,
            }
          : null,
      }
    })

    return { success: true, invitaciones }
  }
}
