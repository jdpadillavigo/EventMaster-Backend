export interface ActivarCuentaDto {
  token: string;
}

export interface ActivarCuentaResponseDto {
  success: boolean;
  message: string;
  expired?: boolean;
  data?: {
    usuario_id: number;
    correo: string;
    nombre: string;
    apellido: string;
    isActive: boolean;
  };
}
