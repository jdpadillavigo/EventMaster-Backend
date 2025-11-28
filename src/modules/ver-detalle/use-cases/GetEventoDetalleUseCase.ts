import { EventoRepository } from '../../../infrastructure/repositories/EventoRepository';

export class GetEventoDetalleUseCase {
  constructor(
    private readonly eventoRepository: EventoRepository,
  ) {}

  async execute(eventoId: number): Promise<any> {
    if (!eventoId || Number.isNaN(eventoId)) {
      throw new Error('Invalid event id');
    }

    const evento = await this.eventoRepository.findById(eventoId);
    if (!evento) {
      throw new Error('Event not found');
    }

    return evento;
  }
}
