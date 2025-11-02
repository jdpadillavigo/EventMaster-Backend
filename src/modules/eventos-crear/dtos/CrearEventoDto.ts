export type CrearEventoDto = {
  name: string
  date: string
  capacity: number
  description?: string
  privacy?: 'public' | 'private'
  ownerId: number
  locationAddress: string
  imageUrl: string
  lat: number
  lng: number
}
