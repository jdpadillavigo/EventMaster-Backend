export type EliminarAsistenteDto = {
    evento_id: number;
    usuario_id: number; // usuario objetivo a eliminar
    emisor_id: number; // quien realiza la acción (extraído del JWT)
}