import express, { Request, Response, Router } from "express";
import { DependencyContainer } from "../../../shared/utils/DependencyContainer";

// importacion de middlewares
import { authMiddleware } from "../../../shared/middlewares/authMiddleware";

export class VisualizarRecursoController {
  private router: Router;
  private path: string = "/api/visualizar-recursos";

  // Use Cases (inyectados desde el contenedor)
  private getRecursosByEventoUseCase = DependencyContainer.getGetRecursosByEventoUseCase();

  // Middleware
  private verifyOrganizerOrAttendeeInEvent = DependencyContainer.getVerifyOrganizerOrAttendeeInEvent();

  constructor() {
    this.router = express.Router();
    
    // aplicar middleware a todas las rutas
    this.router.use(authMiddleware);

    // inicializar rutas
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // 1. Endpoint para obtener recursos de un evento
    this.router.get("/evento/:evento_id", this.verifyOrganizerOrAttendeeInEvent, this.getRecursosByEvento.bind(this));
  }

  // Handler: Obtener recursos por evento
  private async getRecursosByEvento(req: Request, res: Response): Promise<void> {
    try {
      const { evento_id } = req.params;
      const { tipo_recurso } = req.query;

      const dto: any = {
        evento_id: Number(evento_id)
      };

      if (tipo_recurso) {
        dto.tipo_recurso = Number(tipo_recurso);
      }

      const result = await this.getRecursosByEventoUseCase.execute(dto);

      res.status(200).json(result);
    } catch (error: any) {
      console.error("Error obteniendo recursos del evento:", error);

      if (error.message === 'evento_id es requerido') {
        res.status(400).json({
          success: false,
          message: error.message
        });
        return;
      }

      if (error.message === 'Evento no encontrado') {
        res.status(404).json({
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

  // Método público para obtener el router configurado
  public getRouter(): Router {
    return this.router;
  }

  public getPath(): string {
    return this.path;
  }
}
