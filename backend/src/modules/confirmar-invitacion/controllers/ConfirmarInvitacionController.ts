import express, { Request, Response, Router } from "express";
import { DependencyContainer } from "../../../shared/utils/DependencyContainer";
import { authMiddleware } from "../../../shared/middlewares/authMiddleware";

export class ConfirmarInvitacionController {
  private router: Router;
  private path: string = "/api";

  // Use Cases (inyectados desde el contenedor)
  private respondInvitacionUseCase = DependencyContainer.getRespondInvitacionUseCase();

  constructor() {
    this.router = express.Router();
    this.router.use(authMiddleware);
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Endpoint para responder a una invitación (aceptar o rechazar)
    this.router.post("/invitaciones/respond", this.respondInvitacion.bind(this));
  }

  // Handler: Responder invitación
  private async respondInvitacion(req: Request, res: Response): Promise<void> {
    try {
      const { invitacion_usuario_id, accept } = req.body;

      const result = await this.respondInvitacionUseCase.execute({
        invitacion_usuario_id,
        accept
      });

      res.status(200).json(result);
    } catch (error: any) {
      console.error("Error responding invitation:", error);

      // Errores de validación
      if (
        error.message.includes('requeridos') ||
        error.message === 'Ya respondió esta invitación' ||
        error.message === 'Invitación expirada' ||
        error.message === 'El evento ya comenzó' ||
        error.message === 'El evento está lleno' ||
        error.message === 'Alcanzó el límite de eventos permitidos'
      ) {
        res.status(400).json({
          success: false,
          message: error.message
        });
        return;
      }

      // Error de no encontrado
      if (error.message === 'Invitación de usuario no encontrada') {
        res.status(404).json({
          success: false,
          message: error.message
        });
        return;
      }

      // Error interno
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
