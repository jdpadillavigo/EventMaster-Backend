# Backend - Sistema de Gestión de Eventos

Backend desarrollado con **Node.js + TypeScript + Express + Sequelize + PostgreSQL** usando **arquitectura en capas con POO simplificada**.

> 📚 **[Ver Índice de Documentación Completa](./DOCUMENTACION.md)**

## 🏗️ Arquitectura

Este proyecto implementa una **arquitectura en capas simplificada** con las siguientes capas:

- **Domain**: Value Objects, Interfaces (lógica de negocio)
- **Application**: Casos de Uso, DTOs (orquestación)
- **Infrastructure**: Repositorios, Base de Datos (Sequelize), Factories
- **Presentation**: Controllers (capa HTTP)
- **Shared**: Utilidades, DI Container

**Usa modelos de Sequelize directamente** (no entidades de dominio personalizadas) para simplificar el código manteniendo la separación en capas.

📖 Ver [ARQUITECTURA_SIMPLIFICADA.md](./ARQUITECTURA_SIMPLIFICADA.md) para documentación detallada.

## 📋 Requisitos Previos

- **Node.js**: v20.19.0 (recomendado usar `nvm`)
- **PostgreSQL**: v12 o superior
- **npm**: v10 o superior

## 🔧 Scripts de Base de Datos

```bash
npm run db:create        # Crear base de datos
npm run db:migrate       # Ejecutar migraciones
npm run db:seed          # Poblar con datos de prueba
npm run db:reset         # Reset completo (drop + create + migrate + seed)
npm run db:migrate:undo  # Deshacer última migración
npm run db:seed:undo     # Deshacer seeders
npm run db:drop          # Eliminar base de datos
```

## 🚀 Instalación

### 1. Clonar el repositorio
```bash
cd EventMaster-Backend
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Crea un archivo `.env` en la raíz del proyecto:

```bash
cp .env.example .env
```

Edita `.env` con tus credenciales:
```env
PORT=5000

DB_HOST=127.0.0.1
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=tu_password
DB_NAME=eventos_db
DB_NAME_TEST=eventos_db_test

