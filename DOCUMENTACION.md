# 📚 Índice de Documentación

Documentación completa del Backend - Sistema de Gestión de Eventos

## 📖 Documentos Disponibles

### 1. **README.md** - Guía Principal
- Instalación y configuración
- Scripts disponibles
- Endpoints API
- Estructura del proyecto
- Tecnologías utilizadas

**👉 [Ver README.md](./README.md)**

---

### 2. **ARQUITECTURA_SIMPLIFICADA.md** - Arquitectura del Sistema
- Estructura por módulos/features (organización por Historia de Usuario)
- Flujo de datos
- Patrones de diseño utilizados
- Comparación con Clean Architecture completa
- Guía para agregar nuevas funcionalidades

**👉 [Ver ARQUITECTURA_SIMPLIFICADA.md](./ARQUITECTURA_SIMPLIFICADA.md)**

---

### 3. **PATRON_FACTORY_METHOD.md** - Patrón Factory Method
- Diagrama de clases
- Implementación del patrón
- Fábrica Abstracta (NotificacionFabrica)
- Fábrica Concreta (InvitacionFabrica)
- Extensibilidad futura
- Ejemplos de uso

**👉 [Ver PATRON_FACTORY_METHOD.md](./PATRON_FACTORY_METHOD.md)**

---

## 🎯 Guía Rápida

### Para Empezar
1. Lee **README.md** para instalación, configuración y scripts de BD

### Para Entender la Arquitectura
1. Lee **ARQUITECTURA_SIMPLIFICADA.md** para entender la estructura
2. Revisa **PATRON_FACTORY_METHOD.md** para entender el patrón implementado

### Para Agregar Funcionalidades
1. Consulta **ARQUITECTURA_SIMPLIFICADA.md** → Sección "Cómo Agregar Nuevas Funcionalidades"
2. Sigue el patrón Repository + Use Case + Controller

---

## 📂 Estructura de Archivos de Documentación

```
EventMaster-Backend/
├── README.md                        # 📘 Guía principal + Scripts BD
├── ARQUITECTURA_SIMPLIFICADA.md     # 🏗️ Arquitectura del sistema
├── PATRON_FACTORY_METHOD.md         # 🏭 Patrón Factory Method
├── DOCUMENTACION.md                 # 📚 Este archivo (índice)
│
├── .env.example                     # Plantilla de configuración
├── package.json                     # Dependencias
├── tsconfig.json                    # Configuración TypeScript
└── src/                             # Código fuente
```

---

## 🚀 Inicio Rápido

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar .env
cp .env.example .env
# Editar .env con tus credenciales

# 3. Configurar base de datos
npm run db:create
npm run db:migrate
npm run db:seed

# 4. Ejecutar servidor
npm run dev
```

---

## 📞 Contacto y Soporte

Para preguntas o problemas, consulta primero la documentación correspondiente:
- **Instalación y Scripts**: README.md
- **Arquitectura**: ARQUITECTURA_SIMPLIFICADA.md
- **Patrones**: PATRON_FACTORY_METHOD.md

---

**Última actualización**: 2025-10-10  
**Versión**: 2.1.0 (Arquitectura Simplificada + Factory Method)
