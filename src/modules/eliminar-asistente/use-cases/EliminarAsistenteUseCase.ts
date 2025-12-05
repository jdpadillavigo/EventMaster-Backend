import { EliminarAsistenteDto } from '../dtos/EliminarAsistenteDto';
import { EliminarAsistenteResultDto } from '../dtos/EliminarAsistenteResultDto';
import { IEventoRepository } from '../../../domain/interfaces/IEventoRepository';
import { IEventoParticipanteRepository } from '../../../domain/interfaces/IEventoParticipanteRepository';
import { INotificacionUsuarioRepository } from '../../../domain/interfaces/INotificacionUsuarioRepository';
import { NotificacionFabrica } from '../../../infrastructure/patterns/factoryMethod/NotificacionFabrica';
import { TipoNotificacion } from '../../../domain/value-objects/TipoNotificacion';
import { TipoRol } from '../../../domain/value-objects/TipoRol';

export class EliminarAsistenteUseCase {
    constructor(
        private eventoRepository: IEventoRepository,
        private eventoParticipanteRepository: IEventoParticipanteRepository,
        private notificacionUsuarioRepository: INotificacionUsuarioRepository
    ) { }

    async execute(dto: EliminarAsistenteDto): Promise<EliminarAsistenteResultDto> {
        try {
            const { evento_id, usuario_id, emisor_id } = dto;

            // Validar existencia del evento
            const evento = await this.eventoRepository.findById(evento_id);
            if (!evento) {
                return { success: false, message: 'Evento no encontrado' };
            }

            // No permitir que un organizador/coorganizador se elimine a sí mismo
            if (Number(usuario_id) === Number(emisor_id)) {
                return { success: false, message: 'No puedes eliminarte a ti mismo' };
            }

            // Buscar relación del usuario objetivo con el evento
            const link = await this.eventoParticipanteRepository.findByEventoAndUsuario(evento_id, usuario_id);
            if (!link) {
                return { success: false, message: 'Participante no encontrado en el evento' };
            }

            const participante = link.participante;
            const rolNombre = participante.rol?.nombre || '';

            // No permitir eliminar al organizador principal
            if (rolNombre.toLowerCase() === TipoRol.ORGANIZADOR.toLowerCase()) {
                return { success: false, message: 'No se puede eliminar al organizador principal del evento' };
            }

            // Eliminar relación
            await this.eventoParticipanteRepository.deleteByEventoAndParticipante(evento_id, participante.participante_id);

            // Notificar al usuario eliminado (usar fábrica para crear notificacion + notificacion_accion)
            const mensaje = 'Has sido eliminado del evento.';
            const nuevaNotificacion = await NotificacionFabrica.crearNotificacion(new Date(), evento_id, TipoNotificacion.ACCION, mensaje);

            if (nuevaNotificacion) {
                // Seguir la convención usada en el proyecto: notificacion_accion_id -> nuevaNotificacion.notificacion_id
                await this.notificacionUsuarioRepository.create({
                    notificacion_accion_id: nuevaNotificacion.notificacion_id,
                    usuario_id: usuario_id
                });
            }

            return { success: true, message: 'Participante eliminado correctamente', evento_id };
        } catch (error: any) {
            console.error('Error en EliminarInvitadoUseCase:', error);
            throw error;
        }
    }
}