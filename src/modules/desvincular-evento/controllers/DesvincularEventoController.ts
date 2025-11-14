import express, { Request, Response, Router } from "express";
import { DependencyContainer } from "../../../shared/utils/DependencyContainer";

// importacion de middlewares
import { authMiddleware } from "../../../shared/middlewares/authMiddleware";

export class DesvincularEventoController {
  private router: Router;
  private path: string = "/api/eventos";

  // Use Cases (inyectados desde el contenedor)
  private unjoinEventUseCase = DependencyContainer.getUnjoinEventUseCase();

  private verifyAttendeeInEvent = DependencyContainer.getVerifyAttendeeInEvent();
  
  constructor() {
    this.router = express.Router();
    
    // aplicar middleware a todas las rutas
    this.router.use(authMiddleware);

    // inicializar rutas
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Endpoint para desvincular usuario de evento
    this.router.delete("/:evento_id/desvincularme", this.verifyAttendeeInEvent, this.unjoin.bind(this));
  }

  // Handler: Desvincular usuario de evento
  private async unjoin(req: Request, res: Response): Promise<void> {
    try {
      const eventoId = Number(req.params.evento_id);
      const usuarioId = req.user?.id;

      if (!Number.isInteger(eventoId)) {
        res.status(400).json({ 
          success: false, 
          message: "Invalid event ID" 
        });
        return;
      }

      if (!usuarioId || !Number.isInteger(usuarioId)) {
        res.status(401).json({ 
          success: false, 
          message: "User not authenticated" 
        });
        return;
      }

      const result = await this.unjoinEventUseCase.execute({
        evento_id: eventoId,
        usuario_id: usuarioId
      });

      res.status(200).json(result);
    } catch (error: any) {
      console.error("Error leaving event:", error);

      if (error.message === 'Event ID and User ID are required') {
        res.status(400).json({
          success: false,
          message: error.message
        });
        return;
      }

      if (error.message === 'User is not participating in this event') {
        res.status(404).json({
          success: false,
          message: error.message
        });
        return;
      }

      if (error.message === 'Participant role not found' || 
          error.message === 'User is not a participant in any event') {
        res.status(400).json({
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

  // Método público para obtener el router configurado
  public getRouter(): Router {
    return this.router;
  }

  public getPath(): string {
    return this.path;
  }
}
