import express, { Request, Response, Router } from 'express'
import { DependencyContainer } from '../../../shared/utils/DependencyContainer'
import jwt, { type SignOptions } from 'jsonwebtoken'

export class AuthController {
  private router: Router
  private path: string = '/api/auth'

  private loginUseCase = DependencyContainer.getLoginUseCase()

  constructor() {
    this.router = express.Router()
    this.initializeRoutes()
  }

  private initializeRoutes(): void {
    this.router.post('/login', this.login.bind(this))
  }

  private async login(req: Request, res: Response): Promise<void> {
    try {
      const { correo, clave } = req.body
      const result = await this.loginUseCase.execute({ correo, clave })

      const secret = process.env.JWT_SECRET || 'dev-secret'
      const expiresInEnv = process.env.JWT_EXPIRES_IN
      const expiresIn: Exclude<SignOptions['expiresIn'], undefined> =
        (expiresInEnv ?? '7d') as Exclude<SignOptions['expiresIn'], undefined>
      const token = jwt.sign(
        {
          sub: result.user.usuario_id,
          email: result.user.correo,
        },
        secret,
        { expiresIn }
      )

      res.status(200).json({ ...result, token })
    } catch (error: any) {
      if (error?.message === 'correo y clave son requeridos') {
        res.status(400).json({ success: false, message: error.message })
        return
      }
      if (error?.message === 'Credenciales inválidas' || error?.message === 'Cuenta no activa') {
        res.status(401).json({ success: false, message: error.message })
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
