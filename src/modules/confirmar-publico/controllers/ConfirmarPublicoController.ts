import express, { Request, Response, Router } from 'express'
import { DependencyContainer } from '../../../shared/utils/DependencyContainer'
import { authMiddleware } from 'shared/middlewares/authMiddleware'

export class ConfirmarPublicoController {
  private router: Router
  private path: string = '/api/eventos'

  private confirmPublicAttendanceUseCase = DependencyContainer.getConfirmPublicAttendanceUseCase()

  constructor() {
    this.router = express.Router()
    this.initializeRoutes()
  }

  private initializeRoutes(): void {
    // POST /api/eventos/:evento_id/asistir
    this.router.post(
  '/:evento_id/asistir',            // <- antes: '/:evento_id(\\d+)/asistir'
  authMiddleware,
  this.confirmPublicAttendance.bind(this)
)
  }

  private async confirmPublicAttendance(req: Request, res: Response): Promise<void> {
    try {
      const eventoId = Number(req.params.evento_id)
      if (!Number.isInteger(eventoId)) {
        res.status(400).json({ success: false, message: 'Invalid event id' })
        return
      }

      const userId = req.user?.id
      if (!userId || !Number.isInteger(userId)) {
        res.status(401).json({ success: false, message: 'No autenticado' })
        return
      }

      const result = await this.confirmPublicAttendanceUseCase.execute({
        evento_id: eventoId,
        usuario_id: userId
      })

      res.status(200).json(result)
    } catch (error: any) {
      const msg = String(error?.message || 'Internal error')

      if (msg === 'Invalid input') {
        res.status(400).json({ success: false, message: msg }); return
      }
      if (msg === 'Event not found') {
        res.status(404).json({ success: false, message: msg }); return
      }
      if (msg === 'Event already started') {
        res.status(400).json({ success: false, message: msg }); return
      }
      if (msg === 'Already confirmed' || msg === 'Event is full') {
        res.status(409).json({ success: false, message: msg }); return
      }

      console.error('Error al confirmar asistencia pública:', error)
      res.status(500).json({ success: false, message: 'Internal server error' })
    }
  }

  public getRouter(): Router {
    return this.router
  }

  public getPath(): string {
    return this.path
  }
}
