import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/axios";

// Types
export interface AgentStatistics {
  totalPackages: number;
  totalHotels: number;
  totalFlights: number;
  totalBookings: number;
  totalRevenue: number;
  activePackages: number;
}

export interface AdminStatistics {
  totalBookings: number;
  totalRevenue: number;
  totalUsers: number;
  totalAgents: number;
  totalPackages: number;
  totalHotels: number;
  totalFlights: number;
  pendingBookings: number;
  completedBookings: number;
}

export interface MonthlyReport {
  month: string;
  year: number;
  totalBookings: number;
  totalRevenue: number;
  packageBookings: number;
  hotelBookings: number;
  flightBookings: number;
}

export interface PackagePerformance {
  id: number;
  title: string;
  totalBookings: number;
  totalRevenue: number;
  averageRating: number;
  totalReviews: number;
  location: string;
}

export interface AgentPerformance {
  agentId: number;
  agentName: string;
  totalPackages: number;
  totalBookings: number;
  totalRevenue: number;
  averageRating: number;
  totalReviews: number;
}

export interface DashboardState {
  // Agent Data
  agentStatistics: AgentStatistics | null;
  agentMonthlyReport: MonthlyReport[];
  agentPackages: PackagePerformance[];
  
  // Admin Data
  adminStatistics: AdminStatistics | null;
  adminMonthlyReport: MonthlyReport[];
  agentPerformances: AgentPerformance[];
  
  // Loading States
  isLoadingAgentStats: boolean;
  isLoadingAgentReport: boolean;
  isLoadingAgentPackages: boolean;
  isLoadingAdminStats: boolean;
  isLoadingAdminReport: boolean;
  isLoadingAgentPerformances: boolean;
  
  // Error States
  agentStatsError: string | null;
  agentReportError: string | null;
  agentPackagesError: string | null;
  adminStatsError: string | null;
  adminReportError: string | null;
  agentPerformancesError: string | null;
}

const initialState: DashboardState = {
  // Agent Data
  agentStatistics: null,
  agentMonthlyReport: [],
  agentPackages: [],
  
  // Admin Data
  adminStatistics: null,
  adminMonthlyReport: [],
  agentPerformances: [],
  
  // Loading States
  isLoadingAgentStats: false,
  isLoadingAgentReport: false,
  isLoadingAgentPackages: false,
  isLoadingAdminStats: false,
  isLoadingAdminReport: false,
  isLoadingAgentPerformances: false,
  
  // Error States
  agentStatsError: null,
  agentReportError: null,
  agentPackagesError: null,
  adminStatsError: null,
  adminReportError: null,
  agentPerformancesError: null,
};

// Async Thunks - Agent Actions
export const fetchAgentStatistics = createAsyncThunk(
  "dashboard/fetchAgentStatistics",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/dashboard/agent/statistics");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch agent statistics");
    }
  }
);

export const fetchAgentMonthlyReport = createAsyncThunk(
  "dashboard/fetchAgentMonthlyReport",
  async (params: { year: number; month?: number }, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append("year", params.year.toString());
      if (params.month) {
        queryParams.append("month", params.month.toString());
      }
      
      const response = await api.get(`/dashboard/agent/monthly-report?${queryParams}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch agent monthly report");
    }
  }
);

export const fetchAgentPackages = createAsyncThunk(
  "dashboard/fetchAgentPackages",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/dashboard/agent/packages");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch agent packages");
    }
  }
);

// Async Thunks - Admin Actions
export const fetchAdminStatistics = createAsyncThunk(
  "dashboard/fetchAdminStatistics",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/dashboard/admin/statistics");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch admin statistics");
    }
  }
);

export const fetchAdminMonthlyReport = createAsyncThunk(
  "dashboard/fetchAdminMonthlyReport",
  async (params: { year: number; month?: number }, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append("year", params.year.toString());
      if (params.month) {
        queryParams.append("month", params.month.toString());
      }
      
      const response = await api.get(`/dashboard/admin/monthly-report?${queryParams}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch admin monthly report");
    }
  }
);

