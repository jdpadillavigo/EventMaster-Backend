import express, { Request, Response, Router } from "express"
import { authMiddleware } from "shared/middlewares/authMiddleware"
import { DependencyContainer } from "shared/utils/DependencyContainer"
import { VerifyOrganizerInEvent } from "shared/middlewares/verifyOrganizerInEvent"

export class EliminarEventoController {
  private router: Router
  private path: string = "/api/eventos"

  constructor() {
    this.router = express.Router()
    this.initializeRoutes()
  }

  private initializeRoutes(): void {
    const verifyOrganizerInEvent = new VerifyOrganizerInEvent(
      DependencyContainer.getRolRepository(),
      DependencyContainer.getParticipanteRepository(),
      DependencyContainer.getEventoParticipanteRepository()
    ).verify.bind(
      new VerifyOrganizerInEvent(
        DependencyContainer.getRolRepository(),
        DependencyContainer.getParticipanteRepository(),
        DependencyContainer.getEventoParticipanteRepository()
      )
    )

    this.router.delete(
      "/:evento_id",
      authMiddleware,
      verifyOrganizerInEvent,
      this.delete.bind(this)
    )
  }

  private async delete(req: Request, res: Response): Promise<void> {
    const eventoId = Number(req.params.evento_id)
    if (!Number.isInteger(eventoId)) {
      res.status(400).json({ success: false, message: "Invalid event id" })
      return
    }

    const repo = DependencyContainer.getEventoRepository()
    const ok = await repo.delete(eventoId)
    if (!ok) {
      res.status(404).json({ success: false, message: "Event not found" })
      return
    }

    res.status(200).json({ success: true })
  }

  public getRouter(): Router { return this.router }
  public getPath(): string { return this.path }
}
