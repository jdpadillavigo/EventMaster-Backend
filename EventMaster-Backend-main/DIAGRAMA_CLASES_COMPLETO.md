# DIAGRAMA DE CLASES COMPLETO - BACKEND

## 📐 Arquitectura Completa del Sistema

Este diagrama incluye **todas las capas** del backend: Models, Repositories, Use Cases, Controllers, Factories y Services.

---

## 🎯 DIAGRAMA COMPLETO EN MERMAID

```mermaid
classDiagram
    %% ========================================
    %% CAPA DE DOMINIO (DOMAIN LAYER)
    %% ========================================
    
    %% Interfaces de Repositorios
    class IUsuarioRepository {
        <<interface>>
        +findById(id: number) Promise~any~
        +findByEmail(email: string) Promise~any~
        +searchByQuery(query: string) Promise~any[]~
        +create(data: any) Promise~any~
        +update(id: number, data: any) Promise~any~
    }
    
    class IEventoRepository {
        <<interface>>
        +findById(id: number) Promise~any~
        +findByTituloLowerCase(titulo: string) Promise~any~
        +countEventosByOrganizador(userId: number) Promise~number~
        +create(data: any) Promise~any~
        +incrementParticipantes(id: number) Promise~void~
    }
    
    class IInvitacionRepository {
        <<interface>>
        +findById(id: number) Promise~any~
        +create(data: any) Promise~any~
    }
    
    class IInvitacionUsuarioRepository {
        <<interface>>
        +findByIdWithEventoAndUsuario(id: number) Promise~any~
        +findByEventoAndUsuario(eventoId: number, usuarioId: number) Promise~any~
        +countPendientesByEvento(eventoId: number, estadoId: number) Promise~number~
        +create(data: any) Promise~any~
        +update(id: number, data: any) Promise~any~
    }
    
    class IParticipanteRepository {
        <<interface>>
        +findByUsuarioAndRol(usuarioId: number, rolId: number) Promise~any~
        +create(data: any) Promise~any~
    }
    
    class IEventoParticipanteRepository {
        <<interface>>
        +create(eventoId: number, participanteId: number) Promise~any~
        +countByEvento(eventoId: number) Promise~number~
        +isUsuarioInEvento(eventoId: number, usuarioId: number) Promise~boolean~
    }
    
    %% Value Objects
    class TipoNotificacion {
        <<enumeration>>
        INVITACION
        RECORDATORIO
        ALERTA
    }
    
    class EstadoInvitacionEnum {
        <<enumeration>>
        PENDIENTE
        ACEPTADA
        RECHAZADA
    }
    
    class Constantes {
        <<constants>>
        +LIMITE_INVITACIONES_PENDIENTES: number
        +LIMITE_RESULTADOS_BUSQUEDA: number
        +DIAS_VALIDEZ_INVITACION: number
    }
    
    %% ========================================
    %% CAPA DE INFRAESTRUCTURA (INFRASTRUCTURE)
    %% ========================================
    
    %% Modelos Sequelize
    class Usuario {
        +usuario_id: number
        +clave: string
        +correo: string
        +isActive: boolean
        +activation_token: string
        +token_expires_at: Date
        +associate(models: any) void
    }
    
    class Cliente {
        +cliente_id: number
        +nombre: string
        +apellido: string
        +usuario_id: number
        +associate(models: any) void
    }
    
    class Evento {
        +evento_id: number
        +titulo: string
        +descripcion: string
        +fechaInicio: Date
        +fechaFin: Date
        +imagen: string
        +nroParticipantes: number
        +aforo: number
        +estadoEvento: number
        +privacidad: number
        +associate(models: any) void
    }
    
    class Participante {
        +participante_id: number
        +usuario_id: number
        +rol_id: number
        +associate(models: any) void
    }
    
    class EventoParticipante {
        +evento_id: number
        +participante_id: number
        +associate(models: any) void
    }
    
    class Notificacion {
        +notificacion_id: number
        +fechaHora: Date
        +evento_id: number
        +associate(models: any) void
    }
    
    class Invitacion {
        +notificacion_id: number
        +fechaLimite: Date
        +associate(models: any) void
    }
    
    class InvitacionUsuario {
        +invitacion_usuario_id: number
        +estado_invitacion_id: number
        +invitacion_id: number
        +usuario_id: number
        +associate(models: any) void
    }
    
    class Rol {
        +rol_id: number
        +nombre: string
        +associate(models: any) void
    }
    
    class EstadoInvitacion {
        +estado_id: number
        +nombre: string
        +associate(models: any) void
    }
    
    class EstadoEvento {
        +estado_id: number
        +nombre: string
        +associate(models: any) void
    }
    
    class Privacidad {
        +privacidad_id: number
        +nombre: string
        +associate(models: any) void
    }
    
    class Ubicacion {
        +ubicacion_id: number
        +direccion: string
        +latitud: number
        +longitud: number
        +evento_id: number
        +associate(models: any) void
    }
    
    %% Repositorios (Implementaciones)
    class UsuarioRepository {
        +findById(id: number) Promise~any~
        +findByEmail(email: string) Promise~any~
        +findByActivationToken(token: string) Promise~any~
        +searchByQuery(query: string, limit: number) Promise~any[]~
        +create(data: any) Promise~any~
        +update(id: number, data: any) Promise~any~
        +delete(id: number) Promise~boolean~
    }
    
    class EventoRepository {
        +findById(id: number) Promise~any~
        +findByTituloLowerCase(titulo: string) Promise~any~
        +countEventosByOrganizador(userId: number) Promise~number~
        +create(data: any) Promise~any~
        +incrementParticipantes(id: number) Promise~void~
        +findPublicEvents() Promise~any[]~
    }
    
    class InvitacionRepository {
        +findById(id: number) Promise~any~
        +create(data: any) Promise~any~
    }
    
    class InvitacionUsuarioRepository {
        +findByIdWithEventoAndUsuario(id: number) Promise~any~
        +findByEventoAndUsuario(eventoId: number, usuarioId: number) Promise~any~
        +countPendientesByEvento(eventoId: number, estadoId: number) Promise~number~
        +create(data: any) Promise~any~
        +update(id: number, data: any) Promise~any~
    }
    
    class ParticipanteRepository {
        +findByUsuarioAndRol(usuarioId: number, rolId: number) Promise~any~
        +findAllByUsuarioId(usuarioId: number) Promise~any[]~
        +create(data: any) Promise~any~
    }
    
    class EventoParticipanteRepository {
        +create(eventoId: number, participanteId: number) Promise~any~
        +findByEventoAndParticipante(eventoId: number, participanteId: number) Promise~any~
        +countByEvento(eventoId: number) Promise~number~
        +countByParticipante(participanteId: number) Promise~number~
        +isUsuarioInEvento(eventoId: number, usuarioId: number) Promise~boolean~
    }
    
    class ClienteRepository {
        +create(data: any) Promise~any~
        +update(usuarioId: number, data: any) Promise~any~
    }
    
    class EstadoInvitacionRepository {
        +findByNombre(nombre: string) Promise~any~
    }
    
    class RolRepository {
        +findByNombre(nombre: string) Promise~any~
    }
    
    class UbicacionRepository {
        +create(data: any) Promise~any~
    }
    
    %% Factories (Factory Method Pattern)
    class NotificacionFabrica {
        <<abstract>>
        +MetodoFabrica(fechaHora: Date, eventoId: number, fechaLimite: Date)* Promise~any~
        +crearNotificacion(fechaHora: Date, eventoId: number, tipo: string, fechaLimite: Date)$ Promise~any~
    }
    
    class InvitacionFabrica {
        +MetodoFabrica(fechaHora: Date, eventoId: number, fechaLimite: Date) Promise~any~
    }
    
    %% Services
    class EmailService {
        -transporter: Transporter
        +sendActivationEmail(email: string, token: string, userName: string) Promise~any~
        +sendWelcomeEmail(email: string, userName: string) Promise~any~
    }
    
    %% ========================================
    %% CAPA DE APLICACIÓN (APPLICATION)
    %% ========================================
    
    %% DTOs
    class SearchUsuariosDto {
        +query: string
        +limit: number
    }
    
    class SendInvitacionDto {
        +evento_id: number
        +usuario_ids: number[]
        +fechaLimite: Date
    }
    
    class RegistrarUsuarioDto {
        +correo: string
        +clave: string
        +nombre: string
        +apellido: string
    }
    
    class CrearEventoDto {
        +name: string
        +date: Date
        +capacity: number
        +description: string
        +privacy: string
        +ownerId: number
        +locationAddress: string
        +imageUrl: string
        +lat: number
        +lng: number
    }
    
    class RespondInvitacionDto {
        +invitacion_usuario_id: number
        +accept: boolean
    }
    
    %% Use Cases
    class SearchUsuariosUseCase {
        -usuarioRepository: IUsuarioRepository
        +execute(dto: SearchUsuariosDto) Promise~any[]~
    }
    
    class SendInvitacionUseCase {
        -usuarioRepository: IUsuarioRepository
        -eventoRepository: IEventoRepository
        -eventoParticipanteRepository: IEventoParticipanteRepository
        -invitacionUsuarioRepository: IInvitacionUsuarioRepository
        -estadoInvitacionRepository: IEstadoInvitacionRepository
        +execute(dto: SendInvitacionDto) Promise~any~
    }
    
    class GetNoElegiblesUseCase {
        -invitacionUsuarioRepository: IInvitacionUsuarioRepository
        -estadoInvitacionRepository: IEstadoInvitacionRepository
        +execute(eventoId: number) Promise~any[]~
    }
    
    class CountInvitacionesPendientesUseCase {
        -invitacionUsuarioRepository: IInvitacionUsuarioRepository
        -estadoInvitacionRepository: IEstadoInvitacionRepository
        +execute(eventoId: number) Promise~any~
    }
    
    class RegistrarUsuarioUseCase {
        -usuarioRepository: IUsuarioRepository
        -clienteRepository: IClienteRepository
        -emailService: EmailService
        +execute(dto: RegistrarUsuarioDto) Promise~any~
    }
    
    class ActivarCuentaUseCase {
        -usuarioRepository: IUsuarioRepository
        -emailService: EmailService
        +execute(token: string) Promise~any~
    }
    
    class LoginUseCase {
        -usuarioRepository: IUsuarioRepository
        +execute(correo: string, clave: string) Promise~any~
    }
    
    class CreateEventoUseCase {
        -eventoRepository: IEventoRepository
        -ubicacionRepository: IUbicacionRepository
        -rolRepository: IRolRepository
        -participanteRepository: IParticipanteRepository
        -eventoParticipanteRepository: IEventoParticipanteRepository
        +execute(dto: CrearEventoDto) Promise~any~
    }
    
    class ListPublicEventsUseCase {
        -eventoRepository: IEventoRepository
        +execute() Promise~any[]~
    }
    
    class ListManagedEventsUseCase {
        -eventoRepository: IEventoRepository
        +execute(userId: number) Promise~any[]~
    }
    
    class ListAttendedEventsUseCase {
        -eventoRepository: IEventoRepository
        +execute(userId: number) Promise~any[]~
    }
    
    class RespondInvitacionUseCase {
        -invitacionUsuarioRepository: IInvitacionUsuarioRepository
        -estadoInvitacionRepository: IEstadoInvitacionRepository
        -participanteRepository: IParticipanteRepository
        -rolRepository: IRolRepository
        -eventoParticipanteRepository: IEventoParticipanteRepository
        -eventoRepository: IEventoRepository
        +execute(dto: RespondInvitacionDto) Promise~any~
    }
    
    class GetParticipantesByEventoUseCase {
        -eventoParticipanteRepository: IEventoParticipanteRepository
        +execute(eventoId: number) Promise~any[]~
    }
    
    class GetInvitacionesPrivadasUseCase {
        -invitacionUsuarioRepository: IInvitacionUsuarioRepository
        +execute(usuarioId: number) Promise~any[]~
    }
    
    class GetEventoDetalleUseCase {
        -eventoRepository: IEventoRepository
        +execute(eventoId: number) Promise~any~
    }
    
    class ConfirmPublicAttendanceUseCase {
        -eventoRepository: IEventoRepository
        -eventoParticipanteRepository: IEventoParticipanteRepository
        -rolRepository: IRolRepository
        -participanteRepository: IParticipanteRepository
        +execute(eventoId: number, usuarioId: number) Promise~any~
    }
    
    %% ========================================
    %% CAPA DE PRESENTACIÓN (PRESENTATION)
    %% ========================================
    
    class InvitacionController {
        -router: Router
        -searchUsuariosUseCase: SearchUsuariosUseCase
        -sendInvitacionUseCase: SendInvitacionUseCase
        -getNoElegiblesUseCase: GetNoElegiblesUseCase
        -countInvitacionesPendientesUseCase: CountInvitacionesPendientesUseCase
        +getRouter() Router
        -searchUsuarios(req: Request, res: Response) Promise~void~
        -sendInvitacion(req: Request, res: Response) Promise~void~
        -getNoElegibles(req: Request, res: Response) Promise~void~
        -countInvitacionesPendientes(req: Request, res: Response) Promise~void~
    }
    
    class AuthController {
        -router: Router
        -registrarUsuarioUseCase: RegistrarUsuarioUseCase
        -activarCuentaUseCase: ActivarCuentaUseCase
        -loginUseCase: LoginUseCase
        +getRouter() Router
        -register(req: Request, res: Response) Promise~void~
        -activate(req: Request, res: Response) Promise~void~
        -login(req: Request, res: Response) Promise~void~
    }
    
    class EventoController {
        -router: Router
        -createEventoUseCase: CreateEventoUseCase
        -listPublicEventsUseCase: ListPublicEventsUseCase
        -listManagedEventsUseCase: ListManagedEventsUseCase
        -listAttendedEventsUseCase: ListAttendedEventsUseCase
        -getEventoDetalleUseCase: GetEventoDetalleUseCase
        -confirmPublicAttendanceUseCase: ConfirmPublicAttendanceUseCase
        +getRouter() Router
        -create(req: Request, res: Response) Promise~void~
        -listPublic(req: Request, res: Response) Promise~void~
        -listManaged(req: Request, res: Response) Promise~void~
        -listAttended(req: Request, res: Response) Promise~void~
    }
    
    class ParticipanteController {
        -router: Router
        -getParticipantesByEventoUseCase: GetParticipantesByEventoUseCase
        +getRouter() Router
        -getByEvento(req: Request, res: Response) Promise~void~
    }
    
    class InvitacionPrivadaController {
        -router: Router
        -getInvitacionesPrivadasUseCase: GetInvitacionesPrivadasUseCase
        -respondInvitacionUseCase: RespondInvitacionUseCase
        +getRouter() Router
        -getInvitaciones(req: Request, res: Response) Promise~void~
        -respond(req: Request, res: Response) Promise~void~
    }
    
    %% ========================================
    %% CAPA COMPARTIDA (SHARED)
    %% ========================================
    
    class DependencyContainer {
        <<singleton>>
        -usuarioRepository: UsuarioRepository
        -eventoRepository: EventoRepository
        -emailService: EmailService
        +getUsuarioRepository()$ UsuarioRepository
        +getEventoRepository()$ EventoRepository
        +getEmailService()$ EmailService
        +getSearchUsuariosUseCase()$ SearchUsuariosUseCase
        +getSendInvitacionUseCase()$ SendInvitacionUseCase
        +getRegistrarUsuarioUseCase()$ RegistrarUsuarioUseCase
        +getCreateEventoUseCase()$ CreateEventoUseCase
    }
    
    %% ========================================
    %% RELACIONES ENTRE CAPAS
    %% ========================================
    
    %% Repositories implementan Interfaces
    UsuarioRepository ..|> IUsuarioRepository
    EventoRepository ..|> IEventoRepository
    InvitacionRepository ..|> IInvitacionRepository
    InvitacionUsuarioRepository ..|> IInvitacionUsuarioRepository
    ParticipanteRepository ..|> IParticipanteRepository
    EventoParticipanteRepository ..|> IEventoParticipanteRepository
    
    %% Repositories usan Models
    UsuarioRepository --> Usuario : uses
    EventoRepository --> Evento : uses
    InvitacionRepository --> Invitacion : uses
    InvitacionUsuarioRepository --> InvitacionUsuario : uses
    ParticipanteRepository --> Participante : uses
    EventoParticipanteRepository --> EventoParticipante : uses
    ClienteRepository --> Cliente : uses
    
    %% Factory Pattern
    InvitacionFabrica --|> NotificacionFabrica : extends
    InvitacionFabrica --> Notificacion : creates
    InvitacionFabrica --> Invitacion : creates
    InvitacionFabrica --> Constantes : uses
    
    %% Use Cases dependen de Interfaces (DIP)
    SearchUsuariosUseCase --> IUsuarioRepository : depends on
    SendInvitacionUseCase --> IUsuarioRepository : depends on
    SendInvitacionUseCase --> IEventoRepository : depends on
    SendInvitacionUseCase --> IEventoParticipanteRepository : depends on
    SendInvitacionUseCase --> IInvitacionUsuarioRepository : depends on
    SendInvitacionUseCase --> IEstadoInvitacionRepository : depends on
    SendInvitacionUseCase --> NotificacionFabrica : uses
    SendInvitacionUseCase --> TipoNotificacion : uses
    SendInvitacionUseCase --> Constantes : uses
    
    RegistrarUsuarioUseCase --> IUsuarioRepository : depends on
    RegistrarUsuarioUseCase --> IClienteRepository : depends on
    RegistrarUsuarioUseCase --> EmailService : depends on
    
    CreateEventoUseCase --> IEventoRepository : depends on
    CreateEventoUseCase --> IUbicacionRepository : depends on
    CreateEventoUseCase --> IRolRepository : depends on
    CreateEventoUseCase --> IParticipanteRepository : depends on
    CreateEventoUseCase --> IEventoParticipanteRepository : depends on
    
    RespondInvitacionUseCase --> IInvitacionUsuarioRepository : depends on
    RespondInvitacionUseCase --> IEstadoInvitacionRepository : depends on
    RespondInvitacionUseCase --> IParticipanteRepository : depends on
    RespondInvitacionUseCase --> IRolRepository : depends on
    RespondInvitacionUseCase --> IEventoParticipanteRepository : depends on
    RespondInvitacionUseCase --> IEventoRepository : depends on
    RespondInvitacionUseCase --> EstadoInvitacionEnum : uses
    
    %% Use Cases usan DTOs
    SearchUsuariosUseCase --> SearchUsuariosDto : uses
    SendInvitacionUseCase --> SendInvitacionDto : uses
    RegistrarUsuarioUseCase --> RegistrarUsuarioDto : uses
    CreateEventoUseCase --> CrearEventoDto : uses
    RespondInvitacionUseCase --> RespondInvitacionDto : uses
    
    %% Controllers usan Use Cases
    InvitacionController --> SearchUsuariosUseCase : uses
    InvitacionController --> SendInvitacionUseCase : uses
    InvitacionController --> GetNoElegiblesUseCase : uses
    InvitacionController --> CountInvitacionesPendientesUseCase : uses
    
    AuthController --> RegistrarUsuarioUseCase : uses
    AuthController --> ActivarCuentaUseCase : uses
    AuthController --> LoginUseCase : uses
    
    EventoController --> CreateEventoUseCase : uses
    EventoController --> ListPublicEventsUseCase : uses
    EventoController --> ListManagedEventsUseCase : uses
    EventoController --> ListAttendedEventsUseCase : uses
    EventoController --> GetEventoDetalleUseCase : uses
    EventoController --> ConfirmPublicAttendanceUseCase : uses
    
    ParticipanteController --> GetParticipantesByEventoUseCase : uses
    
    InvitacionPrivadaController --> GetInvitacionesPrivadasUseCase : uses
    InvitacionPrivadaController --> RespondInvitacionUseCase : uses
    
    %% DependencyContainer gestiona todo
    DependencyContainer --> UsuarioRepository : creates
    DependencyContainer --> EventoRepository : creates
    DependencyContainer --> EmailService : creates
    DependencyContainer --> SearchUsuariosUseCase : creates
    DependencyContainer --> SendInvitacionUseCase : creates
    DependencyContainer --> RegistrarUsuarioUseCase : creates
    DependencyContainer --> CreateEventoUseCase : creates
    
    %% Relaciones entre Models (Base de Datos)
    Usuario ||--|| Cliente : "1:1"
    Usuario ||--o{ Participante : "1:N"
    Usuario ||--o{ InvitacionUsuario : "1:N"
    Rol ||--o{ Participante : "1:N"
    Evento ||--o{ EventoParticipante : "1:N"
    Participante ||--o{ EventoParticipante : "1:N"
    Evento ||--o{ Notificacion : "1:N"
    Evento ||--|| Ubicacion : "1:1"
    EstadoEvento ||--o{ Evento : "1:N"
    Privacidad ||--o{ Evento : "1:N"
    Notificacion ||--|| Invitacion : "1:1"
    Invitacion ||--o{ InvitacionUsuario : "1:N"
    EstadoInvitacion ||--o{ InvitacionUsuario : "1:N"
```

