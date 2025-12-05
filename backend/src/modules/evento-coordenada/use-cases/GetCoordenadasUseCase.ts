import { IUbicacionRepository } from "../../../domain/interfaces/IUbicacionRepository";

export class GetCoordenadasUseCase {
    constructor(
        private ubicacionRepository: IUbicacionRepository,
    ) { }

    async execute(eventoId: number): Promise<any> {
        if (!eventoId || Number.isNaN(eventoId)) {
            throw new Error('Invalid event id');
        }

        const ubicacion = await this.ubicacionRepository.findByEventoId(eventoId);
        return ubicacion;
    }
}