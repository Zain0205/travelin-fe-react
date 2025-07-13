// store/authSlice.ts - Updated with better cookie management and get all agents
import type { AuthState, LoginCredentials, RegisterCredentials } from "@/types/authTypes";
import api from "../../lib/axios";
import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

export const registerUser = createAsyncThunk(
  "auth/register", 
  async (credentials: RegisterCredentials, { rejectWithValue }) => {
    try {
      const response = await api.post("/user/register", credentials);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Registration failed");
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login", 
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await api.post("/user/login", credentials);
      const { user, accessToken } = response.data;
      
      // Set cookie with proper options
      Cookies.set("accessToken", accessToken)
      Cookies.set("role", user.role)
      Cookies.set("userId", user.id)
      
      console.log("Login successful:", user);
      console.log("JWT set as cookie");
      
      return { user, accessToken };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logout", 
  async (_, { rejectWithValue }) => {
    try {
      await api.post("/user/logout");
      // Remove cookie
      Cookies.remove("accessToken");
      return true;
    } catch (error: any) {
      // Even if server request fails, remove cookie
      Cookies.remove("accessToken");
      return rejectWithValue(error.response?.data?.message || "Logout failed");
    }
  }
);

export const checkAuthStatus = createAsyncThunk(
  "auth/checkStatus", 
  async (_, { rejectWithValue }) => {
    try {
      const token = Cookies.get("accessToken");
      if (!token) {
        return rejectWithValue("No token found");
      }
      
      // Check if user is authenticated by calling protected endpoint
      const response = await api.get("/user/profile");
      return response.data;
    } catch (error: any) {
      // If token is invalid, remove it
      Cookies.remove("accessToken");
      return rejectWithValue("Not authenticated");
    }
  }
);

export const getAllAgents = createAsyncThunk(
  "auth/getAllAgents", 
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/user/agents");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch agents");
    }
  }
);

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  agents: [], // Add agents array to store all agents
  agentsLoading: false, // Separate loading state for agents
  agentsError: null, // Separate error state for agents
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearAgentsError: (state) => {
      state.agentsError = null;
    },
    setUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      Cookies.remove("accessToken");
    },
    // Add new reducer to sync with cookie state
    syncAuthWithCookie: (state) => {
      const token = Cookies.get("accessToken");
      if (token && !state.isAuthenticated) {
        // Token exists but user is not authenticated
        // This will trigger checkAuthStatus in the component
        state.isLoading = true;
      } else if (!token && state.isAuthenticated) {
        // No token but user is authenticated - clear auth
        state.user = null;
        state.isAuthenticated = false;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        // Still clear auth even if server request failed
        state.user = null;
        state.isAuthenticated = false;
      })
      // Auth Status Check
      .addCase(checkAuthStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null; // Don't show error for auth check failure
      })
      // Get All Agents
      .addCase(getAllAgents.pending, (state) => {
        state.agentsLoading = true;
        state.agentsError = null;
      })
      .addCase(getAllAgents.fulfilled, (state, action) => {
        state.agentsLoading = false;
        state.agents = action.payload;
        state.agentsError = null;
      })
      .addCase(getAllAgents.rejected, (state, action) => {
        state.agentsLoading = false;
        state.agentsError = action.payload as string;
      });
  },
});

export const { clearError, clearAgentsError, setUser, clearAuth, syncAuthWithCookie } = authSlice.actions;
export default authSlice.reducer;