import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import api from "../../lib/axios";
import type { CreateFlightRequest, FlightFilters, FlightPagination, FlightState, UpdateFlightRequest } from "@/types/flightTypes";
import Cookies from "js-cookie";

// Helper function to check if user is authenticated
const checkAuthStatus = () => {
  // You can adjust this based on how you store auth state
  // This could check localStorage, Redux state, or make a quick API call
  const token = Cookies.get("accessToken");
  console.log(`tokennn ${token}`)
  return !!token;
};

export const fetchFlights = createAsyncThunk(
  "flight/fetchFlights", 
  async (params: { pagination: FlightPagination; filters: FlightFilters }, { rejectWithValue }) => {
    try {
      console.log("Fetching flights with params:", params);
      const { pagination, filters } = params;
      const queryParams = new URLSearchParams();

      queryParams.append("page", pagination.page.toString());
      queryParams.append("limit", pagination.limit.toString());

      if (filters.airlineName) queryParams.append("airlineName", filters.airlineName);
      if (filters.origin) queryParams.append("origin", filters.origin);
      if (filters.destination) queryParams.append("destination", filters.destination);

      console.log("Query params:", queryParams.toString());
      const response = await api.get(`/flight?${queryParams.toString()}`);
      console.log("Fetch flights response:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Fetch flights error:", error);
      console.error("Error response:", error.response?.data);
      return rejectWithValue(error.response?.data?.message || error.message || "Failed to fetch flights");
    }
  }
);

export const fetchFlightById = createAsyncThunk(
  "flight/fetchFlightById", 
  async (id: number, { rejectWithValue }) => {
    try {
      console.log("Fetching flight by ID:", id);
      const response = await api.get(`/flight/${id}`);
      console.log("Fetch flight by ID response:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Fetch flight by ID error:", error);
      console.error("Error response:", error.response?.data);
      return rejectWithValue(error.response?.data?.message || error.message || "Failed to fetch flight");
    }
  }
);

export const createFlight = createAsyncThunk(
  "flight/createFlight", 
  async (flightData: CreateFlightRequest, { rejectWithValue }) => {
    try {
      // Check authentication before making the request
      // if (!checkAuthStatus()) {
      //   return rejectWithValue("Authentication required. Please log in.");
      // }

      const formData = new FormData();

      formData.append("airlineName", flightData.airlineName);
      formData.append("origin", flightData.origin);
      formData.append("destination", flightData.destination);
      formData.append("departureTime", flightData.departureTime);
      formData.append("arrivalTime", flightData.arrivalTime);
      formData.append("price", flightData.price.toString());

      if (flightData.thumnail) {
        formData.append("thumbnail", flightData.thumnail);
      }

      const response = await api.post("/flight/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      return response.data;
    } catch (error: any) {
      console.error("Create flight error:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      
      // Handle specific error cases
      if (error.response?.status === 401) {
        return rejectWithValue("Authentication failed. Please log in again.");
      }
      
      if (error.response?.status === 403) {
        return rejectWithValue("You don't have permission to create flights.");
      }
      
      return rejectWithValue(error.response?.data?.message || error.message || "Failed to create flight");
    }
  }
);

export const updateFlight = createAsyncThunk(
  "flight/updateFlight", 
  async (updateData: UpdateFlightRequest, { rejectWithValue }) => {
    try {
      // Check authentication before making the request
      // if (!checkAuthStatus()) {
      //   return rejectWithValue("Authentication required. Please log in.");
      // }

      console.log("Updating flight with data:", updateData);
      const { id, ...flightData } = updateData;
      const formData = new FormData();

      Object.entries(flightData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          // Fixed typo: thumnail -> thumbnail
          if (key === "thumbnail" && value instanceof File) {
            formData.append("thumbnail", value);
            console.log("Thumbnail file added for update:", value.name);
          } else if (key !== "thumbnail") {
            formData.append(key, value.toString());
          }
        }
      });

      // Log FormData contents
      console.log("Update FormData contents:");
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }

      const response = await api.patch(`/flight/update/${id}`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      console.log("Update flight response:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Update flight error:", error);
      console.error("Error response:", error.response?.data);
      
      // Handle specific error cases
      if (error.response?.status === 401) {
        return rejectWithValue("Authentication failed. Please log in again.");
      }
      
      if (error.response?.status === 403) {
        return rejectWithValue("You don't have permission to update this flight.");
      }
      
      return rejectWithValue(error.response?.data?.message || error.message || "Failed to update flight");
    }
  }
);

