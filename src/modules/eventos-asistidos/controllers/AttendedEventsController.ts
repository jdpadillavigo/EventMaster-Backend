import express, { Request, Response, Router } from 'express'
import { DependencyContainer } from '../../../shared/utils/DependencyContainer'

export class AttendedEventsController {
  private router: Router
  private path: string = '/api'

  private listAttendedEventsUseCase = DependencyContainer.getListAttendedEventsUseCase()

  constructor() {
    this.router = express.Router()
    this.initializeRoutes()
  }

  private initializeRoutes(): void {
    this.router.get('/events/attended/:usuario_id', this.list.bind(this))
  }

  private async list(req: Request, res: Response): Promise<void> {
    try {
      const usuarioId = Number(req.params.usuario_id)
      if (!usuarioId || Number.isNaN(usuarioId)) {
        res.status(400).json({ success: false, message: 'Invalid user id' })
        return
      }
      const result = await this.listAttendedEventsUseCase.execute(usuarioId)
      res.json(result)
    } catch (err) {
      console.error('[AttendedEventsController] Error listando asistidos:', err)
      res.status(500).json({ success: false, message: 'Error interno' })
    }
  }

  public getRouter(): Router { return this.router }
  public getPath(): string { return this.path }
}