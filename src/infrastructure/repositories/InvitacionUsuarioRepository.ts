import { IInvitacionUsuarioRepository } from '../../domain/interfaces/IInvitacionUsuarioRepository';
import { TipoNoElegible } from '../../domain/value-objects/EstadoInvitacion';

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

  // Nota: Arreglar para ver si está pendiente!
  // Tarea: Validación de invitación repetida
  async findByEventoAndUsuario(eventoId: number, usuarioId: number): Promise<any | null> {
    try {
      const invitacionExistente = await db.InvitacionUsuario.findOne({
        where: { usuario_id: usuarioId },
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
      console.error('Error en findByEventoAndUsuario:', error);
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

  async findNoElegiblesByEvento(eventoId: number, estadoPendienteId: number): Promise<any[]> {
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

      // Obtener participantes
      const participantes = await db.EventoParticipante.findAll({
        where: { evento_id: eventoId },
        include: [{
          model: db.Participante,
          as: "participante",
          required: true,
          include: [{
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
          }]
        }]
      });

      const noElegibles = [
        ...pendientes.map((i: any) => ({
          usuario_id: i.usuario.usuario_id,
          correo: i.usuario.correo,
          nombre: i.usuario.cliente?.nombre || "",
          apellido: i.usuario.cliente?.apellido || "",
          tipo: TipoNoElegible.PENDIENTE
        })),
        ...participantes.map((p: any) => ({
          usuario_id: p.participante.usuario.usuario_id,
          correo: p.participante.usuario.correo,
          nombre: p.participante.usuario.cliente?.nombre || "",
          apellido: p.participante.usuario.cliente?.apellido || "",
          tipo: TipoNoElegible.PARTICIPANTE
        }))
      ];

      return noElegibles;
    } catch (error) {
      console.error('Error en findNoElegiblesByEvento:', error);
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
