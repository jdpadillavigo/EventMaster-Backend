import express, { Request, Response, Router } from 'express';
import { DependencyContainer } from '../../../shared/utils/DependencyContainer';
import { authMiddleware } from '../../../shared/middlewares/authMiddleware';

export class EditarEventoController {
    private router: Router;
    private path: string = '/api/eventos/update';

    private verifyOrganizerInEvent = DependencyContainer.getVerifyOrganizerInEvent();
    private updateEventoUseCase = DependencyContainer.getEditarEventoUseCase()

    constructor() {
        this.router = express.Router();
        this.router.use(authMiddleware)
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.put('/:evento_id', this.verifyOrganizerInEvent, this.update.bind(this));
    }

    private async update(req: Request, res: Response): Promise<void> {
        try {
            const { evento_id } = req.params;
            const eventData = req.body;

            // Validar que el ID exista y sea un número
            if (!evento_id) {
                res.status(400).json({ success: false, message: 'ID de evento no proporcionado' });
                return;
            }

            const eventId = parseInt(evento_id, 10);
            if (isNaN(eventId)) {
                res.status(400).json({ success: false, message: 'ID de evento no válido' });
                return;
            }

            // Validar datos del evento
            if (!eventData || Object.keys(eventData).length === 0) {
                res.status(400).json({ success: false, message: 'Datos del evento no proporcionados' });
                return;
            }

            const userId = req.user?.id;

            if (!userId) {
                res.status(401).json({ success: false, message: 'Usuario no autenticado' });
                return;
            }

            // Llamar al caso de uso
            const result = await this.updateEventoUseCase.execute(eventId, eventData, userId);

            if (result.success) {
                res.status(200).json(result);
            } else {
                res.status(400).json(result);
            }
        } catch (err: any) {
            const msg = String(err?.message || 'Error interno')

            // === ERRORES CONTROLADOS DEL USE CASE ===
            if (
                msg === 'Evento no encontrado' ||
                msg === 'Event name must be unique' ||
                msg === 'Capacity must be between 1 and 100' ||
                msg === 'Invalid date' ||
                msg === 'Event date must be today or in the future' ||
                msg === 'Location must be within Lima' ||
                msg === 'Image cannot be empty'
            ) {
                res.status(400).json({ success: false, message: msg })
                return
            }

            console.error('[UpdateEventoController] Error actualizando evento:', err)
            res.status(500).json({ success: false, message: 'Error interno' })
        }
    }

    public getPath(): string {
        return this.path;
    }

    public getRouter(): Router {
        return this.router;
    }
}