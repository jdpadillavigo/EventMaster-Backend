export type ListAttendedEventsRequestDto = {
  usuario_id: number
}

export type ListAttendedEventsResponseDto = {
  success: boolean
  eventos: Array<{
    id: number | string
    name: string
    dateStart: string
    dateEnd: string
    imageUrl?: string
  }>
}
