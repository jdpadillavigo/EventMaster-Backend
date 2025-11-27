import express, { Request, Response, Router } from 'express';
import { DependencyContainer } from '../../../shared/utils/DependencyContainer';
import jwt, { type SignOptions } from 'jsonwebtoken';

export class GoogleAuthController {
    private router: Router;
    private path: string = '/api/auth';

    private googleLoginUseCase = DependencyContainer.getGoogleLoginUseCase();

    constructor() {
        this.router = express.Router();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.post('/google', this.googleLogin.bind(this));
    }

    private async googleLogin(req: Request, res: Response): Promise<Response | void> {
        try {
            const { idToken } = req.body;

            if (!idToken) {
                return res.status(400).json({ success: false, message: 'idToken es requerido' });
            }

            const result = await this.googleLoginUseCase.execute(idToken);

            const secret = process.env.JWT_SECRET;
            if (!secret) {
                console.error('Error: JWT_SECRET no está definido en las variables de entorno');
                return res.status(500).json({
                    success: false,
                    message: 'Error de configuración del servidor. Contacte al administrador.',
                });
            }

            const expiresInEnv = process.env.JWT_EXPIRES_IN;
            const expiresIn: Exclude<SignOptions['expiresIn'], undefined> =
                (expiresInEnv ?? '7d') as Exclude<SignOptions['expiresIn'], undefined>;

            const token = jwt.sign(
                { sub: result.user.usuario_id },
                secret,
                { expiresIn }
            );

            return res.status(200).json({ ...result, token });

        } catch (error: any) {
            console.error('Error en Google Login Controller:', error);
            return res.status(401).json({ success: false, message: error.message || 'Error de autenticación con Google' });
        }
    }

    public getRouter(): Router {
        return this.router;
    }

    public getPath(): string {
        return this.path;
    }
}
