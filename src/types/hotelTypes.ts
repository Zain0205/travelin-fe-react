export interface Hotel {
  id: number;
  name: string;
  description: string;
  location: string;
  pricePerNight: number;
  amenities: string[];
  thumbnail?: string;
  rating?: number;
  bookings?: number;
  commission?: number;
  agentId: number;
  createdAt: string;
  updatedAt: string;
  agent: {
    id: number;
    name: string;
    email: string;
  };
  hotelImages: {
    id: number;
    fileUrl: string;
    type: string;
    hotelId: number;
  }[];
}

export interface CreateHotelData {
  name: string;
  description: string;
  location: string;
  pricePerNight: number;
  thumbnail?: File;
  hotelImages?: File[];
}

export interface HotelFilters {
  name?: string;
  location?: string;
}

export interface HotelPagination {
  page: number;
  limit: number;
}

export interface HotelState {
  hotels: Hotel[];
  currentHotel: Hotel | null;
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}