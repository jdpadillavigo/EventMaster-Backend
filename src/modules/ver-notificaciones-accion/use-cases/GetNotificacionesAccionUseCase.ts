import { INotificacionUsuarioRepository } from '../../../domain/interfaces/INotificacionUsuarioRepository'
import { GetNotificacionesAccionParamsDto, GetNotificacionesAccionResultDto, NotificacionAccionItemDto } from '../dtos/GetNotificacionesAccionDto'

export class GetNotificacionesAccionUseCase {
  constructor(
    private notificacionUsuarioRepository: INotificacionUsuarioRepository
  ) {}

  async execute(params: GetNotificacionesAccionParamsDto): Promise<GetNotificacionesAccionResultDto> {
    if (!params || typeof params.usuario_id !== 'number') {
      throw new Error('usuario_id es requerido')
    }

    const rows = await this.notificacionUsuarioRepository.findAllByUsuarioIdWithDetalles(params.usuario_id)

    const notificaciones_accion: NotificacionAccionItemDto[] = rows.map((r: any) => {
      const notificacion_accion = r.notificacion_accion || null
      const notificacion = notificacion_accion?.notificacion || null
      const evento = notificacion?.evento || null
      return {
        notificacion_accion_id: notificacion_accion?.notificacion_id || null,
        fechaHora: notificacion?.fechaHora ? new Date(notificacion.fechaHora).toISOString() : null,
        mensaje: notificacion_accion?.mensaje || null,
        evento: evento
          ? {
              evento_id: evento.evento_id,
              titulo: evento.titulo ?? null,
            }
          : null,
      }
    })

    return { success: true, notificaciones_accion} 
  }
}
