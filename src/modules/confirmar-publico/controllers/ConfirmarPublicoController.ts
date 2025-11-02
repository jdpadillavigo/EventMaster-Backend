import express, { Request, Response, Router } from 'express';
import { DependencyContainer } from '../../../shared/utils/DependencyContainer';

export class ConfirmarPublicoController {
  private router: Router;
  private path: string = '/api';

  private confirmPublicAttendanceUseCase = DependencyContainer.getConfirmPublicAttendanceUseCase();

  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Mantener la misma ruta para compatibilidad del frontend
    this.router.post('/eventos/:evento_id/attendance/public', this.confirmPublicAttendance.bind(this));
  }

  private async confirmPublicAttendance(req: Request, res: Response): Promise<void> {
    try {
      const { evento_id } = req.params;
      const { usuario_id } = req.body as { usuario_id?: number };

      const result = await this.confirmPublicAttendanceUseCase.execute({
        evento_id: Number(evento_id),
        usuario_id: Number(usuario_id),
      });

      res.status(200).json(result);
    } catch (error: any) {
      const msg = String(error?.message || 'Internal error');
      if (msg === 'Invalid input') {
        res.status(400).json({ success: false, message: msg });
        return;
      }
      if (msg === 'Event not found') {
        res.status(404).json({ success: false, message: msg });
        return;
      }
      if (msg === 'Event already started') {
        res.status(400).json({ success: false, message: msg });
        return;
      }
      if (msg === 'Already confirmed' || msg === 'Event is full') {
        res.status(409).json({ success: false, message: msg });
        return;
      }
      if (msg === 'Participante not found for user') {
        res.status(404).json({ success: false, message: msg });
        return;
      }
      console.error('Error al confirmar asistencia pública:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  public getRouter(): Router {
    return this.router;
  }

  public getPath(): string {
    return this.path;
  }
}
