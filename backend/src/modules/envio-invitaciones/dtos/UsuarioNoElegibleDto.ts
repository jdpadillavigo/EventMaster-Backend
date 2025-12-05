import { TipoNoElegible } from "../../../domain/value-objects/TipoNoElegible";

export interface UsuarioNoElegibleDto {
  usuario_id: number;
  correo: string;
  nombre: string;
  apellido: string;
  tipo: TipoNoElegible;
}