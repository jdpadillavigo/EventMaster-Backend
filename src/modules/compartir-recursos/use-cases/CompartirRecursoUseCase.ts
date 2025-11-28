import { IRecursoRepository } from '../../../domain/interfaces/IRecursoRepository';
import { ITipoRecursoRepository } from '../../../domain/interfaces/ITipoRecursoRepository';
import { IEventoRepository } from '../../../domain/interfaces/IEventoRepository';
import { CompartirRecursoDto, CompartirRecursoResultDto } from '../dtos/CompartirRecursoDto';
import { TipoNotificacion } from '../../../domain/value-objects/TipoNotificacion';
import { NotificacionFabrica } from '../../../infrastructure/patterns/factoryMethod/NotificacionFabrica';

export class CompartirRecursoUseCase {
  constructor(
    private recursoRepository: IRecursoRepository,
    private tipoRecursoRepository: ITipoRecursoRepository,
    private eventoRepository: IEventoRepository
  ) {}

  async execute(dto: CompartirRecursoDto, usuarioId: number): Promise<CompartirRecursoResultDto> {
    // Validar datos requeridos
    if (!dto.evento_id || !dto.nombre || !dto.url || !dto.tipo_recurso) {
      throw new Error('evento_id, nombre, url y tipo_recurso son requeridos');
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

      // Verificar que el tipo de recurso existe
      const tipoRecurso = await this.tipoRecursoRepository.findById(dto.tipo_recurso);
      if (!tipoRecurso) {
        throw new Error('Tipo de recurso no encontrado');
      }

      // Verificar si ya existe un recurso con el mismo nombre y URL en el evento
      const recursosEvento = await this.recursoRepository.findByEventoId(dto.evento_id);
      const recursoExistente = recursosEvento.find((r: any) => 
        r.nombre === dto.nombre && r.url === dto.url
      );

      if (recursoExistente) {
        return {
          success: false,
          message: 'Ya existe un recurso con el mismo nombre y URL en este evento'
        };
      }

      // Crear nuevo recurso
      const recurso = await this.recursoRepository.create({
        nombre: dto.nombre,
        url: dto.url,
        tipo_recurso: dto.tipo_recurso,
        evento_id: dto.evento_id
      });

      // Crear notificación para los participantes del evento
      await NotificacionFabrica.crearNotificacion(
        new Date(),
        dto.evento_id,
        TipoNotificacion.ACCION,
        `Se agregó un nuevo recurso: ${dto.nombre}`
      );

      return {
        success: true,
        recurso: {
          recurso_id: recurso.recurso_id,
          nombre: recurso.nombre,
          url: recurso.url,
          tipo: {
            tipo_recurso_id: recurso.tipo.tipo_recurso_id,
            nombre: recurso.tipo.nombre
          },
          evento: {
            evento_id: recurso.evento.evento_id,
            nombre: recurso.evento.nombre
          }
        }
      };

    } catch (error: any) {
      console.error('Error compartiendo recurso:', error);
      
      if (error.message.includes('no encontrado')) {
        throw error;
      }
      
      throw new Error('Error interno del servidor');
    }
  }
}
