export interface GetNotificacionesAccionParamsDto {
  usuario_id: number;
}

export interface NotificacionAccionItemDto {
  notificacion_accion_id: number;
  fechaHora: string | null;
  mensaje: string | null;
  evento: {
    evento_id: number;
    titulo: string | null
  } | null;
}

export interface GetNotificacionesAccionResultDto {
  success: boolean;
  notificaciones_accion: NotificacionAccionItemDto[];
}
