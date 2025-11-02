import { IParticipanteRepository } from '../../domain/interfaces/IParticipanteRepository';

const db = require('../database/models');

export class ParticipanteRepository implements IParticipanteRepository {
  
  async findByUsuarioAndRol(usuarioId: number, rolId: number): Promise<any | null> {
    try {
      const participante = await db.Participante.findOne({
        where: { usuario_id: usuarioId, rol_id: rolId }
      });
      
      return participante;
    } catch (error) {
      console.error('Error en findByUsuarioAndRol:', error);
      throw error;
    }
  }

  async create(data: { usuario_id: number; rol_id: number }): Promise<any> {
    try {
      const nuevoParticipante = await db.Participante.create(data);
      return nuevoParticipante;
    } catch (error) {
      console.error('Error en create:', error);
      throw error;
    }
  }

  async findAllByUsuarioId(usuarioId: number): Promise<any[]> {
    try {
      const participantes = await db.Participante.findAll({
        where: { usuario_id: usuarioId }
      });
      
      return participantes;
    } catch (error) {
      console.error('Error en findAllByUsuarioId:', error);
      throw error;
    }
  }
}
