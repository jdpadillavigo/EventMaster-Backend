import { Request, Response, NextFunction } from "express";
import { IRolRepository } from "domain/interfaces/IRolRepository";
import { IParticipanteRepository } from "domain/interfaces/IParticipanteRepository";
import { IEventoParticipanteRepository } from "domain/interfaces/IEventoParticipanteRepository";
import { TipoRol } from "domain/value-objects/TipoRol";

export class VerifyOrganizerGlobal {
  constructor(
    private rolRepository: IRolRepository,
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

      // Verificar si el usuario es organizador de algún evento
      const esAutorizado = await this.esOrganizador(userId);
      
      if (!esAutorizado) {
        return res.status(403).json({
          success: false,
          message: "No tienes permisos para realizar esta acción. Se requiere ser organizador de al menos un evento."
        });
      }

      next();
    } catch (error) {
      console.error("Error en verifyOrganizerGlobal:", error);
      res.status(500).json({
        success: false,
        message: "Error interno al validar permisos."
      });
    }
  }

  private async esOrganizador(userId: number): Promise<boolean> {
    // 1. Obtener el rol de organizador
    const rolOrganizador = await this.rolRepository.findByNombre(TipoRol.ORGANIZADOR);

    // 2. Verificar si el rol existe
    if (!rolOrganizador) {
      return false;
    }

    // 3. Buscar si el usuario tiene el rol de organizador
    const participanteOrganizador = await this.participanteRepository.findByUsuarioAndRol(userId, rolOrganizador.rol_id);

    // 4. Verificar si tiene el rol
    if (!participanteOrganizador) {
      return false;
    }

    // 5. Buscar si dirige al menos un evento
    const tieneEvento = await this.eventoParticipanteRepository.findByParticipante(participanteOrganizador.participante_id);

    return !!tieneEvento; // Devuelve true si tiene al menos un evento, false si no
  }
}
