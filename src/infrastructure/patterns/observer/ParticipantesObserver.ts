import { Observer } from './Observer';
import { IEventoParticipanteRepository } from '../../../domain/interfaces/IEventoParticipanteRepository';
import { INotificacionUsuarioRepository } from '../../../domain/interfaces/INotificacionUsuarioRepository';
import { IRolRepository } from '../../../domain/interfaces/IRolRepository';
import { TipoNotificacion } from '../../../domain/value-objects/TipoNotificacion';
import { NotificacionFabrica } from '../factoryMethod/NotificacionFabrica';
import { TipoRol } from '../../../domain/value-objects/TipoRol';
import { Payload } from './Payload';

export class ParticipantesObserver implements Observer {
  constructor(
    private eventoParticipanteRepository: IEventoParticipanteRepository,
    private notificacionUsuarioRepository: INotificacionUsuarioRepository,
    private rolRepository: IRolRepository
  ) {}

    async update(eventType: string, payload: Payload): Promise<void> {
        const { eventoId, emisorId } = payload;

        // Estrategias centralizadas: tipo → mensaje + público
        const estrategias: Record<
        string,
        {
            mensaje: string;
            soloParaOrganizadores: boolean
        }
        > = {
            EVENTO_EDITADO: {
                mensaje: 'El evento fue editado.',
                soloParaOrganizadores: false,
            },
            RECURSO_AGREGADO: {
                mensaje: 'Se agregó un nuevo recurso al evento.',
                soloParaOrganizadores: false,
            },
            RECURSO_ELIMINADO: {
                mensaje: 'Se eliminó un recurso del evento.',
                soloParaOrganizadores: false,
            },
            DESVINCULACION: {
                mensaje: 'Se ha desvinculado del evento.',
                soloParaOrganizadores: true,
            },
        };

        const estrategia = estrategias[eventType];
        if (!estrategia) return; // No hacemos nada si no hay estrategia definida

        const { mensaje, soloParaOrganizadores } = estrategia;

        // Llamar al método fábrica para Notificacion + NotificacionAccion
        const nuevaNotificacion = await NotificacionFabrica.crearNotificacion(
            new Date(),
            eventoId,
            TipoNotificacion.ACCION,
            mensaje
        );
    
        // Seleccionar destinatarios según público
        let destinatarios;

        if (soloParaOrganizadores) {
            // Busco el rol organizador
            const RolOrganizador = await this.rolRepository.findByNombre(TipoRol.ORGANIZADOR);
            destinatarios = await this.eventoParticipanteRepository.findAllWithFilters(eventoId, [RolOrganizador.rol_id], emisorId);
        } else {
            // Busco el rol asistente
            const RolAsistente = await this.rolRepository.findByNombre(TipoRol.ASISTENTE);
            destinatarios = await this.eventoParticipanteRepository.findAllWithFilters(eventoId, [RolAsistente.rol_id], emisorId);
        }

        // Filtrar destinatarios   
        destinatarios = destinatarios.filter(p => p.usuario_id !== emisorId);

        // Crear notificaciones para los destinatarios
        for (const destinatario of destinatarios) {
            await this.notificacionUsuarioRepository.create({
                notificacion_accion_id: nuevaNotificacion.notificacion_id,
                usuario_id: destinatario.usuario_id,
            });
        }

        console.log(
            `Notificados ${destinatarios.length} usuarios (${soloParaOrganizadores ? 'ORGANIZADORES' : 'TODOS'}) de evento_id ${eventoId} sobre ${eventType}`
        );
    }
}

