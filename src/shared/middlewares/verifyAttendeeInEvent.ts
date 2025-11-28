import { Request, Response, NextFunction } from "express"
import { IRolRepository } from "domain/interfaces/IRolRepository"
import { IParticipanteRepository } from "domain/interfaces/IParticipanteRepository"
import { IEventoParticipanteRepository } from "domain/interfaces/IEventoParticipanteRepository"
import { TipoRol } from "domain/value-objects/TipoRol"

export class VerifyAttendeeInEvent {
  constructor(
    private rolRepository: IRolRepository,
    private participanteRepository: IParticipanteRepository,
    private eventoParticipanteRepository: IEventoParticipanteRepository
  ) {}

  public async verify(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id
      const eventoId = Number(req.params?.evento_id)

      if (!userId || !Number.isInteger(userId)) {
        res.status(401).json({ success: false, message: "No autenticado" })
        return
      }
      if (!Number.isInteger(eventoId)) {
        res.status(400).json({ success: false, message: "Invalid event id" })
        return
      }

      const rolAsistente = await this.rolRepository.findByNombre(TipoRol.ASISTENTE)
      if (!rolAsistente) {
        res.status(403).json({ success: false, message: "Rol no encontrado" })
        return
      }

      const participante = await this.participanteRepository.findByUsuarioAndRol(userId, rolAsistente.rol_id)
      if (!participante) {
        res.status(403).json({ success: false, message: "No tienes permisos para realizar esta acción. Se requiere ser asistente del evento." })
        return
      }

      const vinculo = await this.eventoParticipanteRepository
        .findByEventoAndParticipante(eventoId, participante.participante_id)

      if (!vinculo) {
        res.status(403).json({ success: false, message: "No tienes permisos para realizar esta acción. Se requiere ser asistente del evento." })
        return
      }

      next()
    } catch {
      res.status(500).json({ success: false, message: "Error interno" })
    }
  }
}
