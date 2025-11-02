export interface SearchUsuariosDto {
  query: string;
  limit?: number;
}

export interface UsuarioSearchResultDto {
  usuario_id: number;
  correo: string;
  nombre?: string;
  apellido?: string;
}
