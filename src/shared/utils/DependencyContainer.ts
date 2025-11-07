// Dependency Injection Container
import { UsuarioRepository } from '../../infrastructure/repositories/UsuarioRepository';
import { ClienteRepository } from '../../infrastructure/repositories/ClienteRepository';
import { EventoRepository } from '../../infrastructure/repositories/EventoRepository';
import { EventoParticipanteRepository } from '../../infrastructure/repositories/EventoParticipanteRepository';
import { InvitacionRepository } from '../../infrastructure/repositories/InvitacionRepository';
import { InvitacionUsuarioRepository } from '../../infrastructure/repositories/InvitacionUsuarioRepository';
import { EstadoInvitacionRepository } from '../../infrastructure/repositories/EstadoInvitacionRepository';
import { ParticipanteRepository } from '../../infrastructure/repositories/ParticipanteRepository';
import { RolRepository } from '../../infrastructure/repositories/RolRepository';
import { UbicacionRepository } from '../../infrastructure/repositories/UbicacionRepository';
import { EmailService } from '../../infrastructure/services/EmailService';

import { SearchUsuariosUseCase } from '../../modules/envio-invitaciones/use-cases/SearchUsuariosUseCase';
import { SendInvitacionUseCase } from '../../modules/envio-invitaciones/use-cases/SendInvitacionUseCase';
import { GetNoElegiblesUseCase } from '../../modules/envio-invitaciones/use-cases/GetNoElegiblesUseCase';
import { CountInvitacionesPendientesUseCase } from '../../modules/envio-invitaciones/use-cases/CountInvitacionesPendientesUseCase';
import { GetParticipantesByEventoUseCase } from '../../modules/ver-participantes/use-cases/GetParticipantesByEventoUseCase';
import { RespondInvitacionUseCase } from '../../modules/confirmar-invitacion/use-cases/RespondInvitacionUseCase';
import { GetInvitacionesPrivadasUseCase } from '../../modules/ver-invitaciones-privadas/use-cases/GetInvitacionesPrivadasUseCase';
import { GetEventoDetalleUseCase } from '../../modules/ver-detalle/use-cases/GetEventoDetalleUseCase';
import { ConfirmPublicAttendanceUseCase } from '../../modules/confirmar-publico/use-cases/ConfirmPublicAttendanceUseCase';
import { RegistrarUsuarioUseCase } from '../../modules/registrarse/use-cases/RegistrarUsuarioUseCase';
import { ActivarCuentaUseCase } from '../../modules/activar-cuenta/use-cases/ActivarCuentaUseCase';
import { LoginUseCase } from '../../modules/iniciar-sesion/use-cases/LoginUseCase';
import { CreateEventoUseCase } from '../../modules/eventos-crear/use-cases/CreateEventoUseCase';
import { ListPublicEventsUseCase } from '../../modules/eventos-publicos/use-cases/ListPublicEventsUseCase';
import { ListManagedEventsUseCase } from '../../modules/eventos-gestionados/use-cases/ListManagedEventsUseCase';
import { ListAttendedEventsUseCase } from '../../modules/eventos-asistidos/use-cases/ListAttendedEventsUseCase';

import { VerifyOrganizerGlobal } from '../middlewares/verifyOrganizerGlobal';
import { VerifyOrganizerInEvent } from '../middlewares/verifyOrganizerInEvent';
import { Request, Response, NextFunction } from 'express';

export class DependencyContainer {
  // Repositorios (Singleton)
  private static usuarioRepository: UsuarioRepository;
  private static clienteRepository: ClienteRepository;
  private static eventoRepository: EventoRepository;
  private static eventoParticipanteRepository: EventoParticipanteRepository;
  private static invitacionRepository: InvitacionRepository;
  private static invitacionUsuarioRepository: InvitacionUsuarioRepository;
  private static estadoInvitacionRepository: EstadoInvitacionRepository;
  private static participanteRepository: ParticipanteRepository;
  private static rolRepository: RolRepository;
  private static ubicacionRepository: UbicacionRepository;

  // Servicios (Singleton)
  private static emailService: EmailService;

  // Use Cases - Invitaciones
  private static searchUsuariosUseCase: SearchUsuariosUseCase;
  private static sendInvitacionUseCase: SendInvitacionUseCase;
  private static getNoElegiblesUseCase: GetNoElegiblesUseCase;
  private static countInvitacionesPendientesUseCase: CountInvitacionesPendientesUseCase;
  private static getEventoDetalleUseCase: GetEventoDetalleUseCase;
  private static confirmPublicAttendanceUseCase: ConfirmPublicAttendanceUseCase;

  // Use Cases - Ver Invitados
  private static getParticipantesByEventoUseCase: GetParticipantesByEventoUseCase;

  // Use Cases - Confirmar Invitación
  private static respondInvitacionUseCase: RespondInvitacionUseCase;

  // Use Cases - Ver Invitaciones Privadas
  private static getInvitacionesPrivadasUseCase: GetInvitacionesPrivadasUseCase;

  // Use Cases - Registrarse
  private static registrarUsuarioUseCase: RegistrarUsuarioUseCase;

