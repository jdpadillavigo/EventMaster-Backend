export interface GetInvitacionesPrivadasParamsDto {
  usuario_id: number;
}

export interface InvitacionPrivadaItemDto {
  invitacion_usuario_id: number;
  estado: string | null;
  fechaLimite: string | null;
  evento: {
    evento_id: number;
    titulo: string | null;
    fechaInicio: string | null;
    fechaFin: string | null;
  } | null;
}

export interface GetInvitacionesPrivadasResultDto {
  success: boolean;
  invitaciones: InvitacionPrivadaItemDto[];
}
