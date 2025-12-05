export interface CompartirRecursoDto {
  evento_id: number;
  nombre: string;
  url: string;
  tipo_recurso: number; // ID del tipo de recurso
}

export interface CompartirRecursoResultDto {
  success: boolean;
  recurso?: {
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
  };
  message?: string;
}
