export interface INotificacionAccionRepository {
    findById(id: number): Promise<any | null>;
    create(data: any): Promise<any | null>;
}