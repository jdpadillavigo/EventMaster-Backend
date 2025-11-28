# Arquitectura Backend - POO Simplificada + Sequelize + Express

## 📐 Estructura del Proyecto (Por Módulos/Features)

```
src/
├── modules/                     # Módulos organizados por Historia de Usuario
│   └── invitaciones/            # Historia: "Invitar usuarios a eventos"
│       ├── dtos/                # Data Transfer Objects
│       │   ├── SearchUsuariosDto.ts
│       │   └── SendInvitacionDto.ts
│       ├── use-cases/           # Casos de uso específicos
│       │   ├── SearchUsuariosUseCase.ts
│       │   ├── SendInvitacionUseCase.ts
│       │   ├── GetNoElegiblesUseCase.ts
│       │   └── CountInvitacionesPendientesUseCase.ts
│       └── controllers/         # Controladores HTTP
│           └── InvitacionController.ts
│   
│   # Futuro: Agregar más módulos
│   # ├── eventos/              # Historia: "Gestionar eventos"
│   # ├── autenticacion/        # Historia: "Login y registro"
│   # └── participantes/        # Historia: "Gestionar participantes"
│
├── domain/                      # Capa de Dominio (compartida)
│   ├── value-objects/           # Objetos de valor (enums, tipos)
│   │   ├── TipoEvento.ts
│   │   ├── RolUsuario.ts
│   │   ├── EstadoInvitacion.ts
│   │   ├── TipoNotificacion.ts
│   │   └── Constantes.ts
│   └── interfaces/              # Contratos (repositorios)
│       ├── IUsuarioRepository.ts
│       ├── IEventoRepository.ts
│       └── IInvitacionRepository.ts
│
├── infrastructure/              # Capa de Infraestructura (compartida)
│   ├── database/                # Sequelize (modelos, config, migrations)
│   │   ├── models/              # Modelos Sequelize (con getters/setters)
│   │   ├── config/              # Configuración DB
│   │   ├── migrations/          # Migraciones
│   │   └── seeders/             # Seeders
│   ├── repositories/            # Implementación de repositorios
│   │   ├── UsuarioRepository.ts
│   │   ├── EventoRepository.ts
│   │   └── InvitacionRepository.ts
│   └── factories/               # Factory Method Pattern
│       ├── NotificacionFabrica.ts
│       └── InvitacionFabrica.ts
│
└── shared/                      # Código compartido
    └── utils/                   # Utilidades
        └── DependencyContainer.ts
```

## 🎯 Organización por Módulos (Feature-Based)

El proyecto está organizado por **Historias de Usuario** en lugar de por tipo de archivo. Esto facilita:

- ✅ **Cohesión alta**: Todo lo relacionado a una funcionalidad está junto
- ✅ **Escalabilidad**: Agregar nueva historia = nueva carpeta en `modules/`
- ✅ **Mantenibilidad**: Fácil encontrar y modificar código relacionado
- ✅ **Trabajo en equipo**: Cada equipo puede trabajar en su módulo sin conflictos
- ✅ **Eliminación de features**: Borrar una carpeta elimina toda la funcionalidad

### Ejemplo: Módulo de Invitaciones

```
modules/invitaciones/
├── dtos/           # Datos de entrada/salida
├── use-cases/      # Lógica de negocio
└── controllers/    # Endpoints HTTP
```

Todo lo necesario para la historia "Invitar usuarios" está en una sola carpeta.

## 🔄 Flujo de Datos

```
Request → Controller → Use Case → Repository → Sequelize Model → Database
```

### Ejemplo: Buscar Usuarios

1. **Request HTTP** llega a `InvitacionController.searchUsuarios()`
2. **Controller** llama a `SearchUsuariosUseCase.execute(dto)`
3. **Use Case** valida datos y llama a `usuarioRepository.searchByQuery()`
4. **Repository** usa modelos Sequelize para consultar la DB
5. **Repository** retorna modelos de Sequelize (con getters/setters)
6. **Use Case** mapea modelos a DTOs
7. **Controller** responde con JSON al cliente

