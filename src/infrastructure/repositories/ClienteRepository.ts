import { IClienteRepository } from '../../domain/interfaces/IClienteRepository';

const db = require('../database/models');

export class ClienteRepository implements IClienteRepository {
  
  async findByUsuarioId(usuario_id: number): Promise<any | null> {
    try {
      const cliente = await db.Cliente.findOne({
        where: { usuario_id }
      });
      
      return cliente;
    } catch (error) {
      console.error('Error en findByUsuarioId:', error);
      throw error;
    }
  }

  async create(data: { nombre: string; apellido: string; usuario_id: number }): Promise<any> {
    try {
      const nuevoCliente = await db.Cliente.create({
        nombre: data.nombre,
        apellido: data.apellido,
        usuario_id: data.usuario_id
      });
      
      return nuevoCliente;
    } catch (error) {
      console.error('Error en create:', error);
      throw error;
    }
  }

  async update(usuario_id: number, data: { nombre?: string; apellido?: string }): Promise<any | null> {
    try {
      const cliente = await db.Cliente.findOne({ where: { usuario_id } });
      if (!cliente) return null;
      
      await cliente.update(data);
      
      return cliente;
    } catch (error) {
      console.error('Error en update:', error);
      throw error;
    }
  }
}
