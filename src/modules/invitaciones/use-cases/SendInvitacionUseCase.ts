import { IUsuarioRepository } from '../../../domain/interfaces/IUsuarioRepository';
import { IEventoRepository } from '../../../domain/interfaces/IEventoRepository';
import { IEventoParticipanteRepository } from '../../../domain/interfaces/IEventoParticipanteRepository';
import { IInvitacionUsuarioRepository } from '../../../domain/interfaces/IInvitacionUsuarioRepository';
import { IEstadoInvitacionRepository } from '../../../domain/interfaces/IEstadoInvitacionRepository';
import { SendInvitacionDto, SendInvitacionResultDto } from '../dtos/SendInvitacionDto';
import { EstadoInvitacionEnum } from '../../../domain/value-objects/EstadoInvitacion';
import { LIMITE_INVITACIONES_PENDIENTES } from '../../../domain/value-objects/Constantes';
import { TipoNotificacion } from '../../../domain/value-objects/TipoNotificacion';
import { NotificacionFabrica } from '../../../infrastructure/factories/NotificacionFabrica';

export class SendInvitacionUseCase {
  constructor(
    private usuarioRepository: IUsuarioRepository,
    private eventoRepository: IEventoRepository,
    private eventoParticipanteRepository: IEventoParticipanteRepository,
    private invitacionUsuarioRepository: IInvitacionUsuarioRepository,
    private estadoInvitacionRepository: IEstadoInvitacionRepository
  ) {}

  async execute(dto: SendInvitacionDto): Promise<SendInvitacionResultDto> {
    // Validar datos requeridos
    if (!dto.evento_id || !Array.isArray(dto.usuario_ids) || dto.usuario_ids.length === 0) {
      throw new Error('evento_id y usuario_ids son requeridos');
    }

    // Verificar que el evento existe
    const evento = await this.eventoRepository.findById(dto.evento_id);
    if (!evento) {
      throw new Error('Event not found');
    }

    // Obtener estado "Pendiente"
    const estadoPendiente = await this.estadoInvitacionRepository.findByNombre(EstadoInvitacionEnum.PENDIENTE);
    if (!estadoPendiente) {
      throw new Error("Estado 'Pendiente' not found in database");
    }

    // CONTAR invitaciones pendientes existentes para este evento
    const pendientesActuales = await this.invitacionUsuarioRepository.countPendientesByEvento(
      dto.evento_id,
      estadoPendiente.estado_id
    );

    const cupoDisponible = LIMITE_INVITACIONES_PENDIENTES - pendientesActuales;

    // Validación para que el grupo no exceda el cupo disponible
    if (dto.usuario_ids.length > cupoDisponible) {
      throw new Error(`No se pueden enviar ${dto.usuario_ids.length} invitaciones. Solo quedan ${cupoDisponible} disponibles.`);
    }

    // Filtrar usuarios que NO tienen invitación para este evento
    const usuariosNoInvitados: number[] = [];
    const resultados: any[] = [];

    for (const usuario_id of dto.usuario_ids) {
      const usuario = await this.usuarioRepository.findById(usuario_id);
      if (!usuario) {
        resultados.push({ usuario_id, status: 'User not found' });
        continue;
      }

      // Validar si ya está en el evento (por cualquier rol)
      const yaEnEvento = await this.eventoParticipanteRepository.isUsuarioInEvento(dto.evento_id, usuario_id);

      if (yaEnEvento) {
        resultados.push({ usuario_id, status: 'Already in event' });
        continue;
      }

      // Validar si ya tiene invitación para este evento
      const invitacionExistente = await this.invitacionUsuarioRepository.findByEventoAndUsuario(
        dto.evento_id,
        usuario_id
      );

      if (invitacionExistente) {
        resultados.push({ usuario_id, status: 'Already invited' });
        continue;
      }

      usuariosNoInvitados.push(usuario_id);
    }

    // Si no hay usuarios nuevos, no crear Notificacion ni Invitacion
    if (usuariosNoInvitados.length === 0) {
      return {
        success: true,
        resultados
      };
    }

    // Usar Factory Method para crear Notificacion + Invitacion
    const nuevaInvitacion = await NotificacionFabrica.crearNotificacion(
      new Date(),
      dto.evento_id,
      TipoNotificacion.INVITACION,
      dto.fechaLimite
    );

    // Crear InvitacionUsuario solo para los usuarios no invitados
    for (const usuario_id of usuariosNoInvitados) {
      const nuevaInvitacionUsuario = await this.invitacionUsuarioRepository.create({
        estado_invitacion_id: estadoPendiente.estado_id,
        invitacion_id: nuevaInvitacion.notificacion_id,
        usuario_id
      });

      resultados.push({
        usuario_id,
        status: 'Invitation sent',
        invitacion_usuario_id: nuevaInvitacionUsuario.invitacion_usuario_id
      });
    }

    return {
      success: true,
      notificacion_id: nuevaInvitacion.notificacion_id,
      resultados
    };
  }
}
