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

  private async login(req: Request, res: Response): Promise<Response |void> {
    try {
      const { correo, clave } = req.body

      const result = await this.loginUseCase.execute({ correo, clave })

      const secret = process.env.JWT_SECRET;
      if (!secret) {
        console.error('Error: JWT_SECRET no está definido en las variables de entorno');
        return res.status(500).json({
          success: false,
          message: 'Error de configuración del servidor. Contacte al administrador.',
        });
      }

      const expiresInEnv = process.env.JWT_EXPIRES_IN
      const expiresIn: Exclude<SignOptions['expiresIn'], undefined> =
        (expiresInEnv ?? '7d') as Exclude<SignOptions['expiresIn'], undefined>

      const token = jwt.sign(
        { sub: result.user.usuario_id },
        secret,
        { expiresIn }
      )

      return res.status(200).json({ ...result, token })

    } catch (error: any) {
      if (error?.message === 'correo y clave son requeridos') {
        return res.status(400).json({ success: false, message: error.message })
      }
      if (error?.message === 'Credenciales inválidas' || error?.message === 'Cuenta no activa') {
        return res.status(401).json({ success: false, message: error.message })
      }

      console.error('Error en login:', error);
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
