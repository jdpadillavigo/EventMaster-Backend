import { IRolRepository } from '../../domain/interfaces/IRolRepository';

const db = require('../database/models');

export class RolRepository implements IRolRepository {
  
  async findByNombre(nombre: string): Promise<any | null> {
    try {
      const rol = await db.Rol.findOne({
        where: { nombre }
      });
      
      return rol;
    } catch (error) {
      console.error('Error en findByNombre:', error);
      throw error;
    }
  }
}