  // Use Cases - Activar Cuenta
  private static activarCuentaUseCase: ActivarCuentaUseCase;

  // Use Cases - Auth
  private static loginUseCase: LoginUseCase;

  // Use Cases - Eventos (particionados)
  private static createEventoUseCase: CreateEventoUseCase;
  private static listPublicEventsUseCase: ListPublicEventsUseCase;
  private static listManagedEventsUseCase: ListManagedEventsUseCase;
  private static listAttendedEventsUseCase: ListAttendedEventsUseCase;
  
  // Middleware
  private static verifyOrganizerGlobal: (req: Request, res: Response, next: NextFunction) => Promise<Response | void>;
  private static verifyOrganizerInEvent: (req: Request, res: Response, next: NextFunction) => Promise<Response | void>;
  

  // Getters para Repositorios
  static getUsuarioRepository(): UsuarioRepository {
    if (!this.usuarioRepository) {
      this.usuarioRepository = new UsuarioRepository();
    }
    return this.usuarioRepository;
  }

  static getClienteRepository(): ClienteRepository {
    if (!this.clienteRepository) {
      this.clienteRepository = new ClienteRepository();
    }
    return this.clienteRepository;
  }

  static getEventoRepository(): EventoRepository {
    if (!this.eventoRepository) {
      this.eventoRepository = new EventoRepository();
    }
    return this.eventoRepository;
  }

  static getEventoParticipanteRepository(): EventoParticipanteRepository {
    if (!this.eventoParticipanteRepository) {
      this.eventoParticipanteRepository = new EventoParticipanteRepository();
    }
    return this.eventoParticipanteRepository;
  }

  static getInvitacionRepository(): InvitacionRepository {
    if (!this.invitacionRepository) {
      this.invitacionRepository = new InvitacionRepository();
    }
    return this.invitacionRepository;
  }

  static getInvitacionUsuarioRepository(): InvitacionUsuarioRepository {
    if (!this.invitacionUsuarioRepository) {
      this.invitacionUsuarioRepository = new InvitacionUsuarioRepository();
    }
    return this.invitacionUsuarioRepository;
  }

  static getEstadoInvitacionRepository(): EstadoInvitacionRepository {
    if (!this.estadoInvitacionRepository) {
      this.estadoInvitacionRepository = new EstadoInvitacionRepository();
    }
    return this.estadoInvitacionRepository;
  }

  static getParticipanteRepository(): ParticipanteRepository {
    if (!this.participanteRepository) {
      this.participanteRepository = new ParticipanteRepository();
    }
    return this.participanteRepository;
  }

  static getRolRepository(): RolRepository {
    if (!this.rolRepository) {
      this.rolRepository = new RolRepository();
    }
    return this.rolRepository;
  }

  static getUbicacionRepository(): UbicacionRepository {
    if (!this.ubicacionRepository) {
      this.ubicacionRepository = new UbicacionRepository();
    }
    return this.ubicacionRepository;
  }

  // Getters para Servicios
  static getEmailService(): EmailService {
    if (!this.emailService) {
      this.emailService = new EmailService();
    }
    return this.emailService;
  }

  // Getters para Use Cases
  static getSearchUsuariosUseCase(): SearchUsuariosUseCase {
    if (!this.searchUsuariosUseCase) {
      this.searchUsuariosUseCase = new SearchUsuariosUseCase(
        this.getUsuarioRepository()
      );
    }
    return this.searchUsuariosUseCase;
  }

  static getSendInvitacionUseCase(): SendInvitacionUseCase {
    if (!this.sendInvitacionUseCase) {
      this.sendInvitacionUseCase = new SendInvitacionUseCase(
        this.getUsuarioRepository(),
        this.getEventoRepository(),
        this.getEventoParticipanteRepository(),
        this.getInvitacionUsuarioRepository(),
        this.getEstadoInvitacionRepository()
      );
    }
    return this.sendInvitacionUseCase;
  }

  static getGetNoElegiblesUseCase(): GetNoElegiblesUseCase {
    if (!this.getNoElegiblesUseCase) {
      this.getNoElegiblesUseCase = new GetNoElegiblesUseCase(
        this.getInvitacionUsuarioRepository(),
        this.getEstadoInvitacionRepository(),
        this.getEventoParticipanteRepository()
      );
    }
    return this.getNoElegiblesUseCase;
  }

  static getCountInvitacionesPendientesUseCase(): CountInvitacionesPendientesUseCase {
    if (!this.countInvitacionesPendientesUseCase) {
      this.countInvitacionesPendientesUseCase = new CountInvitacionesPendientesUseCase(
        this.getInvitacionUsuarioRepository(),
        this.getEstadoInvitacionRepository()
      );
    }
    return this.countInvitacionesPendientesUseCase;
  }

  static getGetParticipantesByEventoUseCase(): GetParticipantesByEventoUseCase {
    if (!this.getParticipantesByEventoUseCase) {
      this.getParticipantesByEventoUseCase = new GetParticipantesByEventoUseCase(
        this.getEventoParticipanteRepository()
      );
    }
    return this.getParticipantesByEventoUseCase;
  }

