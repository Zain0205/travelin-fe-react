export interface Flight {
  id: number;
  agentId: number;
  airlineName: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  thumnail?: string;
  createdAt: string;
  agent?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface CreateFlightRequest {
  airlineName: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  price: number | string;
  thumnail?: File;
}

export interface UpdateFlightRequest extends Partial<CreateFlightRequest> {
  id: number;
}

export interface FlightFilters {
  airlineName?: string;
  origin?: string;
  destination?: string;
}

export interface FlightPagination {
  page: number;
  limit: number;
}

export interface FlightState {
  flights: Flight[];
  currentFlight: Flight | null;
  loading: boolean;
  error: string | null;
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}