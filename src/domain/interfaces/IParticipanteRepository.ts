// Interfaz de repositorio para Participante
// Usa modelos de Sequelize directamente (any)
export interface IParticipanteRepository {
  findByUsuarioAndRol(usuarioId: number, rolId: number): Promise<any | null>;
  create(data: { usuario_id: number; rol_id: number }): Promise<any>;
  findAllByUsuarioId(usuarioId: number): Promise<any[]>;
}
