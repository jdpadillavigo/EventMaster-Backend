import express, { Request, Response, Router } from 'express';
import { DependencyContainer } from '../../../shared/utils/DependencyContainer';
import { authMiddleware } from '../../../shared/middlewares/authMiddleware';

export class EliminarAsistenteController {
  private router: Router;
  private path: string = '/api';

  private eliminarAsistenteUseCase = DependencyContainer.getEliminarAsistenteUseCase();

  constructor() {
    this.router = express.Router();
    // Proteger rutas
    this.router.use(authMiddleware);
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Eliminar un invitado (organizador/coorganizador)
    // Ruta: POST /api/eventos/:evento_id/participantes/:usuario_id/eliminar
    this.router.post('/eventos/:evento_id/participantes/:usuario_id/eliminar', this.eliminarInvitado.bind(this));
  }

  private async eliminarInvitado(req: Request, res: Response): Promise<void> {
    try {
      const { evento_id, usuario_id } = req.params;
      const emisorId = req.user?.id;

      if (!emisorId) {
        res.status(401).json({ success: false, message: 'Usuario no autenticado' });
        return;
      }

      const result = await this.eliminarAsistenteUseCase.execute({
        evento_id: Number(evento_id),
        usuario_id: Number(usuario_id),
        emisor_id: Number(emisorId)
      });

      if (!result.success) {
        res.status(400).json(result);
        return;
      }

      res.status(200).json(result);
    } catch (error: any) {
      console.error('Error en EliminarInvitadoController:', error);
      res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  }

  public getRouter(): Router {
    return this.router;
  }

  public getPath(): string {
    return this.path;
  }
}