---

## 📊 RESUMEN POR CAPAS

### **🔵 DOMAIN LAYER (Dominio)**
- **10 Interfaces de Repositorios**: Contratos que definen operaciones
- **2 Enumeraciones**: `TipoNotificacion`, `EstadoInvitacionEnum`
- **1 Clase de Constantes**: Valores de negocio centralizados

### **🟢 INFRASTRUCTURE LAYER (Infraestructura)**
- **13 Modelos Sequelize**: Entidades de base de datos
- **10 Repositorios**: Implementaciones de interfaces
- **2 Factories**: `NotificacionFabrica`, `InvitacionFabrica`
- **1 Service**: `EmailService`

### **🟡 APPLICATION LAYER (Aplicación)**
- **5 DTOs**: Objetos de transferencia de datos
- **15 Use Cases**: Lógica de negocio encapsulada

### **🔴 PRESENTATION LAYER (Presentación)**
- **5 Controllers**: Manejo de peticiones HTTP

### **⚪ SHARED LAYER (Compartido)**
- **1 DependencyContainer**: Inyección de dependencias (Singleton)

---

## 🎯 PATRONES IDENTIFICADOS EN EL DIAGRAMA

### **1. Repository Pattern**
```
IUsuarioRepository (Interface) ← UsuarioRepository (Implementation) → Usuario (Model)
```

