import { IRecursoRepository } from '../../../domain/interfaces/IRecursoRepository';
import { IEventoRepository } from '../../../domain/interfaces/IEventoRepository';
import { GetRecursosByEventoDto, GetRecursosResultDto, RecursoDetailDto } from '../dtos/VisualizarRecursosDto';

export class GetRecursosByEventoUseCase {
  constructor(
    private recursoRepository: IRecursoRepository,
    private eventoRepository: IEventoRepository
  ) {}

  async execute(dto: GetRecursosByEventoDto): Promise<GetRecursosResultDto> {
    if (!dto.evento_id) {
      throw new Error('evento_id es requerido');
    }

    try {
      // Verificar que el evento existe
      const evento = await this.eventoRepository.findById(dto.evento_id);
      if (!evento) {
        throw new Error('Evento no encontrado');
      }

      // Obtener recursos del evento
      let recursos;
      if (dto.tipo_recurso) {
        // Filtrar por tipo específico
        recursos = await this.recursoRepository.findByEventoAndTipo(dto.evento_id, dto.tipo_recurso);
      } else {
        // Obtener todos los recursos del evento
        recursos = await this.recursoRepository.findRecursosWithDetailsForEvento(dto.evento_id);
      }

      // Mapear a DTOs
      const recursosDto: RecursoDetailDto[] = recursos.map((r: any) => ({
        recurso_id: r.recurso_id,
        nombre: r.nombre,
        url: r.url,
        tipo: {
          tipo_recurso_id: r.tipo.tipo_recurso_id,
          nombre: r.tipo.nombre
        },
        evento: {
          evento_id: r.evento.evento_id,
          nombre: r.evento.nombre
        }
      }));

      return {
        success: true,
        recursos: recursosDto,
        total: recursosDto.length
      };

    } catch (error: any) {
      console.error('Error obteniendo recursos del evento:', error);
      
      if (error.message === 'Evento no encontrado') {
        throw error;
      }
      
      throw new Error('Database connection error');
    }
  }
}
