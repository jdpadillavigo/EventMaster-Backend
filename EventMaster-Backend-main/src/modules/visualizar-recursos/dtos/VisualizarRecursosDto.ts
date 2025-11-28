export interface GetRecursosByEventoDto {
  evento_id: number;
  tipo_recurso?: number; // ID del tipo de recurso
}

export interface RecursoDetailDto {
  recurso_id: number;
  nombre: string;
  url: string;
  tipo: {
    tipo_recurso_id: number;
    nombre: string;
  };
  evento: {
    evento_id: number;
    nombre: string;
  };
}

export interface GetRecursosResultDto {
  success: boolean;
  recursos: RecursoDetailDto[];
  total: number;
}
