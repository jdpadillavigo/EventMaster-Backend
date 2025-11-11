import { IInvitacionRepository } from '../../domain/interfaces/IInvitacionRepository';

const db = require('../database/models');

export class InvitacionRepository implements IInvitacionRepository {
  
  async findById(id: number): Promise<any | null> {
    try {
      const invitacion = await db.Invitacion.findByPk(id);
      return invitacion;
    } catch (error) {
      console.error('Error en findById:', error);
      throw error;
    }
  }

  async create(data: any): Promise<any> {
    try {
      const nuevaInvitacion = await db.Invitacion.create(data);
      return nuevaInvitacion;
    } catch (error) {
      console.error('Error en create:', error);
      throw error;
    }
  }
}
