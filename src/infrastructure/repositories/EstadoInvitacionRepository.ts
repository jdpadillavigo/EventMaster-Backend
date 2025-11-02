import { IEstadoInvitacionRepository } from '../../domain/interfaces/IEstadoInvitacionRepository';

const db = require('../database/models');

export class EstadoInvitacionRepository implements IEstadoInvitacionRepository {
  
  async findByNombre(nombre: string): Promise<any | null> {
    try {
      const estado = await db.EstadoInvitacion.findOne({
        where: { nombre }
      });
      
      return estado;
    } catch (error) {
      console.error('Error en findByNombre:', error);
      throw error;
    }
  }
}
