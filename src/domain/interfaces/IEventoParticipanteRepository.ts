// Interfaz de repositorio para EventoParticipante
// Usa modelos de Sequelize directamente (any)
export interface IEventoParticipanteRepository {
  findByEventoAndUsuario(eventoId: number, usuarioId: number): Promise<any | null>;
  findParticipantesByEventoAndRol(eventoId: number): Promise<any[]>;
  findParticipantesByEvento(eventoId: number): Promise<any[]>;
  countByEvento(eventoId: number, rolId?: number[]): Promise<number>;
  countByParticipante(participanteId: number): Promise<number>;
  findByEventoAndParticipante(eventoId: number, participanteId: number): Promise<any | null>;
  create(eventoId: number, participanteId: number): Promise<any>;
  findByParticipante(participanteId: number): Promise<any[]>
  findAllWithFilters(eventoId: number, rolIds?: number[], usuarioExcluidoId?: number): Promise<any[]>;
  deleteByEvento(eventoId: number): Promise<void>;
  deleteByEventoAndParticipante(eventoId: number, participanteId: number): Promise<void>;
  countByUsuarioEventoActivo(usuarioId: number): Promise<number>;
}
