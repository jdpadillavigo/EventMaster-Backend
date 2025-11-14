// Interfaz de repositorio para Recurso
// Usa modelos de Sequelize directamente (any)
export interface IRecursoRepository {
  findById(id: number): Promise<any | null>;
  create(data: any): Promise<any>;
  update(id: number, data: any): Promise<any | null>;
  delete(id: number): Promise<boolean>;
  findAll(): Promise<any[]>;
  findByNombre(nombre: string): Promise<any | null>;
  findByEventoId(eventoId: number): Promise<any[]>;
  findByTipoRecurso(tipoRecursoId: number): Promise<any[]>;
  findByEventoAndTipo(eventoId: number, tipoRecursoId: number): Promise<any[]>;
  searchByNombre(query: string, limit?: number): Promise<any[]>;
  countByEvento(eventoId: number): Promise<number>;
  findRecursosWithDetailsForEvento(eventoId: number): Promise<any[]>;
}
