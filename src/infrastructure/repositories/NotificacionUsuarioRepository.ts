import { INotificacionUsuarioRepository } from '../../domain/interfaces/INotificacionUsuarioRepository';

const db = require('../database/models');

export class NotificacionUsuarioRepository implements INotificacionUsuarioRepository {
  
  constructor() {}
  
  async create(data: any): Promise<any> {
    try {
      const nuevaNotificacionUsuario = await db.NotificacionUsuario.create(data);
      return nuevaNotificacionUsuario;
    } catch (error) {
      console.error('Error en create:', error);
      throw error;
    }
  }

    async findAllByUsuarioIdWithDetalles(usuarioId: number): Promise<any[] | null> {
    try {
      const rows = await db.NotificacionUsuario.findAll({
        where: { usuario_id: usuarioId },
        include: [
          {
            model: db.NotificacionAccion,
            as: 'notificacion_accion',
            required: true,
            include: [
              {
                model: db.Notificacion,
                as: 'notificacion',
                required: true,
                include: [
                  {
                    model: db.Evento,
                    as: 'evento'
                  }
                ]
              }
            ]
          }
        ],
        order: [[{ model: db.NotificacionAccion, as: 'notificacion_accion' },
                { model: db.Notificacion, as: 'notificacion' },
                'fechaHora', 'DESC']]
      });
      return rows;
    } catch (error) {
      console.error('Error en findAllByUsuarioIdWithDetalles:', error);
      throw error;
    }
  }
}