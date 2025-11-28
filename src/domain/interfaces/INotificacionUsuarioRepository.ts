export interface INotificacionUsuarioRepository {
    create(data: any): Promise<any | null>;
    findAllByUsuarioIdWithDetalles(usuarioId: number): Promise<any[]>;
}

