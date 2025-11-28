import { CrearEventoDto } from '../dtos/CrearEventoDto'
import { IEventoRepository } from '../../../domain/interfaces/IEventoRepository'
import { IUbicacionRepository } from '../../../domain/interfaces/IUbicacionRepository'
import { IRolRepository } from '../../../domain/interfaces/IRolRepository'
import { IParticipanteRepository } from '../../../domain/interfaces/IParticipanteRepository'
import { IEventoParticipanteRepository } from '../../../domain/interfaces/IEventoParticipanteRepository'

const db = require('../../../infrastructure/database/models')

export class CreateEventoUseCase {
  constructor(
    private eventoRepository: IEventoRepository,
    private ubicacionRepository: IUbicacionRepository,
    private rolRepository: IRolRepository,
    private participanteRepository: IParticipanteRepository,
    private eventoParticipanteRepository: IEventoParticipanteRepository
  ) {}

  async execute(input: CrearEventoDto) {
    const {
      name,
      date,
      capacity,
      description,
      privacy,
      ownerId,
      locationAddress,
      imageUrl,
      lat,
      lng,
    } = input

    if (!name || !date || !capacity || !ownerId) {
      throw new Error('Missing required fields')
    }

    if (Number(capacity) < 1 || Number(capacity) > 100) {
      throw new Error('Capacity must be between 1 and 100')
    }

    if (!imageUrl || String(imageUrl).trim().length === 0) {
      throw new Error('Image is required')
    }

    // Nombre único (case-insensitive)
    const exists = await this.eventoRepository.findByTituloLowerCase(name)
    if (exists) {
      throw new Error('Event name must be unique')
    }

    const fechaInicio = new Date(date)
    if (!(fechaInicio instanceof Date) || Number.isNaN(fechaInicio.getTime())) {
      throw new Error('Invalid date')
    }

    // Validar que esté en Lima por dirección o bounding box
    const isLimaByText = /lima/i.test(String(locationAddress || ''))
    const isLimaByCoords = typeof lat === 'number' && typeof lng === 'number'
      && lat >= -12.5 && lat <= -11.7 && lng >= -77.3 && lng <= -76.6
    if (!isLimaByText && !isLimaByCoords) {
      throw new Error('Location must be within Lima')
    }

    const ID_ESTADO_PROGRAMADO = 1
    const ID_PRIVACIDAD_PUBLICO = 1
    const ID_PRIVACIDAD_PRIVADO = 2

    const privacidadId = (String(privacy || '').toLowerCase() === 'private')
      ? ID_PRIVACIDAD_PRIVADO
      : ID_PRIVACIDAD_PUBLICO

    // Límite por usuario: máximo 5 eventos como Organizador
    const existingCount = await this.eventoRepository.countEventosByOrganizador(ownerId)

    if (existingCount >= 5) {
      throw new Error('You reached your event limit')
    }

    const nuevo = await db.sequelize.transaction(async (t: any) => {
      const evento = await this.eventoRepository.create({
        titulo: name,
        descripcion: description ?? null,
        fechaInicio,
        fechaFin: new Date(fechaInicio.getTime() + 24 * 60 * 60 * 1000),
        imagen: imageUrl ?? null,
        nroParticipantes: 0,
        aforo: Number(capacity),
        estadoEvento: ID_ESTADO_PROGRAMADO,
        privacidad: privacidadId,
      })

      const direccion = locationAddress || ''
      if (direccion) {
        await this.ubicacionRepository.create({
          direccion,
          latitud: lat ?? null,
          longitud: lng ?? null,
          evento_id: evento.evento_id,
        })
      }

      const rolOrganizador = await this.rolRepository.findByNombre('Organizador')
      const rolId = rolOrganizador?.rol_id ?? 1
      let participante = await this.participanteRepository.findByUsuarioAndRol(ownerId, rolId)
      if (!participante) {
        participante = await this.participanteRepository.create({ usuario_id: ownerId, rol_id: rolId })
      }

      await this.eventoParticipanteRepository.create(evento.evento_id, participante.participante_id)

      return evento
    })

    return { success: true, evento: { id: nuevo.evento_id } }
  }
}
