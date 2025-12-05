import { IEventoRepository } from '../../../domain/interfaces/IEventoRepository';
import { IUbicacionRepository } from '../../../domain/interfaces/IUbicacionRepository';
import { NotificationManager } from '../../../infrastructure/patterns/observer/NotificationManager';
import { TipoNotificacion } from '../../../domain/value-objects/TipoNotificacion';
import { EditarEventoRequestDto } from '../dtos/EditarEventoRequestDto';

export class EditarEventoUseCase {
    constructor(
        private eventoRepository: IEventoRepository,
        private ubicacionRepository: IUbicacionRepository,
        private notificationManager: NotificationManager
    ) { }

    async execute(id: number, eventData: EditarEventoRequestDto, emisorId: number): Promise<{
        success: boolean;
        message: string;
        evento?: any;

    }> {
        try {
            // ============================================
            // 1. Verificar si el evento existe
            // ============================================
            const eventoExistente = await this.eventoRepository.findById(id);
            if (!eventoExistente) {
                return {
                    success: false,
                    message: 'Evento no encontrado'
                };
            }

            // ============================================
            // 2. Validación de nombre único (si cambia)
            // ============================================
            if (
                eventData.name &&
                eventData.name.trim().toLowerCase() !== eventoExistente.titulo.toLowerCase()
            ) {
                const existeNombre = await this.eventoRepository.findByTituloLowerCase(
                    eventData.name
                );
                if (existeNombre) {
                    throw new Error('Event name must be unique');
                }
            }

            // ============================================
            // 3. Capacidad válida
            // ============================================
            if (eventData.capacity < 1 || eventData.capacity > 100) {
                throw new Error('Capacity must be between 1 and 100');
            }

            // ============================================
            // 4. Validar fecha válida y fecha futura
            // ============================================
            const fechaInicio = new Date(eventData.date);
            const fechaFin = new Date(eventData.endDate);

            if (!(fechaInicio instanceof Date) || Number.isNaN(fechaInicio.getTime())) {
                throw new Error('Invalid start date');
            }
            if (!(fechaFin instanceof Date) || Number.isNaN(fechaFin.getTime())) {
                throw new Error('Invalid end date');
            }

            const hoy = new Date();
            // Evita poner fechas pasadas
            if (fechaInicio < hoy) {
                throw new Error('Event date must be today or in the future');
            }

            if (fechaFin < fechaInicio) {
                throw new Error('End date must be after start date');
            }

            // ============================================
            // 5. Validar ubicación Lima (si se manda)
            // ============================================
            const isLimaByText = /lima/i.test(String(eventData.locationAddress || ''));

            const isLimaByCoords =
                typeof eventData.lat === 'number' &&
                typeof eventData.lng === 'number' &&
                eventData.lat >= -12.5 &&
                eventData.lat <= -11.7 &&
                eventData.lng >= -77.3 &&
                eventData.lng <= -76.6;

            if (!isLimaByText && !isLimaByCoords) {
                throw new Error('Location must be within Lima');
            }

            // Prohibir coordenadas (0,0)
            if (eventData.lat === 0 && eventData.lng === 0) {
                throw new Error('Invalid coordinates');
            }

            // ============================================
            // 6. Validar imagen solo si se está enviando explícitamente
            // ============================================
            if (eventData.imageUrl !== undefined) {
                if (String(eventData.imageUrl).trim().length === 0) {
                    throw new Error('Image cannot be empty');
                }
            }

            // Datos para actualizar la ubicación (sólo si vienen válidos)
            const locationPatch: any = {};
            if (eventData.locationAddress && eventData.locationAddress.trim() !== '') {
                locationPatch.direccion = eventData.locationAddress;
            }
            const hasValidCoords =
                Number.isFinite(eventData.lat) &&
                Number.isFinite(eventData.lng) &&
                !(eventData.lat === 0 && eventData.lng === 0);

            if (hasValidCoords) {
                locationPatch.latitud = eventData.lat;
                locationPatch.longitud = eventData.lng;
            }

            // Buscar ubicación existente para este evento
            const ubicacionExistente = await this.ubicacionRepository.findByEventoId(id);
            let ubicacionId: number | undefined;

            if (ubicacionExistente) {
                // Si existe y hay cambios, actualizarla
                if (Object.keys(locationPatch).length > 0) {
                    await this.ubicacionRepository.update(
                        id,
                        locationPatch
                    );
                }
                ubicacionId = ubicacionExistente.ubicacion_id || ubicacionExistente.id;
            } else {
                // Si no existe, crearla solo si tenemos coordenadas válidas
                if (Object.keys(locationPatch).length > 0 && hasValidCoords) {
                    const nuevaUbicacion = await this.ubicacionRepository.create({
                        ...locationPatch,
                        evento_id: id
                    });
                    ubicacionId = nuevaUbicacion.ubicacion_id || nuevaUbicacion.id;
                } else {
                    ubicacionId = undefined;
                }
            }

            // Mapear privacidad a ID numérico
            const privacidadId = eventData.privacy === 'private' ? 2 : 1;

            // Actualizar el evento
            const eventoActualizado = await this.eventoRepository.update(
                id,
                {
                    titulo: eventData.name,
                    descripcion: eventData.description || '',
                    fechaInicio: new Date(eventData.date),
                    fechaFin: new Date(eventData.endDate),
                    aforo: eventData.capacity,
                    privacidad: privacidadId,
                    imagen: eventData.imageUrl,
                    ubicacionId: ubicacionId
                }
            );

            // Obtener la ubicación actualizada
            const ubicacionActualizada = await this.ubicacionRepository.findByEventoId(id);

            // Notificar a los participantes que el evento fue editado
            await this.notificationManager.notify(
                TipoNotificacion.EVENTO_EDITADO,
                { eventoId: id, emisorId }
            );

            return {
                success: true,
                message: 'Evento actualizado correctamente',
                evento: {
                    ...eventoActualizado,
                    ubicacion: ubicacionActualizada
                }
            };
        } catch (error: unknown) {
            console.error('Error en UpdateEventoUseCase:', error);

            let errorMessage = 'Error al actualizar el evento';
            if (error instanceof Error) {
                errorMessage = error.message;
            } else if (error && typeof error === 'object' && 'message' in error) {
                errorMessage = String(error.message);
            }

            return {
                success: false,
                message: errorMessage
            };
        }
    }
}