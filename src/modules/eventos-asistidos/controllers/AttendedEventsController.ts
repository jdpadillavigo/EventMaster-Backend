// src/modules/eventos-asistidos/controllers/AttendedEventsController.ts
import express, { Request, Response, Router } from 'express'
import { authMiddleware } from 'shared/middlewares/authMiddleware'
import { DependencyContainer } from 'shared/utils/DependencyContainer'

export class AttendedEventsController {
  private router: Router
  private path: string = '/api/eventos'

  private listAttendedEventsUseCase = DependencyContainer.getListAttendedEventsUseCase()
  private unjoinEventUseCase = DependencyContainer.getUnjoinEventUseCase()

  constructor() {
    this.router = express.Router()
    this.initializeRoutes()
  }

  private initializeRoutes(): void {
    // GET /api/eventos/asistidos
    this.router.get('/asistidos', authMiddleware, this.list.bind(this))

    // DELETE /api/eventos/:evento_id/desvincularme
    // (sin regex en la ruta; validamos el número en el handler)
    this.router.delete(
      '/:evento_id/desvincularme',
      authMiddleware,
      this.unjoin.bind(this)
    )
  }

  // GET /api/eventos/asistidos
  private async list(req: Request, res: Response): Promise<void> {
    try {
      const usuarioId = req.user?.id
      if (!usuarioId || !Number.isInteger(usuarioId)) {
        res.status(401).json({ success: false, message: 'No autenticado' })
        return
      }

      const data = await this.listAttendedEventsUseCase.execute(usuarioId)
      res.status(200).json({ success: true, data })
    } catch {
      res.status(500).json({ success: false, message: 'Error interno' })
    }
  }

  // DELETE /api/eventos/:evento_id/desvincularme
  private async unjoin(req: Request, res: Response): Promise<void> {
  try {
    const usuarioId = req.user?.id;
    const eventoId = Number(req.params.evento_id);

    if (!usuarioId) {
      res.status(401).json({ success: false, message: 'No autenticado' });
      return;
    }
    if (!Number.isInteger(eventoId)) {
      res.status(400).json({ success: false, message: 'Invalid event id' });
      return;
    }

    // según tu caso de uso actual
    await this.unjoinEventUseCase.execute(eventoId, usuarioId);

    res.status(200).json({ success: true });
  } catch (e: any) {
    const msg = String(e?.message || '');
    console.error('[unjoin] error =>', msg, e);

    if (msg === 'Invalid input') {
      res.status(400).json({ success: false, message: msg }); return;
    }
    if (msg === 'Event not found') {
      res.status(404).json({ success: false, message: msg }); return;
    }
    if (msg === 'Event already started') {
      res.status(400).json({ success: false, message: msg }); return;
    }
    if (msg === 'Participante not found' || msg === 'Not attendee' || msg === 'NotJoined') {
      // cuando el usuario no está inscrito en ese evento
      res.status(409).json({ success: false, message: msg }); return;
    }

    res.status(500).json({ success: false, message: 'Error interno' });
  }
}

  public getRouter(): Router {
    return this.router
  }
  public getPath(): string {
    return this.path
  }
}
