import { IEstadoEventoRepository } from '../../domain/interfaces/IEstadoEventoRepository';

const db = require('../database/models');

export class EstadoEventoRepository implements IEstadoEventoRepository {
  
  async findByNombre(nombre: string): Promise<any | null> {
    try {
      const estado = await db.EstadoEvento.findOne({
        where: { nombre }
      });
      
      return estado;
    } catch (error) {
      console.error('Error en findByNombre:', error);
      throw error;
    }
  }
}
