import express, { Request, Response, Router } from 'express'
import { authMiddleware } from '../../../shared/middlewares/authMiddleware'
import { DependencyContainer } from '../../../shared/utils/DependencyContainer'

export class ProfileController {
  private router: Router
  private path: string = '/api/profile'

  private getProfileUseCase = DependencyContainer.getGetProfileUseCase()
  private updateProfileUseCase = DependencyContainer.getUpdateProfileUseCase()

  constructor() {
    this.router = express.Router()
    this.router.use(authMiddleware)
    this.initializeRoutes()
  }

  private initializeRoutes(): void {
    this.router.get('/', this.getProfile.bind(this))
    this.router.put('/', this.updateProfile.bind(this))
  }

  private async getProfile(req: Request, res: Response): Promise<Response | void> {
    try {
      const usuarioId = req.user?.id
      if (!usuarioId) {
        return res.status(401).json({ success: false, message: 'No autenticado' })
      }

      const result = await this.getProfileUseCase.execute(usuarioId)
      return res.status(200).json(result)
    } catch (error) {
      console.error('Error en getProfile:', error)
      return res.status(500).json({ success: false, message: 'Error interno del servidor' })
    }
  }

  private async updateProfile(req: Request, res: Response): Promise<Response | void> {
    try {
      const usuarioId = req.user?.id
      if (!usuarioId) {
        return res.status(401).json({ success: false, message: 'No autenticado' })
      }

      const { nombre, apellido, correo, foto_perfil } = req.body ?? {}
      const result = await this.updateProfileUseCase.execute({
        usuarioId,
        nombre,
        apellido,
        correo,
        foto_perfil,
      })
      return res.status(200).json(result)
    } catch (error: any) {
      console.error('Error en updateProfile:', error)
      const code = error?.code as string | undefined
      if (code === 'EMAIL_TAKEN') {
        return res.status(409).json({ success: false, message: 'El correo ya está registrado por otro usuario' })
      }
      if (code === 'INVALID_IMAGE_FORMAT' || code === 'INVALID_IMAGE_MIME' || code === 'INVALID_IMAGE_URL') {
        return res.status(400).json({ success: false, message: error.message || 'Formato de imagen inválido' })
      }
      if (code === 'IMAGE_TOO_LARGE') {
        return res.status(413).json({ success: false, message: 'La imagen excede el tamaño máximo de 2MB' })
      }
      return res.status(500).json({ success: false, message: 'Error interno del servidor' })
    }
  }

  public getRouter(): Router {
    return this.router
  }

  public getPath(): string {
    return this.path
  }
}