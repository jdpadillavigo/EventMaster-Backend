import express, { Request, Response, Router } from 'express'
import { DependencyContainer } from '../../../shared/utils/DependencyContainer'
import { authMiddleware } from '../../../shared/middlewares/authMiddleware'

export class VerInvitacionesPrivadasController {
  private router: Router
  private path: string = '/api'

  private getInvitacionesPrivadasUseCase = DependencyContainer.getGetInvitacionesPrivadasUseCase()

  constructor() {
    this.router = express.Router()

    // aplicar middleware a todas las rutas
    this.router.use(authMiddleware)

    this.initializeRoutes()
  }

  private initializeRoutes(): void {
    this.router.get('/private-invitations', this.getInvitaciones.bind(this))
  }

  private async getInvitaciones(req: Request, res: Response): Promise<void> {
    try {
      const usuarioId = Number(req.user?.id)
      if (!usuarioId || Number.isNaN(usuarioId)) {
        res.status(401).json({ success: false, message: 'No autenticado' })
        return
      }
      const result = await this.getInvitacionesPrivadasUseCase.execute({usuario_id: usuarioId})
      res.json(result)
    } catch (err: any) {
      console.error('[VerInvitacionesPrivadasController] Error listando invitaciones privadas:', err)
      res.status(500).json({ success: false, message: 'Error interno' })
    }
  }

  public getRouter(): Router {
    return this.router
  }

  public getPath(): string {
    return this.path
  }
}
