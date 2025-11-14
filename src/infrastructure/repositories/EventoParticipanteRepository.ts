import { IEventoParticipanteRepository } from '../../domain/interfaces/IEventoParticipanteRepository';

const db = require('../database/models');

export class EventoParticipanteRepository implements IEventoParticipanteRepository {
  
  async findByEventoAndUsuario(eventoId: number, usuarioId: number): Promise<any | null> {
    try {
      const link = await db.EventoParticipante.findOne({
        include: [{
          model: db.Participante,
          as: "participante",
          required: true,
          where: { usuario_id: usuarioId }
        }],
        where: { evento_id: eventoId }
      });
      
      return link 
    } catch (error) {
      console.error('Error en findByEventoAndUsuario:', error);
      throw error;
    }
  }

  async findParticipantesByEventoAndRol(eventoId: number): Promise<any[]> {
    try {
      const links = await db.EventoParticipante.findAll({
        where: { evento_id: eventoId }, 
        include: [
          {
            model: db.Participante,
            as: 'participante',
            required: true,
            include: [
              {
                model: db.Usuario,
                as: 'usuario',
                required: true,
                include: [{ 
                  model: db.Cliente, 
                  as: 'cliente' 
                }]
              },
              { 
                model: db.Rol, 
                as: 'rol' 
              }
            ]
          }
        ]
      });

      const participantes = links.map((l: any) => ({
        participante_id: l.participante.participante_id,
        usuario_id: l.participante.usuario.usuario_id,
        correo: l.participante.usuario.correo,
        nombre: l.participante.usuario.cliente?.nombre || '',
        apellido: l.participante.usuario.cliente?.apellido || '',
        rol: l.participante.rol?.nombre || ''
      }));

      return participantes;
    } catch (error) {
      console.error('Error en findParticipantesByEventoAndRol:', error);
      throw error;
    }
  }

  async findParticipantesByEvento(eventoId: number): Promise<any[]> {
    try {
      // Obtener participantes
      const links = await db.EventoParticipante.findAll({
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
      return links;
    } catch (error) {
      console.error('Error en findParticipantesByEvento:', error);
      throw error;
    }
  }

  async countByEvento(eventoId: number): Promise<number> {
    try {
      const count = await db.EventoParticipante.count({
        where: { evento_id: eventoId }
      });
      
      return count;
    } catch (error) {
      console.error('Error en countByEvento:', error);
      throw error;
    }
  }

  async countByParticipante(participanteId: number): Promise<number> {
    try {
      const count = await db.EventoParticipante.count({
        where: { participante_id: participanteId }
      });
      
      return count;
    } catch (error) {
      console.error('Error en countByParticipante:', error);
      throw error;
    }
  }

  async findByEventoAndParticipante(eventoId: number, participanteId: number): Promise<any | null> {
    try {
      const link = await db.EventoParticipante.findOne({
        where: { evento_id: eventoId, participante_id: participanteId }
      });
      
      return link;
    } catch (error) {
      console.error('Error en findByEventoAndParticipante:', error);
      throw error;
    }
  }

  async create(eventoId: number, participanteId: number): Promise<any> {
    try {
      const nuevoLink = await db.EventoParticipante.create({
        evento_id: eventoId,
        participante_id: participanteId
      });
      return nuevoLink;
    } catch (error) {
      console.error('Error en create:', error);
      throw error;
    }
  }

  // Buscar si el participante esta en algún evento
  async findByParticipante(participanteId: number): Promise<any[]> {
    try {
      const link = await db.EventoParticipante.findOne({
        where: { participante_id: participanteId }
      });
      return link;
    } catch (error) {
      console.error('Error en findByParticipante:', error);
      throw error;
    }
  }
  async confirmPublic(eventoId: number, participanteId: number): Promise<void> {
  try {
    // Si tienes UNIQUE(evento_id, participante_id) esto será atómico
    await db.EventoParticipante.findOrCreate({
      where: { evento_id: eventoId, participante_id: participanteId },
      defaults: { evento_id: eventoId, participante_id: participanteId }
    });
  } catch (error) {
    console.error('Error en confirmPublic:', error);
    throw error;
  }
}

  async delete(eventoId: number, participanteId: number): Promise<void> {
    try {
      await db.EventoParticipante.destroy({
        where: { 
          evento_id: eventoId, 
          participante_id: participanteId 
        }
      });
    } catch (error) {
      console.error('Error en delete:', error);
      throw error;
    }
  }
}