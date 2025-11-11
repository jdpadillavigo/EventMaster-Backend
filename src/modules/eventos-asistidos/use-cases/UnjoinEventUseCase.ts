import { IEventoParticipanteRepository } from '../../../domain/interfaces/IEventoParticipanteRepository';
import { IRolRepository } from '../../../domain/interfaces/IRolRepository';
import { IParticipanteRepository } from '../../../domain/interfaces/IParticipanteRepository';

export class UnjoinEventUseCase {
  constructor(
    private epRepo: IEventoParticipanteRepository,
    private rolRepo: IRolRepository,
    private partRepo: IParticipanteRepository
  ) {}

  async execute(eventoId: number, usuarioId: number) {
    // 1) Verificar si ES organizador DE ESTE evento
    const rolOrg = await this.rolRepo.findByNombre('Organizador');
    if (rolOrg) {
      const org = await this.partRepo.findByUsuarioAndRol(usuarioId, rolOrg.rol_id);
      if (org) {
        // usamos llamadas "flexibles" para no romper typings del repo
        const repoAny = this.epRepo as any;

        let esOrganizadorDeEsteEvento = false;

        if (repoAny.existsByEventAndParticipante) {
          esOrganizadorDeEsteEvento = await repoAny.existsByEventAndParticipante(eventoId, org.participante_id);
        } else if (repoAny.isLinked) {
          esOrganizadorDeEsteEvento = await repoAny.isLinked(eventoId, org.participante_id);
        } else if (repoAny.findByEventAndParticipante) {
          esOrganizadorDeEsteEvento = !!(await repoAny.findByEventAndParticipante(eventoId, org.participante_id));
        } else if (repoAny.find) {
          esOrganizadorDeEsteEvento = !!(await repoAny.find(eventoId, org.participante_id));
        } else if (repoAny.get) {
          esOrganizadorDeEsteEvento = !!(await repoAny.get(eventoId, org.participante_id));
        }

        if (esOrganizadorDeEsteEvento) {
          throw new Error('Organizador no puede desvincularse de su propio evento');
        }
      }
    }

    // 2) Desvincular si es Asistente en este evento
    const rolAsis = await this.rolRepo.findByNombre('Asistente');
    if (!rolAsis) return { success: true }; // sin rol Asistente definido, no hay nada que hacer

    const part = await this.partRepo.findByUsuarioAndRol(usuarioId, rolAsis.rol_id);
    if (!part) return { success: true }; // el usuario no tiene participante "Asistente"

    // (opcional) si tu repo tiene chequeo de vínculo, úsalo para no llamar detach en vacío:
    const repoAny = this.epRepo as any;
    if (repoAny.existsByEventAndParticipante) {
      const vinculado = await repoAny.existsByEventAndParticipante(eventoId, part.participante_id);
      if (!vinculado) return { success: true };
    } else if (repoAny.isLinked) {
      const vinculado = await repoAny.isLinked(eventoId, part.participante_id);
      if (!vinculado) return { success: true };
    }

    await this.epRepo.detach(eventoId, part.participante_id);
    return { success: true };
  }
}
