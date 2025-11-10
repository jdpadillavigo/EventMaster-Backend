import { IUsuarioRepository } from '../../domain/interfaces/IUsuarioRepository';

const db = require('../database/models');

export class UsuarioRepository implements IUsuarioRepository {
  
  async findById(id: number): Promise<any | null> {
    try {
      const usuario = await db.Usuario.findByPk(id, {
        include: [{
          model: db.Cliente,
          as: 'cliente',
          attributes: ['nombre', 'apellido']
        }]
      });
      
      return usuario;
    } catch (error) {
      console.error('Error en findById:', error);
      throw error;
    }
  }

  async findByEmail(email: string): Promise<any | null> {
    try {
      const usuario = await db.Usuario.findOne({
        where: { correo: email },
        include: [{
          model: db.Cliente,
          as: 'cliente'
        }]
      });
      
      return usuario;
    } catch (error) {
      console.error('Error en findByEmail:', error);
      throw error;
    }
  }

  async findByActivationToken(token: string): Promise<any | null> {
    try {
      const usuario = await db.Usuario.findOne({
        where: { activation_token: token },
        include: [{
          model: db.Cliente,
          as: 'cliente',
          attributes: ['nombre', 'apellido']
        }]
      });
      
      return usuario;
    } catch (error) {
      console.error('Error en findByActivationToken:', error);
      throw error;
    }
  }

  // optimizado para PostgreSQL
  async searchActiveByQuery(query: string, limit: number): Promise<any[]> {
    try {
      // Normaliza y divide la búsqueda en palabras (ignora espacios múltiples)
      const searchTerms = query
        .trim()
        .split(/\s+/)
        .filter(Boolean);

      const usuarios = await db.Usuario.findAll({
        include: [
          {
            model: db.Cliente,
            as: 'cliente',
            attributes: ['nombre', 'apellido'],
            required: true
          }
        ],
        where: {
          isActive: true,
          [db.Sequelize.Op.and]: searchTerms.map(term => ({
            [db.Sequelize.Op.or]: [
              { correo: { [db.Sequelize.Op.iLike]: `%${term}%` } },
              { '$cliente.nombre$': { [db.Sequelize.Op.iLike]: `%${term}%` } },
              { '$cliente.apellido$': { [db.Sequelize.Op.iLike]: `%${term}%` } }
            ]
          }))
        },
        attributes: ['usuario_id', 'correo'],
        limit
      });

      return usuarios;
    } catch (error) {
      console.error('Error en searchByQuery:', error);
      throw error;
    }
  }

  async create(data: { correo: string; clave: string; isActive?: boolean; activation_token?: string; token_expires_at?: Date }): Promise<any> {
    try {
      const nuevoUsuario = await db.Usuario.create({
        correo: data.correo,
        clave: data.clave,
        isActive: data.isActive ?? true,
        activation_token: data.activation_token,
        token_expires_at: data.token_expires_at
      });
      
      return nuevoUsuario;
    } catch (error) {
      console.error('Error en create:', error);
      throw error;
    }
  }

  async update(id: number, data: any): Promise<any | null> {
    try {
      const usuario = await db.Usuario.findByPk(id);
      if (!usuario) return null;
      
      await usuario.update(data);
      
      return usuario;
    } catch (error) {
      console.error('Error en update:', error);
      throw error;
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const result = await db.Usuario.destroy({ where: { usuario_id: id } });
      return result > 0;
    } catch (error) {
      console.error('Error en delete:', error);
      throw error;
    }
  }
}
