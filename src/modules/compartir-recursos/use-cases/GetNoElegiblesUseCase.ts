import { IInvitacionUsuarioRepository } from '../../../domain/interfaces/IInvitacionUsuarioRepository';
import { IEstadoInvitacionRepository } from '../../../domain/interfaces/IEstadoInvitacionRepository';
import { IEventoParticipanteRepository } from '../../../domain/interfaces/IEventoParticipanteRepository';
import { EstadoInvitacionEnum } from '../../../domain/value-objects/EstadoInvitacion';
import { UsuarioNoElegibleDto } from '../dtos/UsuarioNoElegibleDto';
import { TipoNoElegible } from '../../../domain/value-objects/TipoNoElegible';


export class GetNoElegiblesUseCase {
  constructor(
    private invitacionUsuarioRepository: IInvitacionUsuarioRepository,
    private estadoInvitacionRepository: IEstadoInvitacionRepository,
    private eventoParticipanteRepository: IEventoParticipanteRepository
  ) {}

  async execute(eventoId: number): Promise<UsuarioNoElegibleDto[]> {
    if (!eventoId) {
      throw new Error('evento_id es requerido');
    }

    // Obtener el ID del estado "Pendiente"
    const estadoPendiente = await this.estadoInvitacionRepository.findByNombre(
      EstadoInvitacionEnum.PENDIENTE
    );

    if (!estadoPendiente) {
      throw new Error('No se encontró el estado de invitación PENDIENTE');
    }

    // Obtener usuarios con invitaciones pendientes
    const pendientes = await this.invitacionUsuarioRepository.findPendientesByEvento(
      eventoId, 
      estadoPendiente.estado_id
    );

    // Obtener participantes del evento
    const participantes = await this.eventoParticipanteRepository.findParticipantesByEvento(eventoId);

    // Mapear resultados
    const pendientesMapeados: UsuarioNoElegibleDto[] = pendientes.map((pe: any) => ({
      usuario_id: pe.usuario.usuario_id,
      correo: pe.usuario.correo,
      nombre: pe.usuario.cliente?.nombre || '',
      apellido: pe.usuario.cliente?.apellido || '',
      tipo: TipoNoElegible.PENDIENTE_ASISTENTE
    }));

    const participantesMapeados: UsuarioNoElegibleDto[] = participantes.map((pa: any) => ({
      usuario_id: pa.participante.usuario.usuario_id,
      correo:  pa.participante.usuario.correo,
      nombre: pa.participante.usuario.cliente?.nombre || '',
      apellido: pa.participante.usuario.cliente?.apellido || '',
      tipo: TipoNoElegible.PARTICIPANTE
    }));

    // Combinar y ordenar resultados
    return [...pendientesMapeados, ...participantesMapeados].sort((a, b) => {
      // Ordenar por tipo primero
      if (a.tipo !== b.tipo) {
        return a.tipo.localeCompare(b.tipo);
      }
      // Si los tipos son iguales, ordenar por usuario_id
      return a.usuario_id - b.usuario_id;
    });
  }
}
