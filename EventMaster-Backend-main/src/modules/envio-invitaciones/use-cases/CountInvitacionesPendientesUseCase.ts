import { IInvitacionUsuarioRepository } from '../../../domain/interfaces/IInvitacionUsuarioRepository';
import { IEstadoInvitacionRepository } from '../../../domain/interfaces/IEstadoInvitacionRepository';
import { EstadoInvitacionEnum } from '../../../domain/value-objects/EstadoInvitacion';
import { LIMITE_INVITACIONES_PENDIENTES } from '../../../domain/value-objects/Constantes';
import { CountInvitacionesPendientesResultDto } from '../dtos/CountInvitacionesPendientesDto';

export class CountInvitacionesPendientesUseCase {
  constructor(
    private invitacionUsuarioRepository: IInvitacionUsuarioRepository,
    private estadoInvitacionRepository: IEstadoInvitacionRepository
  ) {}

  async execute(eventoId: number): Promise<CountInvitacionesPendientesResultDto> {
    if (!eventoId) {
      throw new Error('evento_id es requerido');
    }

    // Obtener estado "Pendiente"
    const estadoPendiente = await this.estadoInvitacionRepository.findByNombre(EstadoInvitacionEnum.PENDIENTE);
    if (!estadoPendiente) {
      return { pendientes: 0, limite: LIMITE_INVITACIONES_PENDIENTES };
    }

    const pendientes = await this.invitacionUsuarioRepository.countPendientesByEvento(
      eventoId,
      estadoPendiente.estado_id
    );
    
    return {
      pendientes,
      limite: LIMITE_INVITACIONES_PENDIENTES
    };
  }
}
