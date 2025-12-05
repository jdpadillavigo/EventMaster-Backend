import { ITipoRecursoRepository } from '../../domain/interfaces/ITipoRecursoRepository';
const db = require('../database/models');

export class TipoRecursoRepository implements ITipoRecursoRepository {
  
  async findById(id: number): Promise<any | null> {
    try {
      const tipoRecurso = await db.TipoRecurso.findByPk(id);
      return tipoRecurso;
    } catch (error) {
      console.error('Error finding tipo recurso by ID:', error);
      throw new Error('Database connection error');
    }
  }

  async findAll(): Promise<any[]> {
    try {
      const tiposRecurso = await db.TipoRecurso.findAll({
        order: [['nombre', 'ASC']]
      });
      return tiposRecurso;
    } catch (error) {
      console.error('Error finding all tipos recurso:', error);
      throw new Error('Database connection error');
    }
  }

  async findByNombre(nombre: string): Promise<any | null> {
    try {
      const tipoRecurso = await db.TipoRecurso.findOne({
        where: { nombre }
      });
      return tipoRecurso;
    } catch (error) {
      console.error('Error finding tipo recurso by nombre:', error);
      throw new Error('Database connection error');
    }
  }

  async create(data: any): Promise<any> {
    try {
      const tipoRecurso = await db.TipoRecurso.create({
        nombre: data.nombre
      });
      return tipoRecurso;
    } catch (error) {
      console.error('Error creating tipo recurso:', error);
      throw new Error('Database connection error');
    }
  }

  async update(id: number, data: any): Promise<any | null> {
    try {
      const [updatedRowsCount] = await db.TipoRecurso.update({
        nombre: data.nombre
      }, {
        where: { tipo_recurso_id: id }
      });

      if (updatedRowsCount === 0) {
        return null;
      }

      return await this.findById(id);
    } catch (error) {
      console.error('Error updating tipo recurso:', error);
      throw new Error('Database connection error');
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const deletedRowsCount = await db.TipoRecurso.destroy({
        where: { tipo_recurso_id: id }
      });
      return deletedRowsCount > 0;
    } catch (error) {
      console.error('Error deleting tipo recurso:', error);
      throw new Error('Database connection error');
    }
  }
}
