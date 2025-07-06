import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/axios"; // Your axios instance
import type { CreateHotelData, HotelFilters, HotelPagination } from "@/types/hotelTypes";

const initialState: any = {
  hotels: [],
  currentHotel: {},
  loading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  },
};

export const fetchHotels = createAsyncThunk("hotel/fetchHotels", async (params: { pagination?: HotelPagination; filters?: HotelFilters }) => {
  const { pagination = { page: 1, limit: 10 }, filters = {} } = params;

  const queryParams = new URLSearchParams({
    page: pagination.page.toString(),
    limit: pagination.limit.toString(),
    ...(filters.name && { name: filters.name }),
    ...(filters.location && { location: filters.location }),
  });

  const response = await api.get(`/hotel?${queryParams}`);
  return response.data;
});

export const fetchHotelById = createAsyncThunk("hotel/fetchHotelById", async (id: number) => {
  const response = await api.get(`/hotel/${id}`);
  return response.data;
});

export const createHotel = createAsyncThunk("hotel/createHotel", async (hotelData: CreateHotelData) => {
  const formData = new FormData();

  formData.append("name", hotelData.name);
  formData.append("description", hotelData.description);
  formData.append("location", hotelData.location);
  formData.append("pricePerNight", hotelData.pricePerNight.toString());

  if (hotelData.thumbnail) {
    formData.append("thumbnail", hotelData.thumbnail);
  }

  if (hotelData.hotelImages) {
    hotelData.hotelImages.forEach((image) => {
      formData.append("hotelImages", image);
    });
  }

  const response = await api.post("/hotel/create", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
});

export const updateHotel = createAsyncThunk("hotel/updateHotel", async ({ id, hotelData }: { id: number; hotelData: Partial<CreateHotelData> }) => {
  const formData = new FormData();

  if (hotelData.name) formData.append("name", hotelData.name);
  if (hotelData.description) formData.append("description", hotelData.description);
  if (hotelData.location) formData.append("location", hotelData.location);
  if (hotelData.pricePerNight) formData.append("pricePerNight", hotelData.pricePerNight.toString());

  if (hotelData.thumbnail) {
    formData.append("thumbnail", hotelData.thumbnail);
  }

  if (hotelData.hotelImages) {
    hotelData.hotelImages.forEach((image) => {
      formData.append("hotelImages", image);
    });
  }

  const response = await api.patch(`/hotel/update/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
});

export const deleteHotel = createAsyncThunk("hotel/deleteHotel", async (id: number) => {
  await api.delete(`/hotel/delete/${id}`);
  return id;
});

const hotelSlice = createSlice({
  name: "hotel",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentHotel: (state) => {
      state.currentHotel = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch hotels
      .addCase(fetchHotels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHotels.fulfilled, (state, action) => {
        state.loading = false;
        state.hotels = action.payload.data;
        state.pagination = action.payload.meta;
      })
      .addCase(fetchHotels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch hotels";
      })

      // Fetch hotel by ID
      .addCase(fetchHotelById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHotelById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentHotel = action.payload;
      })
      .addCase(fetchHotelById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch hotel";
      })

      // Create hotel
      .addCase(createHotel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createHotel.fulfilled, (state, action) => {
        state.loading = false;
        state.hotels.unshift(action.payload);
      })
      .addCase(createHotel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create hotel";
      })

      // Update hotel
      .addCase(updateHotel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateHotel.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.hotels.findIndex((hotel: any) => hotel.id === action.payload.id);
        if (index !== -1) {
          state.hotels[index] = action.payload;
        }
        if (state.currentHotel?.id === action.payload.id) {
          state.currentHotel = action.payload;
        }
      })
      .addCase(updateHotel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update hotel";
      })

      // Delete hotel
      .addCase(deleteHotel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteHotel.fulfilled, (state, action) => {
        state.loading = false;
        state.hotels = state.hotels.filter((hotel: any) => hotel.id !== action.payload);
        if (state.currentHotel?.id === action.payload) {
          state.currentHotel = null;
        }
      })
      .addCase(deleteHotel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete hotel";
      });
  },
});

export const { clearError, clearCurrentHotel } = hotelSlice.actions;
export default hotelSlice.reducer;