export const deleteFlight = createAsyncThunk(
  "flight/deleteFlight", 
  async (id: number, { rejectWithValue }) => {
    try {
      // Check authentication before making the request
      // if (!checkAuthStatus()) {
      //   return rejectWithValue("Authentication required. Please log in.");
      // }

      await api.delete(`/flight/delete/${id}`, {
        withCredentials: true
      });
      return id;
    } catch (error: any) {
      console.error("Delete flight error:", error);
      console.error("Error response:", error.response?.data);
      
      // Handle specific error cases
      if (error.response?.status === 401) {
        return rejectWithValue("Authentication failed. Please log in again.");
      }
      
      if (error.response?.status === 403) {
        return rejectWithValue("You don't have permission to delete this flight.");
      }
      
      return rejectWithValue(error.response?.data?.message || error.message || "Failed to delete flight");
    }
  }
);

// Initial State
const initialState: FlightState = {
  flights: [],
  currentFlight: null,
  loading: false,
  error: null,
  meta: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  },
};

// Slice
const flightSlice = createSlice({
  name: "flight",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentFlight: (state) => {
      state.currentFlight = null;
    },
    setFilters: (state, action) => {
      console.log("Setting filters:", action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Flights
      .addCase(fetchFlights.pending, (state) => {
        console.log("Fetch flights pending");
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFlights.fulfilled, (state, action) => {
        console.log("Fetch flights fulfilled:", action.payload);
        state.loading = false;
        state.flights = action.payload.data || action.payload;
        state.meta = action.payload.meta || {
          total: action.payload.length || 0,
          page: 1,
          limit: 10,
          totalPages: 1,
        };
      })
      .addCase(fetchFlights.rejected, (state, action) => {
        console.log("Fetch flights rejected:", action.payload);
        state.loading = false;
        state.error = action.payload as string || "Failed to fetch flights";
      })

      // Fetch Flight by ID
      .addCase(fetchFlightById.pending, (state) => {
        console.log("Fetch flight by ID pending");
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFlightById.fulfilled, (state, action) => {
        console.log("Fetch flight by ID fulfilled:", action.payload);
        state.loading = false;
        state.currentFlight = action.payload.data || action.payload;
      })
      .addCase(fetchFlightById.rejected, (state, action) => {
        console.log("Fetch flight by ID rejected:", action.payload);
        state.loading = false;
        state.error = action.payload as string || "Failed to fetch flight";
      })

      // Create Flight
      .addCase(createFlight.pending, (state) => {
        console.log("Create flight pending");
        state.loading = true;
        state.error = null;
      })
      .addCase(createFlight.fulfilled, (state, action) => {
        console.log("Create flight fulfilled:", action.payload);
        state.loading = false;
        const newFlight = action.payload.data || action.payload;
        state.flights.unshift(newFlight);
        state.meta.total += 1;
      })
      .addCase(createFlight.rejected, (state, action) => {
        console.log("Create flight rejected:", action.payload);
        state.loading = false;
        state.error = action.payload as string || "Failed to create flight";
      })

      // Update Flight
      .addCase(updateFlight.pending, (state) => {
        console.log("Update flight pending");
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFlight.fulfilled, (state, action) => {
        console.log("Update flight fulfilled:", action.payload);
        state.loading = false;
        const updatedFlight = action.payload.data || action.payload;
        const index = state.flights.findIndex((flight) => flight.id === updatedFlight.id);
        if (index !== -1) {
          state.flights[index] = updatedFlight;
        }
        if (state.currentFlight?.id === updatedFlight.id) {
          state.currentFlight = updatedFlight;
        }
      })
      .addCase(updateFlight.rejected, (state, action) => {
        console.log("Update flight rejected:", action.payload);
        state.loading = false;
        state.error = action.payload as string || "Failed to update flight";
      })

      // Delete Flight
      .addCase(deleteFlight.pending, (state) => {
        console.log("Delete flight pending");
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFlight.fulfilled, (state, action) => {
        console.log("Delete flight fulfilled:", action.payload);
        state.loading = false;
        state.flights = state.flights.filter((flight) => flight.id !== action.payload);
        if (state.currentFlight?.id === action.payload) {
          state.currentFlight = null;
        }
        state.meta.total = Math.max(0, state.meta.total - 1);
      })
      .addCase(deleteFlight.rejected, (state, action) => {
        console.log("Delete flight rejected:", action.payload);
        state.loading = false;
        state.error = action.payload as string || "Failed to delete flight";
      });
  },
});

export const { clearError, clearCurrentFlight, setFilters } = flightSlice.actions;
export default flightSlice.reducer;