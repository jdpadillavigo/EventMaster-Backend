import { Observer } from './Observer';
import { IEventoParticipanteRepository } from '../../../domain/interfaces/IEventoParticipanteRepository';
import { INotificacionUsuarioRepository } from '../../../domain/interfaces/INotificacionUsuarioRepository';
import { TipoNotificacion } from '../../../domain/value-objects/TipoNotificacion';
import { NotificacionFabrica } from '../factoryMethod/NotificacionFabrica';
import { TipoRol } from '../../../domain/value-objects/TipoRol';
import { Payload } from './Payload';

export class ParticipantesObserver implements Observer {
  constructor(
    private eventoParticipanteRepository: IEventoParticipanteRepository,
    private notificacionUsuarioRepository: INotificacionUsuarioRepository
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
        let destinatarios = await this.eventoParticipanteRepository.findParticipantesByEventoAndRol(eventoId);

        if (soloParaOrganizadores) {
            destinatarios = destinatarios.filter(p => p.rol === TipoRol.ORGANIZADOR || p.rol === TipoRol.COORGANIZADOR);
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

