import { IEventoRepository } from '../../domain/interfaces/IEventoRepository';

const db = require('../database/models');

export class EventoRepository implements IEventoRepository {
  
  async findById(id: number): Promise<any | null> {
    try {
      const evento = await db.Evento.findByPk(id, {
        include: [
          {
            model: db.Ubicacion,
            as: 'ubicacion',
            attributes: ['direccion', 'latitud', 'longitud'],
            required: false,
          }
        ]
      });
      return evento;
    } catch (error) {
      console.error('Error en findById:', error);
      throw error;
    }
  }

  async create(data: any): Promise<any> {
    try {
      const nuevoEvento = await db.Evento.create(data);
      return nuevoEvento;
    } catch (error) {
      console.error('Error en create:', error);
      throw error;
    }
  }

  async update(id: number, data: any): Promise<any | null> {
    try {
      const evento = await db.Evento.findByPk(id);
      if (!evento) return null;
      
      await evento.update(data);
      return evento;
    } catch (error) {
      console.error('Error en update:', error);
      throw error;
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const result = await db.Evento.destroy({ where: { evento_id: id } });
      return result > 0;
    } catch (error) {
      console.error('Error en delete:', error);
      throw error;
    }
  }

  async findAll(): Promise<any[]> {
    try {
      const eventos = await db.Evento.findAll();
      return eventos;
    } catch (error) {
      console.error('Error en findAll:', error);
      throw error;
    }
  }

  async incrementParticipantes(eventoId: number): Promise<void> {
    try {
      await db.Evento.increment('nroParticipantes', {
        by: 1,
        where: { evento_id: eventoId }
      });
    } catch (error) {
      console.error('Error en incrementParticipantes:', error);
      throw error;
    }
  }

  async findByTituloLowerCase(titulo: string): Promise<any | null> {
    try {
      const evento = await db.Evento.findOne({
        where: db.Sequelize.where(
          db.Sequelize.fn('LOWER', db.Sequelize.col('titulo')),
          db.Sequelize.Op.eq,
          titulo.toLowerCase()
        )
      });
      return evento;
    } catch (error) {
      console.error('Error en findByTituloLowerCase:', error);
      throw error;
    }
  }

  async countEventosByOrganizador(usuarioId: number): Promise<number> {
    try {
      const count = await db.Evento.count({
        include: [
          {
            model: db.Participante,
            as: 'participantes',
            required: true,
            through: { attributes: [] },
            include: [
              { model: db.Usuario, as: 'usuario', required: true, where: { usuario_id: usuarioId } },
              { model: db.Rol, as: 'rol', required: true, where: { nombre: 'Organizador' } },
            ],
          },
        ],
        distinct: true,
        col: 'evento_id',
      });
      return count;
    } catch (error) {
      console.error('Error en countEventosByOrganizador:', error);
      throw error;
    }
  }

  async findPublicEvents(excludeUsuarioId?: number): Promise<any[]> {
    try {
      const ID_ESTADO_PROGRAMADO = 1;
      const ID_PRIVACIDAD_PUBLICO = 1;

      // Si se proporciona excludeUsuarioId, obtenemos los IDs de eventos donde es organizador
      let eventosExcluidos: number[] = [];
      if (excludeUsuarioId) {
        const eventosOrganizador = await db.Evento.findAll({
          attributes: ['evento_id'],
          include: [
            {
              model: db.Participante,
              as: 'participantes',
              required: true,
              through: { attributes: [] },
              include: [
                { model: db.Usuario, as: 'usuario', required: true, where: { usuario_id: excludeUsuarioId } },
                { model: db.Rol, as: 'rol', required: true, where: { nombre: 'Organizador' } },
              ],
            },
          ],
        });
        eventosExcluidos = eventosOrganizador.map((e: any) => e.evento_id);
      }

      const whereClause: any = {
        estadoEvento: ID_ESTADO_PROGRAMADO,
        privacidad: ID_PRIVACIDAD_PUBLICO,
        fechaFin: { [db.Sequelize.Op.gte]: new Date() },
      };

      // Excluir eventos donde el usuario es organizador
      if (eventosExcluidos.length > 0) {
        whereClause.evento_id = { [db.Sequelize.Op.notIn]: eventosExcluidos };
      }

      const eventos = await db.Evento.findAll({
        attributes: [
          ['evento_id', 'id'],
          ['titulo', 'name'],
          ['fechaInicio', 'dateStart'],
          ['fechaFin', 'dateEnd'],
          ['imagen', 'imageUrl'],
          [
            db.Sequelize.fn(
              'COUNT',
              db.Sequelize.col('participantes.EventoParticipante.participante_id')
            ),
            'attendeesCount',
          ],
        ],
        where: whereClause,
        include: [
          {
            model: db.Ubicacion,
            as: 'ubicacion',
            attributes: [['direccion', 'location']],
            required: false,
          },
          {
            model: db.Participante,
            as: 'participantes',
            attributes: [],
            required: false,
            through: { attributes: [] },
          },
        ],
        group: ['Evento.evento_id', 'ubicacion.ubicacion_id', 'ubicacion.direccion'],
        order: [['fechaInicio', 'ASC']],
        subQuery: false,
      });
      return eventos;
    } catch (error) {
      console.error('Error en findPublicEvents:', error);
      throw error;
    }
  }

  async findManagedEventsByUsuario(usuarioId: number): Promise<any[]> {
    try {
      const cutoff = new Date(Date.now() - 1000 * 60 * 60 * 24 * 2);

      const eventos = await db.Evento.findAll({
        attributes: [
          ['evento_id', 'id'],
          ['titulo', 'name'],
          ['fechaInicio', 'dateStart'],
          ['fechaFin', 'dateEnd'],
          ['imagen', 'imageUrl'],
          ['aforo', 'capacity'],
        ],
        where: {
          fechaFin: { [db.Sequelize.Op.gt]: cutoff },
        },
        include: [
          {
            model: db.Participante,
            as: 'participantes',
            required: true,
            through: { attributes: [] },
            include: [
              { model: db.Usuario, as: 'usuario', required: true, where: { usuario_id: usuarioId } },
              { model: db.Rol, as: 'rol', required: true, where: { nombre: 'Organizador' } },
            ],
          },
        ],
        order: [['fechaInicio', 'ASC']],
        subQuery: false,
      });
      return eventos;
    } catch (error) {
      console.error('Error en findManagedEventsByUsuario:', error);
      throw error;
    }
  }

  // Arreglar: Esta mal que filtre solo rol Asistente 
  // Esta linea esta mal: { model: db.Rol, as: 'rol', required: true, where: { nombre: { [db.Sequelize.Op.ne]: 'Organizador' } } },
  async findAttendedEventsByUsuario(usuarioId: number): Promise<any[]> {
    try {
      const eventos = await db.Evento.findAll({
        attributes: [
          ['evento_id', 'id'],
          ['titulo', 'name'],
          ['fechaInicio', 'dateStart'],
          ['fechaFin', 'dateEnd'],
          ['imagen', 'imageUrl'],
        ],
        include: [
          {
            model: db.Participante,
            as: 'participantes',
            required: true,
            through: { attributes: [] },
            include: [
              { model: db.Usuario, as: 'usuario', required: true, where: { usuario_id: usuarioId } },
              { model: db.Rol, as: 'rol', required: true, where: { nombre: { [db.Sequelize.Op.ne]: 'Organizador' } } },
            ],
          },
        ],
        order: [['fechaInicio', 'ASC']],
        subQuery: false,
      });
      return eventos;
    } catch (error) {
      console.error('Error en findAttendedEventsByUsuario:', error);
      throw error;
    }
  }
}
