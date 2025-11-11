import { IInvitacionRepository } from '../../../domain/interfaces/IInvitacionRepository';
import { INotificacionRepository } from '../../../domain/interfaces/INotificacionRepository';
import { NotificacionFabrica } from './NotificacionFabrica';
import { DIAS_VALIDEZ_INVITACION } from '../../../domain/value-objects/Constantes';

const db = require('../../database/models');

/**
 * Fábrica Concreta - Implementación del patrón Factory Method
 * Crea invitaciones (notificación + invitación)
 */
export class InvitacionFabrica extends NotificacionFabrica {
  constructor(
    private invitacionRepository: IInvitacionRepository,
    notificacionRepository: INotificacionRepository
  ) {
    super(notificacionRepository);
  }
  /**
   * Método Fábrica sobreescrito - crea una invitación completa
   * @param fechaHora - Fecha y hora de la notificación
   * @param eventoId - ID del evento asociado
   * @returns Promise con la invitación creada
   */
  public async MetodoFabrica(
    fechaHora: Date,
    eventoId: number,
  ): Promise<any> {
    // 1. Crear la notificación base
    const notificacion = await this.crearNotificacionBase(fechaHora, eventoId);
    
    // 2. Calcular fecha límite si no se proporciona
    const fechaLimiteCalculada = new Date(Date.now() + DIAS_VALIDEZ_INVITACION * 24 * 60 * 60 * 1000);
    
    // 3. Crear la invitación asociada
    const invitacion = await this.invitacionRepository.create({
      notificacion_id: notificacion.notificacion_id,
      fechaLimite: fechaLimiteCalculada
    });
    
    return invitacion;
  }
}