## 🎯 Diferencias con Clean Architecture Completa

### ❌ NO Usamos
- **Entidades de dominio personalizadas** - Usamos modelos de Sequelize directamente
- **Mapeo Sequelize ↔ Entidades** - Simplifica el código

### ✅ SÍ Usamos
- **Separación en capas** - Domain, Application, Infrastructure, Presentation
- **Repository Pattern** - Abstracción del acceso a datos
- **Use Case Pattern** - Lógica de negocio encapsulada
- **Dependency Injection** - Bajo acoplamiento
- **DTO Pattern** - Transferencia de datos entre capas

## 💡 Ventajas de esta Arquitectura Simplificada

### ✅ Pros
- **Menos código**: No necesitas mapear Sequelize ↔ Entidades
- **Más simple**: Sequelize ya tiene getters/setters
- **Más rápido**: Menos conversiones de objetos
- **Mantiene separación de capas**: Controller → Use Case → Repository
- **Testeable**: Puedes mockear repositorios fácilmente

### ⚠️ Contras
- **Acoplamiento a Sequelize**: Cambiar ORM requiere refactorizar repositorios
- **Lógica de negocio en modelos**: Si necesitas lógica compleja, va en servicios de dominio

## 🏗️ Patrones de Diseño Utilizados (6 Patrones)

### 1. **Repository Pattern**
Abstrae el acceso a datos:
```typescript
interface IUsuarioRepository {
  findById(id: number): Promise<any | null>; // any = modelo Sequelize
  searchByQuery(query: string): Promise<any[]>;
}
```

### 2. **Use Case Pattern**
Encapsula lógica de negocio:
```typescript
class SearchUsuariosUseCase {
  constructor(private usuarioRepository: IUsuarioRepository) {}
  
  async execute(dto: SearchUsuariosDto): Promise<UsuarioSearchResultDto[]> {
    // Validación
    // Llamada al repositorio
    // Mapeo a DTO
  }
}
```

### 3. **Dependency Injection**
Inyección de dependencias mediante constructor:
```typescript
class SearchUsuariosUseCase {
  constructor(private usuarioRepository: IUsuarioRepository) {}
}
```

### 4. **DTO Pattern**
Transferencia de datos entre capas:
```typescript
interface SearchUsuariosDto {
  query: string;
  limit?: number;
}
```

### 5. **Singleton Pattern**
Instancias únicas de repositorios compartidos:
```typescript
class DependencyContainer {
  private static usuarioRepository: UsuarioRepository;
  
  static getUsuarioRepository(): UsuarioRepository {
    if (!this.usuarioRepository) {
      this.usuarioRepository = new UsuarioRepository();
    }
    return this.usuarioRepository;
  }
}

// Siempre retorna la misma instancia
const repo1 = DependencyContainer.getUsuarioRepository();
const repo2 = DependencyContainer.getUsuarioRepository();
// repo1 === repo2 (true)
```

### 6. **Factory Method Pattern**
Creación de diferentes tipos de notificaciones:
```typescript
abstract class NotificacionFabrica {
  abstract MetodoFabrica(...): Promise<any>;
  static crearNotificacion(tipo: string) { ... }
}

class InvitacionFabrica extends NotificacionFabrica {
  MetodoFabrica(...) { 
    // Crea Notificación + Invitación
  }
}
```
Ver [PATRON_FACTORY_METHOD.md](./PATRON_FACTORY_METHOD.md) para documentación completa.

## 🚀 Cómo Agregar Nuevas Funcionalidades

### Ejemplo: Agregar endpoint para responder invitaciones

#### 1. Crear DTO
```typescript
// src/application/dtos/RespondInvitacionDto.ts
export interface RespondInvitacionDto {
  invitacion_usuario_id: number;
  aceptada: boolean;
}
```

#### 2. Agregar método al Repository (si es necesario)
```typescript
// src/domain/interfaces/IInvitacionRepository.ts
interface IInvitacionRepository {
  findInvitacionUsuarioById(id: number): Promise<any | null>;
  updateEstadoInvitacion(id: number, estadoId: number): Promise<void>;
}

// src/infrastructure/repositories/InvitacionRepository.ts
async findInvitacionUsuarioById(id: number): Promise<any | null> {
  return await db.InvitacionUsuario.findByPk(id);
}
```