export const fetchAgentPerformances = createAsyncThunk(
  "dashboard/fetchAgentPerformances",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/dashboard/admin/agent-performances");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch agent performances");
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    clearAgentData: (state) => {
      state.agentStatistics = null;
      state.agentMonthlyReport = [];
      state.agentPackages = [];
      state.agentStatsError = null;
      state.agentReportError = null;
      state.agentPackagesError = null;
    },
    clearAdminData: (state) => {
      state.adminStatistics = null;
      state.adminMonthlyReport = [];
      state.agentPerformances = [];
      state.adminStatsError = null;
      state.adminReportError = null;
      state.agentPerformancesError = null;
    },
    clearAllDashboardData: (state) => {
      return { ...initialState };
    },
    clearErrors: (state) => {
      state.agentStatsError = null;
      state.agentReportError = null;
      state.agentPackagesError = null;
      state.adminStatsError = null;
      state.adminReportError = null;
      state.agentPerformancesError = null;
    },
  },
  extraReducers: (builder) => {
    // Agent Statistics
    builder
      .addCase(fetchAgentStatistics.pending, (state) => {
        state.isLoadingAgentStats = true;
        state.agentStatsError = null;
      })
      .addCase(fetchAgentStatistics.fulfilled, (state, action) => {
        state.isLoadingAgentStats = false;
        state.agentStatistics = action.payload;
        state.agentStatsError = null;
      })
      .addCase(fetchAgentStatistics.rejected, (state, action) => {
        state.isLoadingAgentStats = false;
        state.agentStatsError = action.payload as string;
      });

    // Agent Monthly Report
    builder
      .addCase(fetchAgentMonthlyReport.pending, (state) => {
        state.isLoadingAgentReport = true;
        state.agentReportError = null;
      })
      .addCase(fetchAgentMonthlyReport.fulfilled, (state, action) => {
        state.isLoadingAgentReport = false;
        state.agentMonthlyReport = action.payload;
        state.agentReportError = null;
      })
      .addCase(fetchAgentMonthlyReport.rejected, (state, action) => {
        state.isLoadingAgentReport = false;
        state.agentReportError = action.payload as string;
      });

    // Agent Packages
    builder
      .addCase(fetchAgentPackages.pending, (state) => {
        state.isLoadingAgentPackages = true;
        state.agentPackagesError = null;
      })
      .addCase(fetchAgentPackages.fulfilled, (state, action) => {
        state.isLoadingAgentPackages = false;
        state.agentPackages = action.payload;
        state.agentPackagesError = null;
      })
      .addCase(fetchAgentPackages.rejected, (state, action) => {
        state.isLoadingAgentPackages = false;
        state.agentPackagesError = action.payload as string;
      });

    // Admin Statistics
    builder
      .addCase(fetchAdminStatistics.pending, (state) => {
        state.isLoadingAdminStats = true;
        state.adminStatsError = null;
      })
      .addCase(fetchAdminStatistics.fulfilled, (state, action) => {
        state.isLoadingAdminStats = false;
        state.adminStatistics = action.payload;
        state.adminStatsError = null;
      })
      .addCase(fetchAdminStatistics.rejected, (state, action) => {
        state.isLoadingAdminStats = false;
        state.adminStatsError = action.payload as string;
      });

    // Admin Monthly Report
    builder
      .addCase(fetchAdminMonthlyReport.pending, (state) => {
        state.isLoadingAdminReport = true;
        state.adminReportError = null;
      })
      .addCase(fetchAdminMonthlyReport.fulfilled, (state, action) => {
        state.isLoadingAdminReport = false;
        state.adminMonthlyReport = action.payload;
        state.adminReportError = null;
      })
      .addCase(fetchAdminMonthlyReport.rejected, (state, action) => {
        state.isLoadingAdminReport = false;
        state.adminReportError = action.payload as string;
      });

    // Agent Performances
    builder
      .addCase(fetchAgentPerformances.pending, (state) => {
        state.isLoadingAgentPerformances = true;
        state.agentPerformancesError = null;
      })
      .addCase(fetchAgentPerformances.fulfilled, (state, action) => {
        state.isLoadingAgentPerformances = false;
        state.agentPerformances = action.payload;
        state.agentPerformancesError = null;
      })
      .addCase(fetchAgentPerformances.rejected, (state, action) => {
        state.isLoadingAgentPerformances = false;
        state.agentPerformancesError = action.payload as string;
      });
  },
});

export const {
  clearAgentData,
  clearAdminData,
  clearAllDashboardData,
  clearErrors,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;