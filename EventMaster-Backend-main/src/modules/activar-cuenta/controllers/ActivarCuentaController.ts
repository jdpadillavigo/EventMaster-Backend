import express, { Request, Response, Router } from "express";
import { DependencyContainer } from "../../../shared/utils/DependencyContainer";

export class ActivarCuentaController {
  private router: Router;
  private path: string = "/api/auth";

  private activarCuentaUseCase = DependencyContainer.getActivarCuentaUseCase();

  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post("/activate", this.activarCuenta.bind(this));
  }

  private async activarCuenta(req: Request, res: Response): Promise<void> {
    try {
      const { token } = req.body;

      const result = await this.activarCuentaUseCase.execute({ token });

      if (result.success) {
        res.status(200).json(result);
        return;
      }

      if (result.expired) {
        res.status(400).json(result);
        return;
      }

      if (result.message.includes('inválido')) {
        res.status(404).json(result);
        return;
      }

      res.status(400).json(result);
    } catch (error: any) {
      console.error("Error al activar cuenta:", error);

      if (error.message.includes('requerido')) {
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

  public getRouter(): Router {
    return this.router;
  }

  public getPath(): string {
    return this.path;
  }
}