#### 3. Crear Use Case
```typescript
// src/application/use-cases/RespondInvitacionUseCase.ts
export class RespondInvitacionUseCase {
  constructor(private invitacionRepository: IInvitacionRepository) {}

  async execute(dto: RespondInvitacionDto): Promise<any> {
    // 1. Buscar invitación (usa repositorio)
    const invitacion = await this.invitacionRepository
      .findInvitacionUsuarioById(dto.invitacion_usuario_id);
    
    // 2. Validar
    if (!invitacion) throw new Error('Invitación no encontrada');
    
    // 3. Actualizar estado (usa repositorio)
    const estadoId = dto.aceptada ? 2 : 3; // 2=Aceptada, 3=Rechazada
    await this.invitacionRepository.updateEstadoInvitacion(
      dto.invitacion_usuario_id,
      estadoId
    );
    
    return { success: true };
  }
}
```

#### 4. Registrar en DependencyContainer
```typescript
// src/shared/utils/DependencyContainer.ts
static getRespondInvitacionUseCase(): RespondInvitacionUseCase {
  return new RespondInvitacionUseCase(this.getInvitacionRepository());
}
```

#### 5. Agregar endpoint al Controller
```typescript
// src/presentation/controllers/InvitacionController.ts
private respondInvitacionUseCase = DependencyContainer.getRespondInvitacionUseCase();

private initializeRoutes(): void {
  this.router.post("/invitations/respond", this.respondInvitacion.bind(this));
}

private async respondInvitacion(req: Request, res: Response): Promise<void> {
  const result = await this.respondInvitacionUseCase.execute(req.body);
  res.json(result);
}
```

## 📊 Comparación: Arquitectura Completa vs Simplificada

| Aspecto | Completa (DDD) | Simplificada (Actual) |
|---------|----------------|----------------------|
| **Entidades de dominio** | ✅ Clases personalizadas | ❌ Usa modelos Sequelize |
| **Mapeo Sequelize ↔ Entidades** | ✅ Sí (más código) | ❌ No (menos código) |
| **Separación en capas** | ✅ Sí | ✅ Sí |
| **Repository Pattern** | ✅ Sí | ✅ Sí |
| **Use Case Pattern** | ✅ Sí | ✅ Sí |
| **Testabilidad** | ✅ Alta (sin DB) | ✅ Alta (mockear repos) |
| **Complejidad** | ⚠️ Alta | ✅ Media |
| **Acoplamiento a ORM** | ✅ Bajo | ⚠️ Medio |
| **Ideal para** | Proyectos grandes | Proyectos medianos |

## 🎯 Principios SOLID Aplicados

### Single Responsibility Principle (SRP)
```
✅ InvitacionController → Solo maneja HTTP
✅ SearchUsuariosUseCase → Solo lógica de búsqueda
✅ UsuarioRepository → Solo acceso a datos de Usuario
```

### Open/Closed Principle (OCP)
```
✅ Puedes agregar nuevos repositorios sin modificar existentes
✅ Puedes agregar nuevos use cases sin modificar controllers
```

### Dependency Inversion Principle (DIP)
```
✅ Use Cases dependen de interfaces (IRepository)
   no de implementaciones concretas (UsuarioRepository)
```

## 📝 Resumen

Esta arquitectura es un **punto medio pragmático** entre:
- **Arquitectura procedural** (todo mezclado)
- **Clean Architecture completa** (máxima separación)

**Mantiene los beneficios de POO y separación en capas**, pero **simplifica el código** al usar modelos de Sequelize directamente en lugar de crear entidades de dominio personalizadas.

Es ideal para **proyectos medianos** donde necesitas:
- ✅ Código organizado y mantenible
- ✅ Testabilidad
- ✅ Separación de responsabilidades
- ✅ Pragmatismo (menos código boilerplate)
