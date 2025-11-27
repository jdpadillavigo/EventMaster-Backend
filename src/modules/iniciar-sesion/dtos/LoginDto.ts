export type LoginParamsDto = {
  correo: string
  clave: string
}

export type LoginResultDto = {
  success: boolean
  user: {
    usuario_id: number
    correo: string
    nombre: string | null
    apellido: string | null
    foto_perfil: string | null
  }
  token?: string
  message?: string
}