  static getRespondInvitacionUseCase(): RespondInvitacionUseCase {
    if (!this.respondInvitacionUseCase) {
      this.respondInvitacionUseCase = new RespondInvitacionUseCase(
        this.getInvitacionUsuarioRepository(),
        this.getEstadoInvitacionRepository(),
        this.getParticipanteRepository(),
        this.getRolRepository(),
        this.getEventoParticipanteRepository(),
        this.getEventoRepository()
      );
    }
    return this.respondInvitacionUseCase;
  }

  static getGetInvitacionesPrivadasUseCase(): GetInvitacionesPrivadasUseCase {
    if (!this.getInvitacionesPrivadasUseCase) {
      this.getInvitacionesPrivadasUseCase = new GetInvitacionesPrivadasUseCase(
        this.getInvitacionUsuarioRepository()
      );
    }
    return this.getInvitacionesPrivadasUseCase;
  }

  static getGetEventoDetalleUseCase(): GetEventoDetalleUseCase {
    if (!this.getEventoDetalleUseCase) {
      this.getEventoDetalleUseCase = new GetEventoDetalleUseCase(
        this.getEventoRepository()
      );
    }
    return this.getEventoDetalleUseCase;
  }

  static getConfirmPublicAttendanceUseCase(): ConfirmPublicAttendanceUseCase {
    if (!this.confirmPublicAttendanceUseCase) {
      this.confirmPublicAttendanceUseCase = new ConfirmPublicAttendanceUseCase(
        this.getEventoRepository(),
        this.getEventoParticipanteRepository(),
        this.getRolRepository(),
        this.getParticipanteRepository()
      );
    }
    return this.confirmPublicAttendanceUseCase;
  }

  static getRegistrarUsuarioUseCase(): RegistrarUsuarioUseCase {
    if (!this.registrarUsuarioUseCase) {
      this.registrarUsuarioUseCase = new RegistrarUsuarioUseCase(
        this.getUsuarioRepository(),
        this.getClienteRepository(),
        this.getEmailService()
      );
    }
    return this.registrarUsuarioUseCase;
  }

  static getActivarCuentaUseCase(): ActivarCuentaUseCase {
    if (!this.activarCuentaUseCase) {
      this.activarCuentaUseCase = new ActivarCuentaUseCase(
        this.getUsuarioRepository(),
        this.getEmailService()
      );
    }
    return this.activarCuentaUseCase;
  }

  static getLoginUseCase(): LoginUseCase {
    if (!this.loginUseCase) {
      this.loginUseCase = new LoginUseCase(
        this.getUsuarioRepository()
      );
    }
    return this.loginUseCase;
  }

  static getCreateEventoUseCase(): CreateEventoUseCase {
    if (!this.createEventoUseCase) {
      this.createEventoUseCase = new CreateEventoUseCase(
        this.getEventoRepository(),
        this.getUbicacionRepository(),
        this.getRolRepository(),
        this.getParticipanteRepository(),
        this.getEventoParticipanteRepository()
      );
    }
    return this.createEventoUseCase;
  }

  static getListPublicEventsUseCase(): ListPublicEventsUseCase {
    if (!this.listPublicEventsUseCase) {
      this.listPublicEventsUseCase = new ListPublicEventsUseCase(
        this.getEventoRepository()
      );
    }
    return this.listPublicEventsUseCase;
  }

  static getListManagedEventsUseCase(): ListManagedEventsUseCase {
    if (!this.listManagedEventsUseCase) {
      this.listManagedEventsUseCase = new ListManagedEventsUseCase(
        this.getEventoRepository()
      );
    }
    return this.listManagedEventsUseCase;
  }

  static getListAttendedEventsUseCase(): ListAttendedEventsUseCase {
    if (!this.listAttendedEventsUseCase) {
      this.listAttendedEventsUseCase = new ListAttendedEventsUseCase(
        this.getEventoRepository()
      );
    }
    return this.listAttendedEventsUseCase;
  }

  // Getter para el middleware de verificación de organizador/coorganizador global
  static getVerifyOrganizerGlobal() {
    if (!this.verifyOrganizerGlobal) {
      const middleware = new VerifyOrganizerGlobal(
        this.getRolRepository(),
        this.getParticipanteRepository(),
        this.getEventoParticipanteRepository()
      );
      this.verifyOrganizerGlobal = (req: Request, res: Response, next: NextFunction) => {
        return middleware.verify(req, res, next);
      };
    }
    return this.verifyOrganizerGlobal;
  }

  // Getter para el middleware de verificación de organizador/coorganizador en evento
  static getVerifyOrganizerInEvent() {
    if (!this.verifyOrganizerInEvent) {
      const middleware = new VerifyOrganizerInEvent(
        this.getRolRepository(),
        this.getParticipanteRepository(),
        this.getEventoParticipanteRepository()
      );
      this.verifyOrganizerInEvent = (req: Request, res: Response, next: NextFunction) => {
        return middleware.verify(req, res, next);
      };
    }
    return this.verifyOrganizerInEvent;
  }
}
