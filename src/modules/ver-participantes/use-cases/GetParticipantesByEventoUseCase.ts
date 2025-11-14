import { IEventoParticipanteRepository } from '../../../domain/interfaces/IEventoParticipanteRepository';
import { ParticipanteResultDto } from '../dtos/GetParticipantesDto';

export class GetParticipantesByEventoUseCase {
  constructor(private eventoParticipanteRepository: IEventoParticipanteRepository) {}

  async execute(eventoId: number): Promise<ParticipanteResultDto[]> {
    if (!eventoId) {
      throw new Error('evento_id es requerido');
    }

    const participantes = await this.eventoParticipanteRepository.findParticipantesByEventoAndRol(eventoId);
    return participantes;
  }
}
