import { IEventoParticipanteRepository } from '../../domain/interfaces/IEventoParticipanteRepository';

const db = require('../database/models');

export class EventoParticipanteRepository implements IEventoParticipanteRepository {
  
  async isUsuarioInEvento(eventoId: number, usuarioId: number): Promise<boolean> {
    try {
      const participante = await db.EventoParticipante.findOne({
        include: [{
          model: db.Participante,
          as: "participante",
          required: true,
          where: { usuario_id: usuarioId }
        }],
        where: { evento_id: eventoId }
      });
      
      return participante !== null;
    } catch (error) {
      console.error('Error en isUsuarioInEvento:', error);
      throw error;
    }
  }

  async findParticipantesByEvento(eventoId: number): Promise<any[]> {
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
}
