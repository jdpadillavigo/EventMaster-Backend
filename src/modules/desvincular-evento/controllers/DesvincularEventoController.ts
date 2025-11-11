import express, { Request, Response, Router } from "express"
import { authMiddleware } from "shared/middlewares/authMiddleware"
import { DependencyContainer } from "shared/utils/DependencyContainer"
import { VerifyAttendeeInEvent } from "shared/middlewares/verifyAttendeeInEvent"

export class DesvincularEventoController {
  private router: Router
  private path: string = "/api/eventos"
  private unjoinEventUseCase = DependencyContainer.getUnjoinEventUseCase()

  constructor() {
    this.router = express.Router()
    this.initializeRoutes()
  }

  private initializeRoutes(): void {
    const verifyAttendeeInEvent = new VerifyAttendeeInEvent(
      DependencyContainer.getRolRepository(),
      DependencyContainer.getParticipanteRepository(),
      DependencyContainer.getEventoParticipanteRepository()
    ).verify.bind(
      new VerifyAttendeeInEvent(
        DependencyContainer.getRolRepository(),
        DependencyContainer.getParticipanteRepository(),
        DependencyContainer.getEventoParticipanteRepository()
      )
    )

    this.router.delete(
      "/:evento_id/desvincularme",
      authMiddleware,
      verifyAttendeeInEvent,
      this.unjoin.bind(this)
    )
  }

  private async unjoin(req: Request, res: Response): Promise<void> {
    const eventoId = Number(req.params.evento_id)
    const usuarioId = req.user?.id

    if (!Number.isInteger(eventoId)) {
      res.status(400).json({ success: false, message: "Invalid event id" })
      return
    }
    if (!usuarioId || !Number.isInteger(usuarioId)) {
      res.status(401).json({ success: false, message: "No autenticado" })
      return
    }

    // si tu use case recibe objeto, usa: await this.unjoinEventUseCase.execute({ evento_id: eventoId, usuario_id: usuarioId })
    await this.unjoinEventUseCase.execute(eventoId, usuarioId)
    res.status(200).json({ success: true })
  }

  public getRouter(): Router { return this.router }
  public getPath(): string { return this.path }
}
