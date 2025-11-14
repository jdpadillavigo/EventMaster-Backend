export interface IEstadoEventoRepository {
  findByNombre(nombre: string): Promise<any | null>;
}
