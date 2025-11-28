export type ListManagedEventsRequestDto = {
  usuario_id: number
}

export type ListManagedEventsResponseDto = {
  success: boolean
  eventos: Array<{
    id: number | string
    name: string
    dateStart: string
    dateEnd: string
    imageUrl?: string
    capacity?: number
  }>
}
