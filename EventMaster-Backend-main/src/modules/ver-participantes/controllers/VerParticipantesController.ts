import express, { Request, Response, Router } from "express";
import { DependencyContainer } from "../../../shared/utils/DependencyContainer";

export class VerParticipantesController {
  private router: Router;
  private path: string = "/api";

  // Use Cases (inyectados desde el contenedor)
  private getParticipantesByEventoUseCase = DependencyContainer.getGetParticipantesByEventoUseCase();

  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Endpoint para obtener participantes confirmados de un evento
    this.router.get("/eventos/:evento_id/participantes", this.getParticipantes.bind(this));
  }

  // Handler: Obtener participantes
  private async getParticipantes(req: Request, res: Response): Promise<void> {
    try {
      const { evento_id } = req.params;

      const participantes = await this.getParticipantesByEventoUseCase.execute(Number(evento_id));

      res.status(200).json({
        success: true,
        participantes
      });
    } catch (error: any) {
      console.error("Error fetching participants by event:", error);

      if (error.message === 'evento_id es requerido') {
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
