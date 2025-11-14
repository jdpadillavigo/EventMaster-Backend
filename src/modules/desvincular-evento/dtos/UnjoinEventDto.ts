export interface UnjoinEventDto {
  evento_id: number;
  usuario_id: number;
}

export interface UnjoinEventResultDto {
  success: boolean;
  message?: string;
}
