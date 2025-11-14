export interface SearchUsuariosDto {
  query: string;
}

export interface UsuarioSearchResultDto {
  usuario_id: number;
  correo: string;
  nombre?: string;
  apellido?: string;
}
