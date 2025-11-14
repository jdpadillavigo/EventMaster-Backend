import { IRecursoRepository } from '../../../domain/interfaces/IRecursoRepository';
import { IEventoRepository } from '../../../domain/interfaces/IEventoRepository';
import { EliminarRecursoDto, EliminarRecursoResultDto } from '../dtos/EliminarRecursoDto';
import { TipoNotificacion } from '../../../domain/value-objects/TipoNotificacion';
import { NotificacionFabrica } from '../../../infrastructure/patterns/factoryMethod/NotificacionFabrica';

export class EliminarRecursoUseCase {
  constructor(
    private recursoRepository: IRecursoRepository,
    private eventoRepository: IEventoRepository
  ) {}

  async execute(dto: EliminarRecursoDto, usuarioId: number): Promise<EliminarRecursoResultDto> {
    // Validar datos requeridos
    if (!dto.evento_id || !dto.recurso_id) {
      throw new Error('evento_id y recurso_id son requeridos');
    }

    if (!usuarioId) {
      throw new Error('usuario_id es requerido');
    }

    try {
      // Verificar que el evento existe
      const evento = await this.eventoRepository.findById(dto.evento_id);
      if (!evento) {
        throw new Error('Evento no encontrado');
      }

      // Verificar que el recurso existe y pertenece al evento
      const recurso = await this.recursoRepository.findById(dto.recurso_id);
      if (!recurso) {
        throw new Error('Recurso no encontrado');
      }

      // Verificar que el recurso pertenece al evento especificado
      if (recurso.evento_id !== dto.evento_id) {
        throw new Error('El recurso no pertenece a este evento');
      }

      // Eliminar el recurso directamente (ya que ahora pertenece directamente al evento)
      const eliminado = await this.recursoRepository.delete(dto.recurso_id);

      if (!eliminado) {
        throw new Error('No se pudo eliminar el recurso');
      }

      // Crear notificación para los participantes del evento
      await NotificacionFabrica.crearNotificacion(
        new Date(),
        dto.evento_id,
        TipoNotificacion.ACCION,
        `Se eliminó el recurso: ${recurso.nombre}`
      );

      return {
        success: true,
        message: 'Recurso eliminado exitosamente',
        recurso_eliminado: {
          recurso_id: recurso.recurso_id,
          nombre: recurso.nombre,
          tipo: recurso.tipo.nombre
        }
      };

    } catch (error: any) {
      console.error('Error eliminando recurso:', error);
      
      if (error.message.includes('no encontrado') || 
          error.message.includes('no pertenece') ||
          error.message.includes('No tienes permisos')) {
        throw error;
      }
      
      throw new Error('Error interno del servidor');
    }
  }
}
