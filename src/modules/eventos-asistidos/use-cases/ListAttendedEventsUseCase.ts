import { IEventoRepository } from '../../../domain/interfaces/IEventoRepository'

export class ListAttendedEventsUseCase {
  constructor(
    private eventoRepository: IEventoRepository
  ) {}

  async execute(usuarioId: number) {
    const eventos = await this.eventoRepository.findAttendedEventsByUsuario(usuarioId)

    const payload = (eventos ?? []).map((ev: any) => ({
      id: ev.get('id'),
      name: ev.get('name'),
      dateStart: ev.get('dateStart'),
      dateEnd: ev.get('dateEnd'),
      imageUrl: ev.get('imageUrl'),
    }))

    return { success: true, eventos: payload }
  }
}
