// Interfaz de repositorio para InvitacionUsuario
// Usa modelos de Sequelize directamente (any)
export interface IInvitacionUsuarioRepository {
  create(data: any): Promise<any>;
  findByEventoAndUsuario(eventoId: number, usuarioId: number): Promise<any | null>;
  countPendientesByEvento(eventoId: number, estadoPendienteId: number): Promise<number>;
  findNoElegiblesByEvento(eventoId: number, estadoPendienteId: number): Promise<any[]>;
  findByIdWithEventoAndUsuario(invitacionUsuarioId: number): Promise<any | null>;
  update(invitacionUsuarioId: number, data: any): Promise<any | null>;
  findAllByUsuarioIdWithDetalles(usuarioId: number): Promise<any[]>;
}
