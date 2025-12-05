import express, { Request, Response, Router } from "express";
import { DependencyContainer } from "../../../shared/utils/DependencyContainer";
import { authMiddleware } from "../../../shared/middlewares/authMiddleware";

export class VerCoordenadasController {
    private router: Router;
    private path: string = "/api/event/coordinates";

    // Use Cases (inyectados desde el contenedor)   
    private getCoordenadasUseCase = DependencyContainer.getGetCoordenadasUseCase();

    constructor() {
        this.router = express.Router();
        this.router.use(authMiddleware)
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        // Endpoint para obtener coordenadas de un evento
        this.router.get("/:evento_id", this.getCoordenadas.bind(this));
    }

    private async getCoordenadas(req: Request, res: Response): Promise<void> {
        try {
            const { evento_id } = req.params;
            const id = Number(evento_id);

            const coordenadas = await this.getCoordenadasUseCase.execute(id);

            res.status(200).json({
                success: true,
                coordenadas
            });
        } catch (error: any) {
            console.error("Error al obtener coordenadas:", error);
            res.status(500).json({
                success: false,
                message: "Error al obtener coordenadas"
            });
        }
    }

    // Método público para obtener el router configurado
    public getRouter(): Router {
        return this.router;
    }

    public getPath(): string {
        return this.path;
    }
}