NODE_ENV=development
```

### 4. Configurar Base de Datos

#### Crear base de datos
```bash
npm run db:create
```

#### Ejecutar migraciones
```bash
npm run db:migrate
```

#### Poblar con datos de prueba (opcional)
```bash
npm run db:seed
```

#### Resetear base de datos (drop + create + migrate + seed)
```bash
npm run db:reset
```

## 🎯 Scripts Disponibles

### Desarrollo
```bash
npm run dev          # Inicia servidor con nodemon (hot reload)
```

### Producción
```bash
npm run build        # Compila TypeScript → JavaScript (genera carpeta dist/)
npm start            # Inicia servidor compilado desde dist/
```

> **Nota**: La carpeta `dist/` se genera automáticamente al compilar y **no se sube a Git** (está en `.gitignore`).

### Base de Datos
```bash
npm run db:create           # Crear base de datos
npm run db:drop             # Eliminar base de datos
npm run db:migrate          # Ejecutar migraciones
npm run db:migrate:undo     # Revertir última migración
npm run db:migrate:undo:all # Revertir todas las migraciones
npm run db:seed             # Ejecutar seeders
npm run db:seed:undo        # Revertir seeders
npm run db:reset            # Reset completo (drop + create + migrate + seed)
```

### Testing
```bash
npm test             # Ejecutar tests (pendiente implementar)
```

## 📡 Endpoints API

### Base URL
```
http://localhost:5000/api
```

A continuación, se muestran los endpoints para cada caso de uso del Sistema de Gestión de Eventos "EventMaster":

### 1. Caso de uso: Crear evento
- **Crear evento:** `POST /api/eventos`

| ![Prototipo de Crear evento](images/CrearEvento.png) |
|:--:|
| *Figura 9: Prototipo de Crear evento* |    


### 2. Caso de uso: Consultar notificaciones
- **Visualizar notificaciones:** `GET /api/notifications-action`  
- **Visualizar invitaciones privadas:** `GET /api/private-invitations`  
- **Confirmar asistencia privada:** `POST /api/invitaciones/respond`  

| ![Prototipo de Consultar notificaciones](images/ConsultarNotificaciones3.png) |
|:--:|
 *Figura 10: Prototipo de Consultar notificaciones* |     


### 3. Caso de uso: Consultar eventos creados
- **Visualizar eventos gestionados:** `GET /api/events/managed`
- **Eliminar evento:** `DELETE /api/events/delete/:evento_id`

![Prototipo de Consultar eventos creados - Parte 1](images/ConsultarEventosCreados0.png) |
|:--:|
| *Figura 11: Prototipo de Consultar eventos creados - Parte 1* | 

![Prototipo de Consultar eventos creados - Parte 2](images/ConsultarEventosCreados2.png) 
|:--:|
| *Figura 12: Prototipo de Consultar eventos creados - Parte 2* |    

### 4 y 5. Caso de uso: Acceder al detalle del evento / Administrar un evento 
- **Ver detalle de evento:** `GET /api/eventos/:evento_id`
- **Invitar usuarios:** `POST /api/send-invitations/send`
- **Buscar usuarios:** `GET /api/send-invitations/search`
- **Contar invitaciones pendientes:** `GET /api/send-invitations/count/:evento_id`
- **Obtener no elegibles:** `GET /api/send-invitations/no-eligible/:evento_id`
- **Visualizar recursos:** `GET /api/visualizar-recursos/evento/:evento_id`
- **Compartir recurso:** `POST /api/compartir-recursos`
- **Eliminar recurso:** `DELETE /api/eliminar-recursos`

| ![Prototipo de Acceder al detalle del evento - Parte 1](images/DetalleYAdministrar1.png) |
|:--:|
| *Figura 13: Prototipo de Acceder al detalle del evento / Administrar un evento - Parte 1* | 

| ![Prototipo de Acceder al detalle del evento - Parte 2](images/DetalleYAdministrar2.png) |
|:--:|
| *Figura 14: Prototipo de Acceder al detalle del evento / Administrar un evento - Parte 2* | 

| ![Prototipo de Acceder al detalle del evento - Parte 3](images/DetalleYAdministrar3.png) |
|:--:|
| *Figura 15: Prototipo de Acceder al detalle del evento / Administrar un evento - Parte 3* | 

### 6. Caso de uso: Consultar eventos asistidos
- **Consultar eventos asistidos:** `GET /api/events/attended/:usuario_id`
- **Desvincularme de un evento:** `DELETE /api/eventos/:evento_id/desvincularme`

| ![Prototipo de Consultar eventos asistidos](images/ConsultarEventosAsistidos.png) |
|:--:|
| *Figura 16: Prototipo de Consultar eventos asistidos* | 


### 7. Caso de uso: Registrarse
- **Registro de Usuario:** `POST /api/auth/register`
   
| ![Prototipo](images/Registrarse.png) |  
|:--:|
| *Figura 17: Prototipo de Registrarse* | 

### 8. Caso de uso: Iniciar sesión
- **Login:** `POST /api/auth/login`
  
| ![Prototipo de Iniciar sesión](images/IniciarSesion.png) |
|:--:|
| *Figura 18: Prototipo de Iniciar sesión* | 

### 9. Caso de uso: Explorar eventos públicos
- **Explorar eventos públicos:** `GET /api/events/public`
- **Confirmar asistencia pública:** `GET /api/eventos/:evento_id/attendance/public`

| ![Prototipo de Explorar eventos públicos](images/ExplorarEventosPublicos.png) |
|:--:|
| *Figura 19: Prototipo de Explorar eventos públicos* | 

### 10 y 11. Caso de uso: Administrar perfil / Cerrar sesión
- **Ver perfil:** `GET /api/profile`
- **Editar perfil:** `PUT /api/profile`
  
| ![Prototipo de Administrar perfil / Cerrar sesión](images/AdministrarPerfilYCerrarSesion.png) |
|:--:|
| *Figura 20: Prototipo de Administrar perfil / Cerrar sesión* | 
