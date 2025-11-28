# JUSTIFICACIÓN DEL DISEÑO - SPRINT GLOBAL

## 📋 CONTEXTO

Backend desarrollado en un **sprint global único** implementando sistema completo de gestión de eventos con autenticación, gestión de eventos, invitaciones y participación.

---

## 🎯 DECISIONES ARQUITECTÓNICAS CLAVE

### **1. ARQUITECTURA EN CAPAS SIMPLIFICADA**

**Decisión:** Usar modelos Sequelize directamente en lugar de entidades de dominio personalizadas.

**Justificación:**

| Aspecto | Clean Architecture Completa | Nuestra Solución |
|---------|----------------------------|------------------|
| Mapeo ORM ↔ Entidades | Necesario (+40% código) | No necesario |
| Acoplamiento a ORM | Bajo | Medio (aceptable) |
| Tiempo desarrollo | Más lento | Más rápido |
| Principios SOLID | ✅ Cumple | ✅ Cumple |

**Código:**
```typescript
// ✅ Nuestra solución - Sin mapeo innecesario
class UsuarioRepository implements IUsuarioRepository {
  async findById(id: number): Promise<any | null> {
    return await db.Usuario.findByPk(id);  // Retorna modelo Sequelize
  }
}
```

**Cumple SOLID:**
- ✅ SRP: Cada repositorio una responsabilidad
- ✅ DIP: Use Cases dependen de interfaces
- ✅ OCP: Extensible mediante interfaces

**Conclusión:** Mantiene beneficios SOLID reduciendo complejidad para proyecto mediano.

---

### **2. ORGANIZACIÓN MODULAR POR FEATURES**

**Decisión:** Organizar por historias de usuario, no por tipo de archivo.

**Comparación:**

❌ **Por tipo (tradicional):**
```
src/
├── controllers/  (todos los controllers)
├── services/     (todos los services)
└── repositories/ (todos los repositories)
```
Problemas: Baja cohesión, código disperso, conflictos Git

✅ **Por features (nuestra solución):**
```
src/modules/
├── invitaciones/      # Todo junto
│   ├── dtos/
│   ├── use-cases/
│   └── controllers/
└── eventos-crear/     # Todo junto
```

**Ventajas:**
- ✅ Alta cohesión: Código relacionado junto
- ✅ Escalabilidad: Nueva feature = nueva carpeta
- ✅ Menos conflictos Git
- ✅ Fácil eliminar features completas

---

## 🎨 PATRONES DE DISEÑO IMPLEMENTADOS

### **3. FACTORY METHOD PATTERN**

**Decisión:** Usar Factory Method para crear notificaciones.

**Problema:** Crear diferentes tipos de notificaciones con lógica compleja específica.

**Comparación:**

❌ **Alternativa: Creación directa en Use Case**
```typescript
// Viola SRP, código duplicado, no extensible
const notif = await db.Notificacion.create({ ... });
const invit = await db.Invitacion.create({ ... });
```

✅ **Nuestra solución:**
```typescript
// Fábrica Abstracta
abstract class NotificacionFabrica {
  abstract MetodoFabrica(fechaHora: Date, eventoId: number): Promise<any>;
  
  static async crearNotificacion(tipo: string, ...): Promise<any> {
    if (tipo === "INVITACION") {
      return new InvitacionFabrica().MetodoFabrica(...);
    }
    // Extensible para nuevos tipos
  }
}

// Fábrica Concreta
class InvitacionFabrica extends NotificacionFabrica {
  async MetodoFabrica(fechaHora: Date, eventoId: number) {
    const notificacion = await db.Notificacion.create({ ... });
    const invitacion = await db.Invitacion.create({
      notificacion_id: notificacion.notificacion_id,
      fechaLimite: calcularFecha()
    });
    return invitacion;
  }
}
```

**Cumple SOLID:**
- ✅ **OCP**: Agregar `RecordatorioFabrica` sin modificar código existente
- ✅ **SRP**: Cada fábrica una responsabilidad
- ✅ Encapsulación de lógica compleja
- ✅ Extensible y mantenible

---

### **4. REPOSITORY PATTERN**

**Decisión:** Abstraer acceso a datos con interfaces.

**Comparación:**

❌ **Alternativa: Acceso directo a BD**
```typescript
// Acoplamiento fuerte, no testeable, queries dispersas
const evento = await db.Evento.findByPk(id);
```

✅ **Nuestra solución:**
```typescript
// Interfaz (Domain)
interface IUsuarioRepository {
  findById(id: number): Promise<any | null>;
  searchByQuery(query: string): Promise<any[]>;
}

// Implementación (Infrastructure)
class UsuarioRepository implements IUsuarioRepository {
  async searchByQuery(query: string): Promise<any[]> {
    return await db.Usuario.findAll({
      where: { correo: { [Op.iLike]: `%${query}%` } }
    });
  }
}

// Uso (Application)
class SearchUsuariosUseCase {
  constructor(private usuarioRepository: IUsuarioRepository) {}
  
  async execute(dto: SearchUsuariosDto) {
    return await this.usuarioRepository.searchByQuery(dto.query);
  }
}
```

