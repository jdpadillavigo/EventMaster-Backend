// Interfaz de repositorio para EventoParticipante
// Usa modelos de Sequelize directamente (any)
export interface IEventoParticipanteRepository {
  isUsuarioInEvento(eventoId: number, usuarioId: number): Promise<boolean>;
  findParticipantesByEvento(eventoId: number): Promise<any[]>;
  countByEvento(eventoId: number): Promise<number>;
  countByParticipante(participanteId: number): Promise<number>;
  findByEventoAndParticipante(eventoId: number, participanteId: number): Promise<any | null>;
  create(eventoId: number, participanteId: number): Promise<any>;
}
