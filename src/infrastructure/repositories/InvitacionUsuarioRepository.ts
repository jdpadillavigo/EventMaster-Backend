import { IInvitacionUsuarioRepository } from '../../domain/interfaces/IInvitacionUsuarioRepository';

const db = require('../database/models');

export class InvitacionUsuarioRepository implements IInvitacionUsuarioRepository {
  
  constructor() {}
  
  async create(data: any): Promise<any> {
    try {
      const nuevaInvitacionUsuario = await db.InvitacionUsuario.create(data);
      return nuevaInvitacionUsuario;
    } catch (error) {
      console.error('Error en create:', error);
      throw error;
    }
  }

  async findPendienteByEventoAndUsuario(eventoId: number, estadoPendienteId: number, usuarioId: number): Promise<any | null> {
    try {
      const invitacionExistente = await db.InvitacionUsuario.findOne({
        where: { 
          usuario_id: usuarioId,
          estado_invitacion_id: estadoPendienteId
         },
        include: [{
          model: db.Invitacion,
          as: 'invitacion',
          required: true,
          include: [{
            model: db.Notificacion,
            as: 'notificacion',
            required: true,
            where: { evento_id: eventoId }
          }]
        }]
      });
      
      return invitacionExistente;
    } catch (error) {
      console.error('Error en findPendienteByEventoAndUsuario:', error);
      throw error;
    }
  }

  async countPendientesByEvento(eventoId: number, estadoPendienteId: number): Promise<number> {
    try {
      const count = await db.InvitacionUsuario.count({
        include: [{
          model: db.Invitacion,
          as: "invitacion",
          required: true,
          include: [{
            model: db.Notificacion,
            as: "notificacion",
            required: true,
            where: { evento_id: eventoId }
          }]
        }],
        where: { estado_invitacion_id: estadoPendienteId }
      });

      return count;
    } catch (error) {
      console.error('Error en countPendientesByEvento:', error);
      throw error;
    }
  }

  async findPendientesByEvento(eventoId: number, estadoPendienteId: number): Promise<any[]> {
    try {
      // Obtener pendientes
      const pendientes = await db.InvitacionUsuario.findAll({
        where: { estado_invitacion_id: estadoPendienteId },
        include: [
          {
            model: db.Invitacion,
            as: "invitacion",
            required: true,
            include: [{
              model: db.Notificacion,
              as: "notificacion",
              required: true,
              where: { evento_id: eventoId },
              attributes: []
            }],
            attributes: []
          },
          {
            model: db.Usuario,
            as: "usuario",
            attributes: ["usuario_id", "correo"],
            required: true,
            include: [{
              model: db.Cliente,
              as: "cliente",
              attributes: ["nombre", "apellido"],
              required: true
            }]
          }
        ]
      });
      return pendientes;
    } catch (error) {
      console.error('Error en findPendientesByEvento:', error);
      throw error;
    }
  }

  async findByIdWithEventoAndUsuario(invitacionUsuarioId: number): Promise<any | null> {
    try {
      const invitacionUsuario = await db.InvitacionUsuario.findOne({
        where: { invitacion_usuario_id: invitacionUsuarioId },
        include: [
          {
            model: db.Invitacion,
            as: 'invitacion',
            include: [{
              model: db.Notificacion,
              as: 'notificacion',
              include: [{
                model: db.Evento,
                as: 'evento'
              }]
            }]
          },
          {
            model: db.Usuario,
            as: 'usuario',
            include: [{
              model: db.Cliente,
              as: 'cliente'
            }]
          },
          {
            model: db.EstadoInvitacion,
            as: 'estado'
          }
        ]
      });

      return invitacionUsuario;
    } catch (error) {
      console.error('Error en findByIdWithRelations:', error);
      throw error;
    }
  }

  async update(invitacionUsuarioId: number, data: any): Promise<any | null> {
    try {
      const invitacionUsuario = await db.InvitacionUsuario.findByPk(invitacionUsuarioId);
      if (!invitacionUsuario) return null;

      await invitacionUsuario.update(data);
      return invitacionUsuario;
    } catch (error) {
      console.error('Error en update:', error);
      throw error;
    }
  }

  async findAllByUsuarioIdWithDetalles(usuarioId: number): Promise<any[]> {
    try {
      const rows = await db.InvitacionUsuario.findAll({
        where: { usuario_id: usuarioId },
        include: [
          {
            model: db.Invitacion,
            as: 'invitacion',
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
          },
          {
            model: db.EstadoInvitacion,
            as: 'estado'
          }
        ]
      });
      return rows;
    } catch (error) {
      console.error('Error en findAllByUsuarioIdWithDetalles:', error);
      throw error;
    }
  }
}
