export interface EmergencyResponse {
    message: string;
    data: EmergencyObjects
}

export interface EmergencyObjects {
    name: string;
    distance: number;
    phoneNumber: string;
    address: string;
    lat: number;
    lng: number;
}