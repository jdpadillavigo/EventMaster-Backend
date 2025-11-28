export type ListPublicEventsResponseDto = {
  success: boolean
  eventos: Array<{
    id: number | string
    name: string
    dateStart: string
    dateEnd: string
    imageUrl?: string
    attendeesCount: number
    location: string
  }>
}
