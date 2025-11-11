export interface RegistrarUsuarioDto {
  correo: string;
  clave: string;
  nombre: string;
  apellido: string;
}

export interface RegistrarUsuarioResponseDto {
  success: boolean;
  message: string;
  data?: {
    usuario_id: number;
    correo: string;
    nombre: string;
    apellido: string;
    isActive: boolean;
  };
}
