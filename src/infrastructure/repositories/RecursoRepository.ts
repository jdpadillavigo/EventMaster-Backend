import { IRecursoRepository } from '../../domain/interfaces/IRecursoRepository';
const db = require('../database/models');

export class RecursoRepository implements IRecursoRepository {
  
  async findById(id: number): Promise<any | null> {
    try {
      const recurso = await db.Recurso.findByPk(id, {
        include: [
          {
            model: db.TipoRecurso,
            as: 'tipo'
          },
          {
            model: db.Evento,
            as: 'evento'
          }
        ]
      });
      return recurso;
    } catch (error) {
      console.error('Error finding recurso by ID:', error);
      throw new Error('Database connection error');
    }
  }

  async create(data: any): Promise<any> {
    try {
      const recurso = await db.Recurso.create({
        nombre: data.nombre,
        url: data.url,
        tipo_recurso: data.tipo_recurso,
        evento_id: data.evento_id
      });
      return await this.findById(recurso.recurso_id);
    } catch (error) {
      console.error('Error creating recurso:', error);
      throw new Error('Database connection error');
    }
  }

  async update(id: number, data: any): Promise<any | null> {
    try {
      const [updatedRowsCount] = await db.Recurso.update({
        nombre: data.nombre,
        url: data.url,
        tipo_recurso: data.tipo_recurso
      }, {
        where: { recurso_id: id }
      });

      if (updatedRowsCount === 0) {
        return null;
      }

      return await this.findById(id);
    } catch (error) {
      console.error('Error updating recurso:', error);
      throw new Error('Database connection error');
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const deletedRowsCount = await db.Recurso.destroy({
        where: { recurso_id: id }
      });
      return deletedRowsCount > 0;
    } catch (error) {
      console.error('Error deleting recurso:', error);
      throw new Error('Database connection error');
    }
  }

  async findAll(): Promise<any[]> {
    try {
      const recursos = await db.Recurso.findAll({
        include: [
          {
            model: db.TipoRecurso,
            as: 'tipo'
          },
          {
            model: db.Evento,
            as: 'evento'
          }
        ],
        order: [['recurso_id', 'DESC']]
      });
      return recursos;
    } catch (error) {
      console.error('Error finding all recursos:', error);
      throw new Error('Database connection error');
    }
  }

  async findByNombre(nombre: string): Promise<any | null> {
    try {
      const recurso = await db.Recurso.findOne({
        where: { nombre },
        include: [
          {
            model: db.TipoRecurso,
            as: 'tipo'
          },
          {
            model: db.Evento,
            as: 'evento'
          }
        ]
      });
      return recurso;
    } catch (error) {
      console.error('Error finding recurso by nombre:', error);
      throw new Error('Database connection error');
    }
  }

  async findByEventoId(eventoId: number): Promise<any[]> {
    try {
      const recursos = await db.Recurso.findAll({
        where: { evento_id: eventoId },
        include: [
          {
            model: db.TipoRecurso,
            as: 'tipo'
          }
        ],
        order: [['recurso_id', 'DESC']]
      });
      return recursos;
    } catch (error) {
      console.error('Error finding recursos by evento ID:', error);
      throw new Error('Database connection error');
    }
  }

  async findByTipoRecurso(tipoRecursoId: number): Promise<any[]> {
    try {
      const recursos = await db.Recurso.findAll({
        where: { tipo_recurso: tipoRecursoId },
        include: [
          {
            model: db.TipoRecurso,
            as: 'tipo'
          },
          {
            model: db.Evento,
            as: 'evento'
          }
        ],
        order: [['recurso_id', 'DESC']]
      });
      return recursos;
    } catch (error) {
      console.error('Error finding recursos by tipo recurso:', error);
      throw new Error('Database connection error');
    }
  }

  async findByEventoAndTipo(eventoId: number, tipoRecursoId: number): Promise<any[]> {
    try {
      const recursos = await db.Recurso.findAll({
        where: { 
          evento_id: eventoId,
          tipo_recurso: tipoRecursoId
        },
        include: [
          {
            model: db.TipoRecurso,
            as: 'tipo'
          }
        ],
        order: [['recurso_id', 'DESC']]
      });
      return recursos;
    } catch (error) {
      console.error('Error finding recursos by evento and tipo:', error);
      throw new Error('Database connection error');
    }
  }

  async searchByNombre(query: string, limit: number = 10): Promise<any[]> {
    try {
      const { Op } = require('sequelize');
      const recursos = await db.Recurso.findAll({
        where: {
          nombre: {
            [Op.iLike]: `%${query}%`
          }
        },
        include: [
          {
            model: db.TipoRecurso,
            as: 'tipo'
          },
          {
            model: db.Evento,
            as: 'evento'
          }
        ],
        limit,
        order: [['recurso_id', 'DESC']]
      });
      return recursos;
    } catch (error) {
      console.error('Error searching recursos by nombre:', error);
      throw new Error('Database connection error');
    }
  }

  async countByEvento(eventoId: number): Promise<number> {
    try {
      const count = await db.Recurso.count({
        where: { evento_id: eventoId }
      });
      return count;
    } catch (error) {
      console.error('Error counting recursos by evento:', error);
      throw new Error('Database connection error');
    }
  }

  async findRecursosWithDetailsForEvento(eventoId: number): Promise<any[]> {
    try {
      const recursos = await db.Recurso.findAll({
        where: { evento_id: eventoId },
        include: [
          {
            model: db.TipoRecurso,
            as: 'tipo'
          },
          {
            model: db.Evento,
            as: 'evento'
          }
        ],
        order: [['recurso_id', 'DESC']]
      });
      return recursos;
    } catch (error) {
      console.error('Error finding recursos with details for evento:', error);
      throw new Error('Database connection error');
    }
  }
}
