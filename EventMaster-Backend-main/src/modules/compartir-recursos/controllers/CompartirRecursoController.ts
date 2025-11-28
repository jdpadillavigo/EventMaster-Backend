import express, { Request, Response, Router } from "express";
import { DependencyContainer } from "../../../shared/utils/DependencyContainer";

// importacion de middlewares
import { authMiddleware } from "../../../shared/middlewares/authMiddleware";

export class CompartirRecursoController {
  private router: Router;
  private path: string = "/api/compartir-recursos";

  // Use Cases (inyectados desde el contenedor)
  private compartirRecursoUseCase = DependencyContainer.getCompartirRecursoUseCase();

  // Middleware
  private verifyOrganizerInEvent = DependencyContainer.getVerifyOrganizerInEvent();

  constructor() {
    this.router = express.Router();
    
    // aplicar middleware a todas las rutas
    this.router.use(authMiddleware);

    // inicializar rutas
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Endpoint para compartir recurso en evento
    this.router.post("/", this.verifyOrganizerInEvent, this.compartirRecurso.bind(this));
  }

  // Handler: Compartir recurso
  private async compartirRecurso(req: Request, res: Response): Promise<void> {
    try {
      const { evento_id, nombre, url, tipo_recurso } = req.body;
      
      const usuarioId = (req as any).user?.id;

      if (!usuarioId) {
        res.status(401).json({
          success: false,
          message: "Usuario no autenticado"
        });
        return;
      }

      const result = await this.compartirRecursoUseCase.execute({
        evento_id,
        nombre,
        url,
        tipo_recurso
      }, usuarioId);

      if (result.success) {
        res.status(201).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error: any) {
      console.error("Error compartiendo recurso:", error);

      if (error.message.includes('requerido')) {
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
