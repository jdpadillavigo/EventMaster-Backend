import { INotificacionAccionRepository } from '../../domain/interfaces/INotificacionAccionRepository';

const db = require('../database/models');

export class NotificacionAccionRepository implements INotificacionAccionRepository {
  
  async findById(id: number): Promise<any | null> {
    try {
      const notificacionAccion = await db.NotificacionAccion.findByPk(id);
      return notificacionAccion;
    } catch (error) {
      console.error('Error en findById:', error);
      throw error;
    }
  }

  async create(data: any): Promise<any> {
    try {
      const nuevaNotificacionAccion = await db.NotificacionAccion.create(data);
      return nuevaNotificacionAccion;
    } catch (error) {
      console.error('Error en create:', error);
      throw error;
    }
  }
}
