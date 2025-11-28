// DTO para obtener participantes de un evento
export interface GetParticipantesDto {
  evento_id: number;
}

// DTO de respuesta con información del participante
export interface ParticipanteResultDto {
  participante_id: number;
  usuario_id: number;
  correo: string;
  nombre: string;
  apellido: string;
  rol: string;
}
