import express, { Request, Response, Router } from 'express'
import { DependencyContainer } from '../../../shared/utils/DependencyContainer'

export class VerInvitacionesPrivadasController {
  private router: Router
  private path: string = '/api'

  private getInvitacionesPrivadasUseCase = DependencyContainer.getGetInvitacionesPrivadasUseCase()

  constructor() {
    this.router = express.Router()
    this.initializeRoutes()
  }

  private initializeRoutes(): void {
    this.router.get('/usuarios/:usuario_id/invitaciones-privadas', this.getInvitaciones.bind(this))
  }

  private async getInvitaciones(req: Request, res: Response): Promise<void> {
    try {
      const { usuario_id } = req.params
      const result = await this.getInvitacionesPrivadasUseCase.execute({ usuario_id: Number(usuario_id) })
      res.status(200).json(result)
    } catch (error: any) {
      if (error?.message === 'usuario_id es requerido') {
        res.status(400).json({ success: false, message: error.message })
        return
      }
      res.status(500).json({ success: false, message: 'Error interno del servidor' })
    }
  }

  public getRouter(): Router {
    return this.router
  }

  public getPath(): string {
    return this.path
  }
}
