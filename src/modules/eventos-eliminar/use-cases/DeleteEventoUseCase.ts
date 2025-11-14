import { DeleteEventoDto} from '../dtos/DeleteEventoDto';
import { DeleteEventoResultDto } from '../dtos/DeleteEventoResultDto';
import { IEventoRepository } from '../../../domain/interfaces/IEventoRepository';
import { IEventoParticipanteRepository } from '../../../domain/interfaces/IEventoParticipanteRepository';
import { IRolRepository } from '../../../domain/interfaces/IRolRepository';
import { IUbicacionRepository } from '../../../domain/interfaces/IUbicacionRepository';
import { IEstadoEventoRepository } from '../../../domain/interfaces/IEstadoEventoRepository';
import { NotificationManager } from '../../../infrastructure/patterns/observer/NotificationManager';
import { TipoNotificacion } from '../../../domain/value-objects/TipoNotificacion';

export class DeleteEventoUseCase {
  constructor(
    private eventoRepository: IEventoRepository,
    private eventoParticipanteRepository: IEventoParticipanteRepository,
    private rolRepository: IRolRepository,
    private ubicacionRepository: IUbicacionRepository,
    private estadoEventoRepository: IEstadoEventoRepository,
    private notificationManager: NotificationManager
  ) {}

  async execute(dto: DeleteEventoDto): Promise<DeleteEventoResultDto> {
    try {
      // 1. Validar que el evento existe
      const evento = await this.eventoRepository.findById(dto.evento_id);
      if (!evento) {
        throw new Error('Evento no encontrado');
      }

      // 3. Verificar condiciones para eliminar vs cancelar
      const fechaActual = new Date();
      const eventoHaComenzado = new Date(evento.fechaInicio) <= fechaActual;

      
      // Verificar si existe rol Asistente
      const rolAsistente = await this.rolRepository.findByNombre('Asistente');
      if (!rolAsistente) {
        throw new Error('Rol asistente no encontrado');
      }

      // Contar asistentes
      const totalParticipantes = 
          await this.eventoParticipanteRepository.countByEvento(dto.evento_id, [rolAsistente.rol_id]);

      // Verificar si hay asistentes
      const tieneParticipantes = totalParticipantes > 0;

      // 4. Decidir: Eliminar completamente o Cancelar
      if (!eventoHaComenzado && !tieneParticipantes) { // Eliminar
        await this.eventoRepository.delete(dto.evento_id);

        return {
          success: true,
          message: 'Evento eliminado completamente',
          evento_id: dto.evento_id
        };

      } else { // Cancelar
        const estadoCancelado = await this.estadoEventoRepository.findByNombre('Cancelado');

        if (!estadoCancelado) {
          throw new Error('Estado "Cancelado" no encontrado en la base de datos');
        }

        if (tieneParticipantes) {
          // Notificar a los usuarios
          await this.notificationManager.notify(
            TipoNotificacion.EVENTO_CANCELADO,
            {eventoId: dto.evento_id, emisorId: dto.usuario_id}
          );
        }
        
        // Eliminar lo asociado al evento excepto notificaciones
        await this.eventoParticipanteRepository.deleteByEvento(dto.evento_id);
        await this.ubicacionRepository.delete(dto.evento_id);

        // Actualizar estado del evento
        await this.eventoRepository.update(dto.evento_id, {estadoEvento: estadoCancelado.estado_id});

        return {
          success: true,
          message: 'Evento cancelado.',
          evento_id: dto.evento_id,
        };
      }

    } catch (error: any) {
      console.error('Error en DeleteEventoUseCase:', error);
      
      throw error;
    }
  }
}