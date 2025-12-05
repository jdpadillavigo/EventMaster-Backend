// Interfaz de repositorio para Rol
// Usa modelos de Sequelize directamente (any)
export interface IRolRepository {
  findByNombre(nombre: string): Promise<any | null>;
}
