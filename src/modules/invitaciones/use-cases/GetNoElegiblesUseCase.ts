import { IInvitacionUsuarioRepository } from '../../../domain/interfaces/IInvitacionUsuarioRepository';
import { IEstadoInvitacionRepository } from '../../../domain/interfaces/IEstadoInvitacionRepository';
import { EstadoInvitacionEnum } from '../../../domain/value-objects/EstadoInvitacion';

export class GetNoElegiblesUseCase {
  constructor(
    private invitacionUsuarioRepository: IInvitacionUsuarioRepository,
    private estadoInvitacionRepository: IEstadoInvitacionRepository
  ) {}

  async execute(eventoId: number): Promise<any[]> {
    if (!eventoId) {
      throw new Error('evento_id es requerido');
    }

    // Obtener estado "Pendiente"
    const estadoPendiente = await this.estadoInvitacionRepository.findByNombre(EstadoInvitacionEnum.PENDIENTE);
    if (!estadoPendiente) {
      return []; // Si no existe el estado, retornar vacío
    }

    const noElegibles = await this.invitacionUsuarioRepository.findNoElegiblesByEvento(
      eventoId,
      estadoPendiente.estado_id
    );
    return noElegibles;
  }
}
