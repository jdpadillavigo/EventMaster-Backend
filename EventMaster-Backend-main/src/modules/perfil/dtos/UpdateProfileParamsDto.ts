export type UpdateProfileParamsDto = {
  usuarioId: number
  correo?: string
  nombre?: string
  apellido?: string
  foto_perfil?: string | null
}