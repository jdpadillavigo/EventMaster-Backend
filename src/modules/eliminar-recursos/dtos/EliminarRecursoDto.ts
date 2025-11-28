export interface EliminarRecursoDto {
  evento_id: number;
  recurso_id: number;
}

export interface EliminarRecursoResultDto {
  success: boolean;
  message?: string;
  recurso_eliminado?: {
    recurso_id: number;
    nombre: string;
    tipo: string;
  };
}
