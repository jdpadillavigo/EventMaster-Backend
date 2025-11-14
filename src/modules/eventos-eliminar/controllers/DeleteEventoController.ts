import express, { Request, Response, Router } from "express";
import { DependencyContainer } from "../../../shared/utils/DependencyContainer";

// importacion de middlewares
import { authMiddleware } from "../../../shared/middlewares/authMiddleware";

export class DeleteEventoController {
  private router: Router;
  private path: string = "/api/events/delete";

  // Use Case (inyectado desde el contenedor)
  private deleteEventoUseCase = DependencyContainer.getDeleteEventoUseCase();
  
  // Middleware
  private verifyOrganizerInEvent = DependencyContainer.getVerifyOrganizerInEvent();

  constructor() {
    this.router = express.Router();
    this.router.use(authMiddleware);
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Endpoint para eliminar evento
    this.router.delete("/:evento_id", this.verifyOrganizerInEvent, this.deleteEvento.bind(this));
  }

  // Handler: Eliminar evento
  private async deleteEvento(req: Request, res: Response): Promise<void> {
    try {
      const { evento_id } = req.params;
      const usuario_id = Number(req.user?.id)

      // Validar parámetros
      if (!evento_id || isNaN(Number(evento_id))) {
        res.status(400).json({
          success: false,
          message: "ID de evento inválido"
        });
        return;
      }

      const result = await this.deleteEventoUseCase.execute({evento_id: Number(evento_id), usuario_id});
      res.status(200).json(result);

    } catch (error: any) {
      console.error("Error deleting event:", error);

      if (error.message.includes('no encontrado')) {
        res.status(404).json({
          success: false,
          message: error.message
        });
        return;
      }

      if (error.message.includes('no es organizador') || 
          error.message.includes('Solo el organizador')) {
        res.status(403).json({
          success: false,
          message: error.message
        });
        return;
      }

      if (error.message.includes('ya ha comenzado')) {
        res.status(400).json({
          success: false,
          message: error.message
        });
        return;
      }
      
      res.status(500).json({
        success: false,
        message: "Error interno del servidor"
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