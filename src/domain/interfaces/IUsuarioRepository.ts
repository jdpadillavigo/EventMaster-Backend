// Interfaz de repositorio para Usuario
// Usa modelos de Sequelize directamente (any)
export interface IUsuarioRepository {
  findById(id: number): Promise<any | null>;
  findByEmail(email: string): Promise<any | null>;
  findByActivationToken(token: string): Promise<any | null>;
  searchActiveByQuery(query: string, limit?: number): Promise<any[]>;
  create(data: { correo: string; clave: string; isActive?: boolean; activation_token?: string; token_expires_at?: Date }): Promise<any>;
  update(id: number, data: any): Promise<any | null>;
  delete(id: number): Promise<boolean>;
}
