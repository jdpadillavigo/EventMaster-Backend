import { IEventoRepository } from '../../../domain/interfaces/IEventoRepository'

export class ListPublicEventsUseCase {
  constructor(
    private eventoRepository: IEventoRepository
  ) {}

  async execute(usuarioId?: number) {
    const eventos = await this.eventoRepository.findPublicEvents(usuarioId)

    const payload = (eventos ?? []).map((ev: any) => ({
      id: ev.get('id'),
      name: ev.get('name'),
      dateStart: ev.get('dateStart'),
      dateEnd: ev.get('dateEnd'),
      imageUrl: ev.get('imageUrl'),
      attendeesCount: Number(ev.get('attendeesCount') ?? 0),
      location: ev?.ubicacion?.get?.('location') ?? ev?.ubicacion?.direccion ?? 'Sin ubicación',
    }))

    return { success: true, eventos: payload }
  }
}
