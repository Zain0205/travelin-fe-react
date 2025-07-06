export interface TravelPackage {
  id: number;
  title: string;
  location: string;
  description: string;
  price: number;
  duration: number;
  quota: number;
  startDate: string;
  endDate: string;
  thumbnail?: string;
  agentId: number;
  createdAt: string;
  updatedAt: string;
  agent: {
    id: number;
    name: string;
    email: string;
  };
  images: Array<{
    id: number;
    fileUrl: string;
    type: string;
    packageId: number;
  }>;
  packageImages:[]
}

export interface CreateTravelPackageData {
  title: string;
  location: string;
  description: string;
  price: number;
  duration: number;
  quota: number;
  startDate: string;
  endDate: string;
  thumbnail?: File;
  packageImages?: File[];
}

export interface UpdateTravelPackageData {
  title?: string;
  location?: string;
  description?: string;
  price?: number;
  duration?: number;
  quota?: number;
  startDate?: string;
  endDate?: string;
  thumbnail?: File;
  packageImages?: File[];
}

export interface TravelPackageFilters {
  page?: number;
  limit?: number;
  title?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  minDuration?: number;
  maxDuration?: number;
  agentId?: number;
  startDate?: string;
  endDate?: string;
}

export interface TravelPackageState {
  packages: TravelPackage[];
  currentPackage: TravelPackage | null;
  loading: boolean;
  error: string | null;
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}