// Interfaz de repositorio para EstadoInvitacion
// Usa modelos de Sequelize directamente (any)
export interface IEstadoInvitacionRepository {
  findByNombre(nombre: string): Promise<any | null>;
}
