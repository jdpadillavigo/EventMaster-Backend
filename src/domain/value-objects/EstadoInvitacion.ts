// Estados de invitación según la tabla EstadoInvitacion en la DB
export enum EstadoInvitacionEnum {
    PENDIENTE = "Pendiente",
    ACEPTADA = "Aceptada",
    RECHAZADA = "Rechazada"
}

// Tipo para usuarios no elegibles
export enum TipoNoElegible {
    PENDIENTE = "pendiente",
    PARTICIPANTE = "participante"
}
