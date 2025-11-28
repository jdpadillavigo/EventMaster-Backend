import express, { Request, Response, Router } from 'express';
import { DependencyContainer } from '../../../shared/utils/DependencyContainer';

export class VerDetalleController {
  private router: Router;
  private path: string = '/api';

  private getEventoDetalleUseCase = DependencyContainer.getGetEventoDetalleUseCase();

  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/eventos/:evento_id', this.getDetalle.bind(this));
  }

  private async getDetalle(req: Request, res: Response): Promise<void> {
    try {
      const { evento_id } = req.params;
      const id = Number(evento_id);

      const evento = await this.getEventoDetalleUseCase.execute(id);

      res.status(200).json({ success: true, evento });
    } catch (error: any) {
      if (error.message === 'Invalid event id') {
        res.status(400).json({ success: false, message: error.message });
        return;
      }
      if (error.message === 'Event not found') {
        res.status(404).json({ success: false, message: error.message });
        return;
      }
      console.error('Error al obtener detalle de evento:', error);
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

