export type ProfileResultDto = {
  success: boolean
  user: {
    usuario_id: number
    correo: string
    nombre: string | null
    apellido: string | null
    foto_perfil: string | null
  }
}