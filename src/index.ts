import express, { Express } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import { InvitacionController } from "./modules/envio-invitaciones/controllers/InvitacionController";
import { VerParticipantesController } from "./modules/ver-participantes/controllers/VerParticipantesController";
import { ConfirmarInvitacionController } from "./modules/confirmar-invitacion/controllers/ConfirmarInvitacionController";
import { VerDetalleController } from "./modules/ver-detalle/controllers/VerDetalleController";
import { ConfirmarPublicoController } from "./modules/confirmar-publico/controllers/ConfirmarPublicoController";
import { VerInvitacionesPrivadasController } from "./modules/ver-invitaciones-privadas/controllers/VerInvitacionesPrivadasController";
import { RegistrarseController } from "./modules/registrarse/controllers/RegistrarseController";
import { ActivarCuentaController } from "./modules/activar-cuenta/controllers/ActivarCuentaController";
import { CreateEventoController } from "./modules/eventos-crear/controllers/CreateEventoController";
import { PublicEventsController } from "./modules/eventos-publicos/controllers/PublicEventsController";
import { ManagedEventsController } from "./modules/eventos-gestionados/controllers/ManagedEventsController";
import { AttendedEventsController } from "./modules/eventos-asistidos/controllers/AttendedEventsController";
import { AuthController } from "./modules/iniciar-sesion/controllers/AuthController";
import { EliminarEventoController } from "./modules/eventos-eliminar/controllers/EliminarEventoController";
import { DesvincularEventoController } from "./modules/desvincular-evento/controllers/DesvincularEventoController";;

const db = require("./infrastructure/database/models");

dotenv.config();

const app: Express = express();

// CORS
const allowedOrigins = [
  "https://evento-maestro.netlify.app",
  "http://localhost:5173",
  "http://localhost:3000",
];

if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

console.log("🔐 CORS configurado para los siguientes orígenes:", allowedOrigins);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.log("❌ Origen bloqueado por CORS:", origin);
        callback(new Error("No permitido por CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    exposedHeaders: ["Content-Length", "X-JSON"],
    maxAge: 86400,
  })
);

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("assets"));

const port = process.env.PORT || 5000;

// Routers (orden importante)
const registrarseController = new RegistrarseController();
app.use(registrarseController.getPath(), registrarseController.getRouter());

const activarCuentaController = new ActivarCuentaController();
app.use(activarCuentaController.getPath(), activarCuentaController.getRouter());

const invitacionController = new InvitacionController();
app.use(invitacionController.getPath(), invitacionController.getRouter());

const confirmarPublicoController = new ConfirmarPublicoController();
app.use(confirmarPublicoController.getPath(), confirmarPublicoController.getRouter());

const verParticipantesController = new VerParticipantesController();
app.use(verParticipantesController.getPath(), verParticipantesController.getRouter());

const confirmarInvitacionController = new ConfirmarInvitacionController();
app.use(confirmarInvitacionController.getPath(), confirmarInvitacionController.getRouter());

const createEventoController = new CreateEventoController();
app.use(createEventoController.getPath(), createEventoController.getRouter());

const publicEventsController = new PublicEventsController();
app.use(publicEventsController.getPath(), publicEventsController.getRouter());

const managedEventsController = new ManagedEventsController();
app.use(managedEventsController.getPath(), managedEventsController.getRouter());

const attendedEventsController = new AttendedEventsController();
app.use(attendedEventsController.getPath(), attendedEventsController.getRouter());

const verInvitacionesPrivadasController = new VerInvitacionesPrivadasController();
app.use(verInvitacionesPrivadasController.getPath(), verInvitacionesPrivadasController.getRouter());

const authController = new AuthController();
app.use(authController.getPath(), authController.getRouter());

// ⬇️ Deja VerDetalle al FINAL para que no capture /api/eventos/publicos ni otras rutas estáticas
const verDetalleController = new VerDetalleController();
app.use(verDetalleController.getPath(), verDetalleController.getRouter());

// Start DB + server
const startServer = async () => {
  try {
    console.log("🔄 Iniciando conexión a la base de datos...");
    console.log("🔧 NODE_ENV:", process.env.NODE_ENV);
    console.log("🔧 DATABASE_URL presente:", !!process.env.DATABASE_URL);

    await db.sequelize.authenticate();
    console.log("✅ Conexión a la base de datos establecida correctamente");

    await db.sequelize.sync({ alter: false });
    console.log("✅ Modelos sincronizados con la base de datos");

    app.listen(port, () => {
      console.log(`✅ [Server]: Servidor ejecutandose en puerto ${port}`);
    });
  } catch (error) {
    console.error("❌ Error al conectar con la base de datos:", error);
    console.error("❌ Detalles del error:", JSON.stringify(error, null, 2));
    process.exit(1);
  }
};

console.log("🚀 Iniciando aplicación...");
startServer();

// Errores no capturados
process.on("uncaughtException", (error) => {
  console.error("❌ Uncaught Exception:", error);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Rejection at:", promise, "reason:", reason);
});


const eliminarEventoController = new EliminarEventoController();
app.use(eliminarEventoController.getPath(), eliminarEventoController.getRouter());

const desvincularEventoController = new DesvincularEventoController();
app.use(desvincularEventoController.getPath(), desvincularEventoController.getRouter());
