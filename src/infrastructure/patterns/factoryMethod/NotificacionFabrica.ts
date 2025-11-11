import { DependencyContainer } from 'shared/utils/DependencyContainer';
import { INotificacionRepository } from 'domain/interfaces/INotificacionRepository';

/**
 * Fábrica Abstracta - Patrón Factory Method
 * Define la interfaz para crear diferentes tipos de notificaciones
 */
export abstract class NotificacionFabrica {
  constructor(
    protected notificacionRepository: INotificacionRepository
  ) {}

  /**
   * Método para crear una notificación base
   */
  protected async crearNotificacionBase(
    fechaHora: Date,
    eventoId: number
  ): Promise<any> {
    try {
      const nuevaNotificacion = await this.notificacionRepository.create({
        fechaHora: fechaHora,
        evento_id: eventoId
      });
      return nuevaNotificacion;
    } catch (error) {
      console.error('Error en create:', error);
      throw error;
    }
  }

  /**
   * Método Fábrica abstracto - debe ser implementado por las fábricas concretas
   */
  public abstract MetodoFabrica(
    fechaHora: Date,
    eventoId: number,
    mensaje?: string | null
  ): Promise<any>;

  /**
   * Método estático para crear notificaciones según el tipo
   */
  public static async crearNotificacion(
    fechaHora: Date,
    eventoId: number,
    tipo: string,
    mensaje?: string 
  ): Promise<any | null> {
    let notificacion: any | null = null;

    // Es una invitacion
    if (tipo === "INVITACION") {
      const InvitacionFabrica = DependencyContainer.getInvitacionFabrica();
      notificacion = InvitacionFabrica.MetodoFabrica(fechaHora, eventoId);
    }

    // Es una notificacion de acción
    else if (tipo === "ACCION") {
      const AccionFabrica = DependencyContainer.getAccionFabrica();
      notificacion = AccionFabrica.MetodoFabrica(fechaHora, eventoId, mensaje ?? '');
    }

    return notificacion;
  }
}