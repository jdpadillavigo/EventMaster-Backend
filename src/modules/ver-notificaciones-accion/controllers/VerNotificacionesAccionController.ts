import express, { Request, Response, Router } from 'express'
import { DependencyContainer } from '../../../shared/utils/DependencyContainer'
import { authMiddleware } from "../../../shared/middlewares/authMiddleware";

export class VerNotificacionesAccionController {
  private router: Router
  private path: string = '/api'

  // Use Cases (inyectados desde el contenedor)
  private getNotificacionesAccionUseCase = DependencyContainer.getGetNotificacionesAccionUseCase()

  constructor() {
    this.router = express.Router()

    // aplicar middleware a todas las rutas
    this.router.use(authMiddleware)

    this.initializeRoutes()
  }

  private initializeRoutes(): void {
    this.router.get('/notifications-action', this.getNotificaciones.bind(this))
  }

  private async getNotificaciones(req: Request, res: Response): Promise<void> {
    try {
      const usuarioId = Number(req.user?.id)
      if (!usuarioId || Number.isNaN(usuarioId)) {
        res.status(401).json({ success: false, message: 'No autenticado' })
        return
      }
      const result = await this.getNotificacionesAccionUseCase.execute({usuario_id: usuarioId})
      res.json(result)
    } catch (err: any) {
      console.error('[VerNotificacionesAccionController] Error listando notificaciones:', err)
      res.status(500).json({ success: false, message: 'Error interno del servidor' })
    }
  }

  public getRouter(): Router {
    return this.router
  }

  public getPath(): string {
    return this.path
  }
}
