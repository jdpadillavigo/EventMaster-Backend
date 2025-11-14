import { INotificacionRepository } from '../../domain/interfaces/INotificacionRepository';

const db = require('../database/models');

export class NotificacionRepository implements INotificacionRepository {
  async create(data: any): Promise<any> {
    try {
      const nuevaNotificacion = await db.Notificacion.create(data);
      return nuevaNotificacion;
    } catch (error) {
      console.error('Error en create:', error);
      throw error;
    }
  }
}
