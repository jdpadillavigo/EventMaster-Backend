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
    this.router.get("/activate/:token", this.activarCuentaPage.bind(this));
  }

  private async activarCuentaPage(req: Request, res: Response): Promise<void> {
    const token = req.params.token as string;

    try {
      const result = await this.activarCuentaUseCase.execute({ token });

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Activación de Cuenta</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
                body { font-family: 'Segoe UI', sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background-color: #f0f2f5; }
                .card { background: white; padding: 40px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); text-align: center; max-width: 400px; width: 90%; }
                h1 { color: ${result.success ? '#28a745' : '#dc3545'}; margin-bottom: 20px; }
                p { color: #666; line-height: 1.6; margin-bottom: 30px; }
                .btn { display: inline-block; padding: 12px 24px; background: #007bff; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; }
            </style>
        </head>
        <body>
            <div class="card">
                <h1>${result.success ? '¡Cuenta Activada!' : 'Error de Activación'}</h1>
                <p>${result.message || ''}</p>
                ${result.success ? '<p>Ya puedes cerrar esta ventana e iniciar sesión en la aplicación.</p>' : '<p>Por favor, solicita un nuevo enlace si este ha expirado.</p>'}
            </div>
        </body>
        </html>
      `;

      res.send(htmlContent);
    } catch (error) {
      res.status(500).send('<h1>Error interno del servidor</h1>');
    }
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
