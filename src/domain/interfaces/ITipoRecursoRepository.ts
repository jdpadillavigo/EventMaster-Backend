// Interfaz de repositorio para TipoRecurso
export interface ITipoRecursoRepository {
  findById(id: number): Promise<any | null>;
  findAll(): Promise<any[]>;
  findByNombre(nombre: string): Promise<any | null>;
  create(data: any): Promise<any>;
  update(id: number, data: any): Promise<any | null>;
  delete(id: number): Promise<boolean>;
}
