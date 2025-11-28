import express, { Request, Response, Router } from 'express'
import { DependencyContainer } from '../../../shared/utils/DependencyContainer'

export class PublicEventsController {
  private router: Router
  private path: string = '/api'

  private listPublicEventsUseCase = DependencyContainer.getListPublicEventsUseCase()

  constructor() {
    this.router = express.Router()
    this.initializeRoutes()
  }

  private initializeRoutes(): void {
    this.router.get('/events/public', this.list.bind(this))
  }

  private async list(req: Request, res: Response): Promise<void> {
    try {
      const usuarioId = req.query.usuarioId ? Number(req.query.usuarioId) : undefined
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
