import express, { Request, Response, Router } from 'express'
import { DependencyContainer } from '../../../shared/utils/DependencyContainer'

export class ManagedEventsController {
  private router: Router
  private path: string = '/api'

  private listManagedEventsUseCase = DependencyContainer.getListManagedEventsUseCase()

  constructor() {
    this.router = express.Router()
    this.initializeRoutes()
  }

  private initializeRoutes(): void {
    this.router.get('/events/managed/:usuario_id', this.list.bind(this))
  }

  private async list(req: Request, res: Response): Promise<void> {
    try {
      const usuarioId = Number(req.params.usuario_id)
      if (!usuarioId || Number.isNaN(usuarioId)) {
        res.status(400).json({ success: false, message: 'Invalid user id' })
        return
      }
      const result = await this.listManagedEventsUseCase.execute(usuarioId)
      res.json(result)
    } catch (err) {
      console.error('[ManagedEventsController] Error listando managed:', err)
      res.status(500).json({ success: false, message: 'Error interno' })
    }
  }

  public getRouter(): Router { return this.router }
  public getPath(): string { return this.path }
}
