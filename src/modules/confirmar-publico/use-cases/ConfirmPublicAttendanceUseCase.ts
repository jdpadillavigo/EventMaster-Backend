import { IEventoRepository } from '../../../domain/interfaces/IEventoRepository';
import { IEventoParticipanteRepository } from '../../../domain/interfaces/IEventoParticipanteRepository';
import { IRolRepository } from '../../../domain/interfaces/IRolRepository';
import { IParticipanteRepository } from '../../../domain/interfaces/IParticipanteRepository';

export class ConfirmPublicAttendanceUseCase {
  constructor(
    private eventoRepository: IEventoRepository,
    private eventoParticipanteRepository: IEventoParticipanteRepository,
    private rolRepository: IRolRepository,
    private participanteRepository: IParticipanteRepository
  ) {}

  async execute(input: { evento_id: number; usuario_id: number }): Promise<{ success: boolean }>{
    const { evento_id, usuario_id } = input;

    if (!evento_id || Number.isNaN(evento_id) || !usuario_id || Number.isNaN(usuario_id)) {
      throw new Error('Invalid input');
    }

    const evento = await this.eventoRepository.findById(evento_id);
    if (!evento) {
      throw new Error('Event not found');
    }

    // No permitir confirmar si el evento ya inició (fechaInicio)
    const now = new Date();
    const start = new Date(evento.fechaInicio);
    if (!(start.getTime() > now.getTime())) {
      throw new Error('Event already started');
    }

    // Evitar duplicados
    const already = await this.eventoParticipanteRepository.isUsuarioInEvento(evento_id, usuario_id);
    if (already) {
      throw new Error('Already confirmed');
    }

    // Verificar capacidad
    const current = await this.eventoParticipanteRepository.countByEvento(evento_id);
    const capacity = typeof evento.aforo === 'number' ? evento.aforo : 0;
    if (current >= capacity) {
      throw new Error('Event is full');
    }

    // Buscar el rol Asistente (según seeders)
    const rolAsistente = await this.rolRepository.findByNombre('Asistente');
    if (!rolAsistente) {
      throw new Error('Rol Asistente not found');
    }

    // Buscar el participante con rol ASISTENTE (crearlo on-demand si no existe)
    let participante = await this.participanteRepository.findByUsuarioAndRol(usuario_id, rolAsistente.rol_id);
    if (!participante) {
      participante = await this.participanteRepository.create({
        usuario_id,
        rol_id: rolAsistente.rol_id,
      });
    }

    // Crear relación evento-participante
    await this.eventoParticipanteRepository.create(evento_id, participante.participante_id);

    return { success: true };
  }
}
