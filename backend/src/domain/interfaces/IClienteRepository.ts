// Interfaz de repositorio para Cliente
// Usa modelos de Sequelize directamente (any)
export interface IClienteRepository {
  findByUsuarioId(usuario_id: number): Promise<any | null>;
  create(data: { nombre: string; apellido: string; usuario_id: number }): Promise<any>;
  update(usuario_id: number, data: { nombre?: string; apellido?: string }): Promise<any | null>;
}
