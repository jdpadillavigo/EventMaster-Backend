export interface SendInvitacionDto {
  evento_id: number;
  usuario_ids: number[];
  fechaLimite?: Date;
}

export interface SendInvitacionResultDto {
  success: boolean;
  notificacion_id?: number;
  resultados: {
    usuario_id: number;
    status: string;
    invitacion_usuario_id?: number;
  }[];
}
