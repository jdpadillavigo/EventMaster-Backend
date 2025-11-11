// src/modules/eventos-publicos/controllers/PublicEventsController.ts
import express, { Request, Response, Router } from 'express'
import { DependencyContainer } from '../../../shared/utils/DependencyContainer'

export class PublicEventsController {
  private router: Router
  private path: string = '/api/eventos' // prefijo consistente con el resto

  private listPublicEventsUseCase = DependencyContainer.getListPublicEventsUseCase()

  constructor() {
    this.router = express.Router()
    this.initializeRoutes()
  }

  private initializeRoutes(): void {
    // GET /api/eventos/publicos
    this.router.get('/publicos', this.list.bind(this))
  }

  private async list(req: Request, res: Response): Promise<void> {
    try {
      const usuarioId = req.query.usuarioId ? Number(req.query.usuarioId) : undefined
      const result = await this.listPublicEventsUseCase.execute(usuarioId)
      res.status(200).json(result)
    } catch (err) {
      console.error('[PublicEventsController] Error listando públicos:', err)
      res.status(500).json({ success: false, message: 'Error interno' })
    }
  }

  public getRouter(): Router { return this.router }
  public getPath(): string { return this.path }
}
