// DTO para responder a una invitación
export interface RespondInvitacionDto {
  invitacion_usuario_id: number;
  accept: boolean;
}

// DTO de respuesta
export interface RespondInvitacionResultDto {
  success: boolean;
  message: string;
}