**Cumple SOLID:**
- ✅ **DIP**: Use Case depende de interfaz, no implementación
- ✅ **SRP**: Repositorio solo acceso a datos
- ✅ Testeable con mocks
- ✅ Queries centralizadas

---

### **5. DEPENDENCY INJECTION + SINGLETON**

**Decisión:** Contenedor DI con Singleton para servicios.

**Comparación:**

❌ **Alternativa: Instanciación directa**
```typescript
// Acoplamiento fuerte, no testeable, duplicación
const repo = new UsuarioRepository();
const useCase = new SearchUsuariosUseCase(repo);
```

✅ **Nuestra solución:**
```typescript
class DependencyContainer {
  private static usuarioRepository: UsuarioRepository;
  private static emailService: EmailService;
  
  static getUsuarioRepository(): UsuarioRepository {
    if (!this.usuarioRepository) {
      this.usuarioRepository = new UsuarioRepository();
    }
    return this.usuarioRepository;  // Singleton
  }
  
  static getSearchUsuariosUseCase(): SearchUsuariosUseCase {
    return new SearchUsuariosUseCase(
      this.getUsuarioRepository()  // Inyección automática
    );
  }
}
```

**Ventajas:**
- ✅ **Singleton**: Una instancia reutilizada (eficiencia)
- ✅ **DIP**: Inyección de dependencias
- ✅ Gestión centralizada
- ✅ Testeable con mocks

---

### **6. VALIDACIÓN EN USE CASES**

**Decisión:** Validar en capa de aplicación, no en controllers.

**Comparación:**

❌ **Alternativa: Validar en Controller**
```typescript
// Viola SRP, no reutilizable, difícil testear
if (!req.body.correo) return res.status(400).json({ ... });
```

✅ **Nuestra solución:**
```typescript
class RegistrarUsuarioUseCase {
  async execute(dto: RegistrarUsuarioDto) {
    // Validaciones de formato
    if (!dto.correo || !dto.clave) {
      throw new Error('Campos requeridos');
    }
    
    if (dto.clave.length < 6) {
      throw new Error('Clave debe tener al menos 6 caracteres');
    }
    
    // Validaciones de negocio
    const existe = await this.usuarioRepository.findByEmail(dto.correo);
    if (existe && existe.isActive) {
      throw new Error('Correo ya registrado');
    }
    
    // Lógica de negocio
    const token = this.generateToken();
    await this.usuarioRepository.create({ ... });
  }
}
```

**Cumple SOLID:**
- ✅ **SRP**: Controller solo HTTP, Use Case solo lógica
- ✅ Reutilizable desde HTTP, CLI, GraphQL
- ✅ Testeable sin HTTP
- ✅ Validaciones centralizadas

---

### **7. TRANSACCIONES DE BASE DE DATOS**

**Decisión:** Usar transacciones para operaciones multi-tabla.

**Comparación:**

❌ **Alternativa: Sin transacciones**
```typescript
// Riesgo de inconsistencia
const evento = await this.eventoRepository.create({ ... });  // ✅
await this.ubicacionRepository.create({ ... });              // ✅
await this.participanteRepository.create({ ... });           // ❌ FALLA
// Resultado: Evento huérfano sin organizador
```

✅ **Nuestra solución:**
```typescript
const nuevo = await db.sequelize.transaction(async (t) => {
  const evento = await this.eventoRepository.create({ ... });
  await this.ubicacionRepository.create({ evento_id: evento.evento_id });
  const participante = await this.participanteRepository.create({ ... });
  await this.eventoParticipanteRepository.create(evento.evento_id, participante.id);
  
  return evento;
  // Si falla cualquier operación: ROLLBACK automático
});
```

**Ventajas:**
- ✅ **Atomicidad**: Todo o nada (ACID)
- ✅ **Consistencia**: BD siempre válida
- ✅ No quedan registros huérfanos
- ✅ Rollback automático

---

## 📊 RESUMEN DE CUMPLIMIENTO SOLID

| Principio | Implementación | Ejemplo |
|-----------|----------------|---------|
| **SRP** | ✅ Cada clase una responsabilidad | Controller (HTTP), Use Case (lógica), Repository (datos) |
| **OCP** | ✅ Extensible sin modificar | Factory Method, módulos independientes |
| **LSP** | ✅ Subclases sustituibles | `InvitacionFabrica` sustituye `NotificacionFabrica` |
| **ISP** | ✅ Interfaces específicas | `IUsuarioRepository`, `IEventoRepository` separadas |
| **DIP** | ✅ Depende de abstracciones | Use Cases dependen de interfaces, no implementaciones |

---

## 🎓 CONCLUSIÓN

El diseño implementado combina:

1. **Arquitectura pragmática**: Simplificada pero manteniendo SOLID
2. **Patrones probados**: Repository, Factory Method, DI, Singleton
3. **Organización modular**: Alta cohesión por features
4. **Validaciones centralizadas**: En capa de aplicación
5. **Transacciones**: Garantizan consistencia

**Resultado:** Sistema mantenible, testeable, extensible y que cumple principios SOLID sin sobre-ingeniería.
