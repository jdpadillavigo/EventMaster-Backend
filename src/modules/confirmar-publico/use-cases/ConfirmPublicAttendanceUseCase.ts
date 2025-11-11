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
  if (!evento) throw new Error('Event not found');

  const now = new Date();
  const start = new Date(evento.fechaInicio);
  if (!(start.getTime() > now.getTime())) throw new Error('Event already started');

  // idempotente: si ya existe, retornamos success
  const already = await this.eventoParticipanteRepository.findByEventoAndUsuario(evento_id, usuario_id);
  if (already) return { success: true };

  // capacidad
  const current = await this.eventoParticipanteRepository.countByEvento(evento_id);
  const capacity = typeof evento.aforo === 'number' ? evento.aforo : 0;
  if (capacity > 0 && current >= capacity) throw new Error('Event is full');

  const rolAsistente = await this.rolRepository.findByNombre('Asistente');
  if (!rolAsistente) throw new Error('Rol Asistente not found');

  let participante = await this.participanteRepository.findByUsuarioAndRol(usuario_id, rolAsistente.rol_id);
  if (!participante) {
    participante = await this.participanteRepository.create({ usuario_id, rol_id: rolAsistente.rol_id });
  }

  // idempotente/tolerante a repetidos
  await this.eventoParticipanteRepository.create(evento_id, participante.participante_id);
  return { success: true };
  }
}