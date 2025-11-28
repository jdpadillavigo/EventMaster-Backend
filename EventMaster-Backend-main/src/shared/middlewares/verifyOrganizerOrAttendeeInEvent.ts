import { Request, Response, NextFunction } from "express";
import { IParticipanteRepository } from "domain/interfaces/IParticipanteRepository";
import { IEventoParticipanteRepository } from "domain/interfaces/IEventoParticipanteRepository";

export class VerifyOrganizerOrAttendeeInEvent {
  constructor(
    private participanteRepository: IParticipanteRepository,
    private eventoParticipanteRepository: IEventoParticipanteRepository
  ) {}
  
  public async verify(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id; // viene del JWT

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: "Usuario no autenticado."
        });
      }

      // Verificar si el usuario es organizador o asistente del evento
      const esAutorizado = await this.esOrganizadorOAsistente(userId);
      
      if (!esAutorizado) {
        return res.status(403).json({
          success: false,
          message: "No tienes permisos para realizar esta acción. Se requiere ser organizador o asistente del evento."
        });
      }

      next();
    } catch (error) {
      console.error("Error en verifyOrganizerOrAttendeeInEvent:", error);
      res.status(500).json({
        success: false,
        message: "Error interno al validar permisos."
      });
    }
  }

  private async esOrganizadorOAsistente(userId: number): Promise<boolean> {
    // 3. Buscar si el usuario es participante
    const participante = await this.participanteRepository.findByUsuario(userId)

    // 5. Verificar si es participante
    if (!participante) {
      return false;
    }

    // 6. Buscar si esta vinculado a un evento
    const estaEnEvento = await this.eventoParticipanteRepository.findByParticipante(participante.participante_id);

    return !!estaEnEvento; // Devuelve true si tiene al menos un evento, false si no
  }
}
