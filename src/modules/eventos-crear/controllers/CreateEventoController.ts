import express, { Request, Response, Router } from 'express'
import { DependencyContainer } from '../../../shared/utils/DependencyContainer'
import { CrearEventoDto } from '../dtos/CrearEventoDto'
import { authMiddleware } from '../../../shared/middlewares/authMiddleware'

export class CreateEventoController {
  private router: Router
  private path: string = '/api'

  private createEventoUseCase = DependencyContainer.getCreateEventoUseCase()

  constructor() {
    this.router = express.Router()
    this.router.use(authMiddleware)
    this.initializeRoutes()
  }

  private initializeRoutes(): void {
    this.router.post('/eventos', this.create.bind(this))
  }

  private async create(req: Request, res: Response): Promise<void> {
    try {
      const dto = req.body as CrearEventoDto
      const userId = req.user?.id

      if (!userId) {
        res.status(401).json({ success: false, message: 'User not authenticated' })
        return
      }

      const result = await this.createEventoUseCase.execute({
        ...dto,
        ownerId: userId,
      })
      res.status(201).json(result)
    } catch (err: any) {
      const msg = String(err?.message || 'Error interno')
      if (
        msg === 'Missing required fields' ||
        msg === 'Invalid date' ||
        msg === 'Capacity must be between 1 and 100' ||
        msg === 'Image is required' ||
        msg === 'Location must be within Lima' ||
        msg === 'You reached your event limit' ||
        msg === 'Event name must be unique'
      ) {
        res.status(400).json({ success: false, message: msg })
        return
      }
      console.error('[CreateEventoController] Error creando evento:', err)
      res.status(500).json({ success: false, message: 'Error interno' })
    }
  }

  public getRouter(): Router { return this.router }
  public getPath(): string { return this.path }
}