### **2. Dependency Inversion Principle (DIP)**
```
SearchUsuariosUseCase → IUsuarioRepository (depende de abstracción)
                              ↑
                    UsuarioRepository (implementación)
```

### **3. Factory Method Pattern**
```
NotificacionFabrica (Abstract)
        ↑
InvitacionFabrica (Concrete) → crea → Notificacion + Invitacion
```

### **4. Singleton Pattern**
```
DependencyContainer (única instancia) → gestiona → Repositories + Services
```

### **5. DTO Pattern**
```
Controller → DTO → Use Case → Repository
```

---

## 📈 MÉTRICAS DEL SISTEMA

| Categoría | Cantidad |
|-----------|----------|
| **Total de Clases** | 68 |
| **Interfaces** | 10 |
| **Modelos (Sequelize)** | 13 |
| **Repositorios** | 10 |
| **Use Cases** | 15 |
| **Controllers** | 5 |
| **DTOs** | 5 |
| **Factories** | 2 |
| **Services** | 1 |
| **Enumeraciones** | 2 |
| **Utilities** | 1 |

---

## 🔗 FLUJO DE DATOS COMPLETO

```
HTTP Request
    ↓
Controller (Presentation)
    ↓
Use Case (Application) ← DTO
    ↓
Repository (Infrastructure) ← Interface (Domain)
    ↓
Model (Sequelize)
    ↓
Database (PostgreSQL)
```

---

## 💡 NOTAS ARQUITECTÓNICAS

### **Separación de Responsabilidades**
- ✅ **Controllers**: Solo manejo HTTP
- ✅ **Use Cases**: Solo lógica de negocio
- ✅ **Repositories**: Solo acceso a datos
- ✅ **Models**: Solo estructura de datos

### **Cumplimiento SOLID**
- ✅ **SRP**: Cada clase una responsabilidad
- ✅ **OCP**: Extensible mediante interfaces y herencia
- ✅ **LSP**: Repositorios intercambiables
- ✅ **ISP**: Interfaces específicas
- ✅ **DIP**: Dependencia de abstracciones

### **Testabilidad**
- ✅ Use Cases reciben interfaces (fácil mockear)
- ✅ Repositorios aislados de lógica
- ✅ DTOs facilitan testing

### **Escalabilidad**
- ✅ Agregar módulos sin modificar existentes
- ✅ Factory Method permite nuevos tipos
- ✅ DI Container centraliza gestión
