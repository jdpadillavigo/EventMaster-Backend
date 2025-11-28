// Interfaz de repositorio para Invitacion
// Usa modelos de Sequelize directamente (any)
export interface IInvitacionRepository {
  findById(id: number): Promise<any | null>;
  create(data: any): Promise<any>;
}
