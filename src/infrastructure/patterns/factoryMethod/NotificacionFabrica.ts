const db = require('../../database/models');

/**
 * Fábrica Abstracta - Patrón Factory Method
 * Define la interfaz para crear diferentes tipos de notificaciones
 */
export abstract class NotificacionFabrica {
  
  constructor() {}

  /**
   * Método Fábrica abstracto - debe ser implementado por las fábricas concretas
   * @param fechaHora - Fecha y hora de la notificación
   * @param eventoId - ID del evento asociado
   * @param fechaLimite - Fecha límite (opcional, solo para invitaciones)
   * @returns Promise con la notificación creada
   */
  public abstract MetodoFabrica(
    fechaHora: Date,
    eventoId: number,
    mensaje?: string | null
  ): Promise<any>;

  /**
   * Método estático para crear notificaciones según el tipo
   * Permite agregar nuevos tipos sin modificar código existente (Open/Closed)
   * @param fechaHora - Fecha y hora de la notificación
   * @param eventoId - ID del evento asociado
   * @param tipo - Tipo de notificación ("INVITACION", "ACCION", etc.)
   * @param fechaLimite - Fecha límite (opcional)
   * @returns Promise con la notificación creada o null si el tipo no existe
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
      const { InvitacionFabrica } = await import('./InvitacionFabrica');
      notificacion = await new InvitacionFabrica().MetodoFabrica(fechaHora, eventoId);
    }

    // Es una notificacion de acción
    else if (tipo === "ACCION") {
      const { AccionFabrica } = await import('./AccionFabrica');
      notificacion = await new AccionFabrica().MetodoFabrica(fechaHora, eventoId, mensaje || '');
    }

    return notificacion;
  }
}
