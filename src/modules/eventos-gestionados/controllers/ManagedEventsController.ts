// src/modules/eventos-gestionados/controllers/ManagedEventsController.ts
import express, { Request, Response, Router } from 'express'
import { authMiddleware } from 'shared/middlewares/authMiddleware'
import { DependencyContainer } from 'shared/utils/DependencyContainer'

export class ManagedEventsController {
  private router: Router
  private path: string = '/api/eventos'

  constructor() {
    this.router = express.Router()
    this.initializeRoutes()
  }

  private initializeRoutes(): void {
    // GET /api/eventos/gestionados  (usuario debe ser organizador de al menos 1 evento)
    this.router.get(
      '/gestionados',
      authMiddleware,
      DependencyContainer.getVerifyOrganizerGlobal(),
      this.listManaged.bind(this)
    )

    // DELETE /api/eventos/:evento_id  (usuario debe ser organizador de ese evento)
    // ❌ sin regex en la ruta; validamos el número dentro del handler
    this.router.delete(
  '/:evento_id',                    // <- antes: '/:evento_id(\\d+)'
  authMiddleware,
  DependencyContainer.getVerifyOrganizerInEvent(),
  this.delete.bind(this)
)
  }

  // GET /api/eventos/gestionados
  private async listManaged(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id
      if (!userId || !Number.isInteger(userId)) {
        res.status(401).json({ success: false, message: 'No autenticado' })
        return
      }

      const usecase = DependencyContainer.getListManagedEventsUseCase()
      const eventos = await usecase.execute(userId)

      res.status(200).json({ success: true, eventos })
    } catch {
      res.status(500).json({ success: false, message: 'Error interno' })
    }
  }

  // DELETE /api/eventos/:evento_id
  private async delete(req: Request, res: Response): Promise<void> {
    try {
      const eventoId = Number(req.params.evento_id)
      if (!Number.isInteger(eventoId)) {
        res.status(400).json({ success: false, message: 'Invalid event id' })
        return
      }

      const repo = DependencyContainer.getEventoRepository()
      const ok = await repo.delete(eventoId)
      if (!ok) {
        res.status(404).json({ success: false, message: 'Event not found' })
        return
      }

      res.status(200).json({ success: true })
    } catch {
      res.status(500).json({ success: false, message: 'Error interno' })
    }
  }

  public getRouter(): Router { return this.router }
  public getPath(): string { return this.path }
}
