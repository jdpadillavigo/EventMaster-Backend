import express, { Request, Response, Router } from "express";
import { DependencyContainer } from "../../../shared/utils/DependencyContainer";
import { LIMITE_RESULTADOS_BUSQUEDA } from "../../../domain/value-objects/Constantes";

export class InvitacionController {
  private router: Router;
  private path: string = "/api";

  // Use Cases (inyectados desde el contenedor)
  private searchUsuariosUseCase = DependencyContainer.getSearchUsuariosUseCase();
  private sendInvitacionUseCase = DependencyContainer.getSendInvitacionUseCase();
  private getNoElegiblesUseCase = DependencyContainer.getGetNoElegiblesUseCase();
  private countInvitacionesPendientesUseCase = DependencyContainer.getCountInvitacionesPendientesUseCase();

  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // 1. Endpoint para buscar usuarios por email
    this.router.get("/invitations/search", this.searchUsuarios.bind(this));

    // 2. Endpoint para enviar invitación
    this.router.post("/invitations/send", this.sendInvitacion.bind(this));

    // 3. Obtener no elegibles por evento
    this.router.get("/invitations/no-eligible/:evento_id", this.getNoElegibles.bind(this));

    // 4. Contar invitaciones pendientes por evento
    this.router.get("/invitations/count/:evento_id", this.countInvitacionesPendientes.bind(this));
  }

  // Handler: Buscar usuarios
  private async searchUsuarios(req: Request, res: Response): Promise<void> {
    try {
      const { query } = req.query;

      const usuarios = await this.searchUsuariosUseCase.execute({
        query: query as string,
        limit: LIMITE_RESULTADOS_BUSQUEDA
      });

      res.json({
        success: true,
        usuarios
      });
    } catch (error: any) {
      console.error("Error searching users:", error);
      
      if (error.message === 'Query parameter is required') {
        res.status(400).json({
          success: false,
          message: error.message
        });
        return;
      }

      if (error.message === 'Database connection error') {
        res.status(500).json({
          success: false,
          message: error.message
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  }

  // Handler: Enviar invitación
  private async sendInvitacion(req: Request, res: Response): Promise<void> {
    try {
      const { evento_id, usuario_ids, fechaLimite } = req.body;

      const result = await this.sendInvitacionUseCase.execute({
        evento_id,
        usuario_ids,
        fechaLimite
      });

      res.status(201).json(result);
    } catch (error: any) {
      console.error("Error sending invitation:", error);

      if (error.message.includes('requeridos') || error.message.includes('disponibles')) {
        res.status(400).json({
          success: false,
          message: error.message
        });
        return;
      }

      if (error.message === 'Event not found') {
        res.status(404).json({
          success: false,
          message: error.message
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  }

  // Handler: Obtener no elegibles
  private async getNoElegibles(req: Request, res: Response): Promise<void> {
    try {
      const { evento_id } = req.params;

      const noElegibles = await this.getNoElegiblesUseCase.execute(Number(evento_id));

      res.status(200).json({
        success: true,
        noElegibles
      });
    } catch (error: any) {
      console.error("Error al obtener no elegibles:", error);
      res.status(500).json({
        success: false,
        message: "Error al obtener no elegibles"
      });
    }
  }

  // Handler: Contar invitaciones pendientes
  private async countInvitacionesPendientes(req: Request, res: Response): Promise<void> {
    try {
      const { evento_id } = req.params;
      console.log("📢 Evento actual:", evento_id);

      const result = await this.countInvitacionesPendientesUseCase.execute(Number(evento_id));

      res.status(200).json({
        success: true,
        ...result
      });
    } catch (error: any) {
      console.error("Error al obtener conteo de invitaciones:", error);
      res.status(500).json({
        success: false,
        message: "Error al obtener conteo de invitaciones"
      });
    }
  }

  // Método público para obtener el router configurado
  public getRouter(): Router {
    return this.router;
  }

  public getPath(): string {
    return this.path;
  }
}
