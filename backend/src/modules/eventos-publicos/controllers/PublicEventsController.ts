import express, { Request, Response, Router } from 'express'
import { DependencyContainer } from '../../../shared/utils/DependencyContainer'
import { authMiddleware } from '../../../shared/middlewares/authMiddleware'

export class PublicEventsController {
  private router: Router
  private path: string = '/api'

  private listPublicEventsUseCase = DependencyContainer.getListPublicEventsUseCase()

  constructor() {
    this.router = express.Router()
    // Aplicar middleware de autenticación
    this.router.use(authMiddleware)
    this.initializeRoutes()
  }

  private initializeRoutes(): void {
    this.router.get('/events/public', this.list.bind(this))
  }

  private async list(req: Request, res: Response): Promise<void> {
    try {
      // Obtener el ID del usuario autenticado desde el token JWT
      const usuarioId = req.user?.id
      const result = await this.listPublicEventsUseCase.execute(usuarioId)
      res.json(result)
    } catch (err) {
      console.error('[PublicEventsController] Error listando públicos:', err)
      res.status(500).json({ success: false, message: 'Error interno' })
    }
  }

  public getRouter(): Router { return this.router }
  public getPath(): string { return this.path }
}
