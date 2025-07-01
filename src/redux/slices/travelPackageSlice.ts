import api from "@/lib/axios";
import type { CreateTravelPackageData, TravelPackageFilters, TravelPackageState, UpdateTravelPackageData } from "@/types/travelPackageTypes";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState: TravelPackageState = {
  packages: [],
  currentPackage: null,
  loading: false,
  error: null,
  meta: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  },
};

// Async Thunks
export const fetchTravelPackages = createAsyncThunk("travelPackage/fetchAll", async (filters: TravelPackageFilters = {}, { rejectWithValue }) => {
  try {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, String(value));
      }
    });

    const response = await api.get(`/travel-package?${params.toString()}`);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch travel packages");
  }
});

export const fetchTravelPackageById = createAsyncThunk("travelPackage/fetchById", async (id: number, { rejectWithValue }) => {
  try {
    const response = await api.get(`/travel-package/${id}`);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch travel package");
  }
});

export const createTravelPackage = createAsyncThunk("travelPackage/create", async (packageData: CreateTravelPackageData, { rejectWithValue }) => {
  try {
    const formData = new FormData();

    // Append basic fields
    formData.append("title", packageData.title);
    formData.append("location", packageData.location);
    formData.append("description", packageData.description);
    formData.append("price", packageData.price.toString());
    formData.append("duration", packageData.duration.toString());
    formData.append("quota", packageData.quota.toString());
    formData.append("startDate", packageData.startDate);
    formData.append("endDate", packageData.endDate);

    // Append thumbnail if exists
    if (packageData.thumbnail) {
      formData.append("thumbnail", packageData.thumbnail);
    }

    // Append package images if exists
    if (packageData.packageImages && packageData.packageImages.length > 0) {
      packageData.packageImages.forEach((image) => {
        formData.append("packageImages", image);
      });
    }

    const response = await api.post("/travel-package/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to create travel package");
  }
});

export const updateTravelPackage = createAsyncThunk("travelPackage/update", async ({ id, packageData }: { id: number; packageData: UpdateTravelPackageData }, { rejectWithValue }) => {
  try {
    const formData = new FormData();

    // Append only provided fields
    Object.entries(packageData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === "thumbnail" && value instanceof File) {
          formData.append("thumbnail", value);
        } else if (key === "packageImages" && Array.isArray(value)) {
          value.forEach((image) => {
            formData.append("packageImages", image);
          });
        } else if (key !== "thumbnail" && key !== "packageImages") {
          formData.append(key, String(value));
        }
      }
    });

    const response = await api.patch(`/travel-package/update/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to update travel package");
  }
});

export const deleteTravelPackage = createAsyncThunk("travelPackage/delete", async (id: number, { rejectWithValue }) => {
  try {
    const response = await api.delete(`/travel-package/delete/${id}`);
    return { id, ...response.data };
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to delete travel package");
  }
});

// Slice
const travelPackageSlice = createSlice({
  name: "travelPackage",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentPackage: (state) => {
      state.currentPackage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all packages
      .addCase(fetchTravelPackages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTravelPackages.fulfilled, (state, action) => {
        state.loading = false;
        state.packages = action.payload.data;
        state.meta = action.payload.meta;
      })
      .addCase(fetchTravelPackages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch package by ID
      .addCase(fetchTravelPackageById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTravelPackageById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPackage = action.payload;
      })
      .addCase(fetchTravelPackageById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create package
      .addCase(createTravelPackage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTravelPackage.fulfilled, (state, action) => {
        state.loading = false;
        state.packages.unshift(action.payload);
      })
      .addCase(createTravelPackage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update package
      .addCase(updateTravelPackage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTravelPackage.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.packages.findIndex((pkg) => pkg.id === action.payload.id);
        if (index !== -1) {
          state.packages[index] = action.payload;
        }
        if (state.currentPackage?.id === action.payload.id) {
          state.currentPackage = action.payload;
        }
      })
      .addCase(updateTravelPackage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete package
      .addCase(deleteTravelPackage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTravelPackage.fulfilled, (state, action) => {
        state.loading = false;
        state.packages = state.packages.filter((pkg) => pkg.id !== action.payload.id);
        if (state.currentPackage?.id === action.payload.id) {
          state.currentPackage = null;
        }
      })
      .addCase(deleteTravelPackage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearCurrentPackage } = travelPackageSlice.actions;
export default travelPackageSlice.reducer;
