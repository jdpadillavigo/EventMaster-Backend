// Interfaz de repositorio para InvitacionUsuario
// Usa modelos de Sequelize directamente (any)
export interface IInvitacionUsuarioRepository {
  create(data: any): Promise<any>;
  findPendienteByEventoAndUsuario(eventoId: number, estadoPendienteId: number, usuarioId: number): Promise<any | null> ;
  countPendientesByEvento(eventoId: number, estadoPendienteId: number): Promise<number>;
  findPendientesByEvento(eventoId: number, estadoPendienteId: number): Promise<any[]>;
  findByIdWithEventoAndUsuario(invitacionUsuarioId: number): Promise<any | null>
  update(invitacionUsuarioId: number, data: any): Promise<any | null>;
  findAllByUsuarioIdWithDetalles(usuarioId: number): Promise<any[]>;
}
