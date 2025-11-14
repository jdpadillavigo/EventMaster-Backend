import { INotificacionAccionRepository } from 'domain/interfaces/INotificacionAccionRepository';
import { INotificacionRepository } from 'domain/interfaces/INotificacionRepository';
import { NotificacionFabrica } from './NotificacionFabrica';

const db = require('../../database/models');

/**
 * Fábrica Concreta - Implementación del patrón Factory Method
 * Crea invitaciones (notificación + invitación)
 */
export class AccionFabrica extends NotificacionFabrica {
  constructor(
    private notificacionAccionRepository: INotificacionAccionRepository,
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
    mensaje: string
  ): Promise<any> {
    // 1. Crear la notificación base
    const notificacion = await this.crearNotificacionBase(fechaHora, eventoId);
    
    // 2. Crear la notificacion-accion
    const notificacionAccion = await this.notificacionAccionRepository.create({
      notificacion_id: notificacion.notificacion_id,
      mensaje: mensaje
    });
    
    return notificacionAccion;
  }
}