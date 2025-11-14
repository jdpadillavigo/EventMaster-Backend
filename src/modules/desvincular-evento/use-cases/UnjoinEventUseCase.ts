import { IEventoParticipanteRepository } from '../../../domain/interfaces/IEventoParticipanteRepository';
import { IRolRepository } from '../../../domain/interfaces/IRolRepository';
import { IParticipanteRepository } from '../../../domain/interfaces/IParticipanteRepository';
import { UnjoinEventDto, UnjoinEventResultDto } from '../dtos/UnjoinEventDto';

export class UnjoinEventUseCase {
  constructor(
    private eventoParticipanteRepository: IEventoParticipanteRepository,
    private rolRepository: IRolRepository,
    private participanteRepository: IParticipanteRepository
  ) {}

  async execute(dto: UnjoinEventDto): Promise<UnjoinEventResultDto> {
    const { evento_id, usuario_id } = dto;

    if (!evento_id || !usuario_id) {
      throw new Error('Event ID and User ID are required');
    }

    try {
      // Buscar el rol de "Asistente" (no organizador)
      const rolAsistente = await this.rolRepository.findByNombre('Asistente');
      if (!rolAsistente) {
        throw new Error('Asistente role not found');
      }

      // Buscar el participante con el rol específico
      const participante = await this.participanteRepository.findByUsuarioAndRol(
        usuario_id, 
        rolAsistente.rol_id
      );
      if (!participante) {
        throw new Error('User is not a participant in any event');
      }

      // Eliminar la relación evento-participante
      await this.eventoParticipanteRepository.delete(evento_id, participante.participante_id);

      return {
        success: true,
        message: 'Successfully left the event'
      };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to leave event');
    }
  }
}
