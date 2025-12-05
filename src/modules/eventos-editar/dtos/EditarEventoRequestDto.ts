export interface EditarEventoRequestDto {
    name: string;
    date: string;
    endDate: string;
    capacity: number;
    description?: string;
    privacy?: 'public' | 'private';
    locationAddress: string;
    imageUrl: string;
    lat: number;
    lng: number;
}