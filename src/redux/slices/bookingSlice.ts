import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import api from "@/lib/axios"; // Import your axios instance

export interface BookingItem {
  id: number;
  userId: number;
  packageId?: number;
  travelDate: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'rejected' | 'refunded';
  paymentStatus: 'unpaid' | 'paid' | 'refund_pending' | 'refunded';
  type: 'package' | 'hotel' | 'flight' | 'custom';
  bookingDate: string;
  cancelledAt?: string;
  cancellationReason?: string;
  travelPackage?: any;
  bookingHotels?: any[];
  bookingFlights?: any[];
  payments?: any[];
  reschedules?: any[];
  refund?: RefundItem;
}

export interface RefundItem {
  id: number;
  bookingId: number;
  userId: number;
  amount: number;
  originalAmount: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  refundMethod?: string;
  refundProof?: string;
  createdAt: string;
  processedAt?: string;
  processedBy?: number;
  booking?: BookingItem;
}

export interface CreateBookingData {
  type: 'package' | 'hotel' | 'flight' | 'custom';
  travelDate: string;
  packageId?: number;
  hotelBookings?: Array<{
    hotelId: number;
    checkInDate: string;
    checkOutDate: string;
    nights: number;
  }>;
  flightBookings?: Array<{
    flightId: number;
    passengerName: string;
    seatClass: string;
  }>;
}

export interface BookingQuery {
  status?: string;
  paymentStatus?: string;
  type?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface RefundQuery {
  status?: string;
  bookingType?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface CancelBookingData {
  bookingId: number;
  reason: string;
  requestRefund: boolean;
}

export interface ProcessRefundData {
  refundId: number;
  status: 'approved' | 'rejected';
  refundMethod?: string;
  refundProof?: string;
}

export interface BookingState {
  bookings: BookingItem[];
  refunds: RefundItem[];
  currentBooking: BookingItem | null;
  currentRefund: RefundItem | null;
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  refundPagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const initialState: BookingState = {
  bookings: [],
  refunds: [],
  currentBooking: null,
  currentRefund: null,
  loading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  },
  refundPagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  },
};

// Async thunks
export const createBooking = createAsyncThunk(
  'booking/createBooking',
  async (bookingData: CreateBookingData, { rejectWithValue }) => {
    console.log(bookingData)
    try {
      const response = await api.post('/booking/create', bookingData);
      return response.data;
    } catch (error: any) {
      console.log(error)
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create booking'
      );
    }
  }
);

export const getBookings = createAsyncThunk(
  'booking/getBookings',
  async (query: BookingQuery = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/booking', { params: query });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch bookings'
      );
    }
  }
);

export const getBookingById = createAsyncThunk(
  'booking/getBookingById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await api.get(`/booking/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch booking'
      );
    }
  }
);

export const updateBookingStatus = createAsyncThunk(
  'booking/updateBookingStatus',
  async ({ id, status }: { id: number; status: string }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/booking/${id}/status`, { status });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update booking status'
      );
    }
  }
);

export const cancelBooking = createAsyncThunk(
  'booking/cancelBooking',
  async (data: CancelBookingData, { rejectWithValue }) => {
    try {
      const { bookingId, ...body } = data;
      const response = await api.delete(`/booking/cancel/${bookingId}`, { data: body });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to cancel booking'
      );
    }
  }
);

export const requestRefund = createAsyncThunk(
  'booking/requestRefund',
  async (data: { bookingId: number; reason?: string }, { rejectWithValue }) => {
    try {
      const response = await api.post('/booking/refund', data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to request refund'
      );
    }
  }
);

export const getRefunds = createAsyncThunk(
  'booking/getRefunds',
  async (query: RefundQuery = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/booking/refunds', { params: query });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch refunds'
      );
    }
  }
);

export const getRefundById = createAsyncThunk(
  'booking/getRefundById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await api.get(`/booking/refund/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch refund'
      );
    }
  }
);

export const processRefund = createAsyncThunk(
  'booking/processRefund',
  async (data: ProcessRefundData, { rejectWithValue }) => {
    try {
      const { refundId, ...body } = data;
      const response = await api.put(`/booking/refund/${refundId}/process`, body);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to process refund'
      );
    }
  }
);

export const requestReschedule = createAsyncThunk(
  'booking/requestReschedule',
  async (data: { bookingId: number; requestedDate: string }, { rejectWithValue }) => {
    try {
      const response = await api.post('/booking/reschedule', data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to request reschedule'
      );
    }
  }
);

export const handleRescheduleRequest = createAsyncThunk(
  'booking/handleRescheduleRequest',
  async ({ id, approve }: { id: number; approve: boolean }, { rejectWithValue }) => {
    try {
      const endpoint = approve ? 'approve' : 'reject';
      const response = await api.put(`/booking/reschedule/${id}/${endpoint}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to handle reschedule request'
      );
    }
  }
);

// Booking slice
const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentBooking: (state) => {
      state.currentBooking = null;
    },
    clearCurrentRefund: (state) => {
      state.currentRefund = null;
    },
    setCurrentBooking: (state, action: PayloadAction<BookingItem>) => {
      state.currentBooking = action.payload;
    },
    setCurrentRefund: (state, action: PayloadAction<RefundItem>) => {
      state.currentRefund = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create booking
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings.unshift(action.payload);
        state.currentBooking = action.payload;
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Get bookings
      .addCase(getBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload.data;
        state.pagination = action.payload.meta;
      })
      .addCase(getBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Get booking by ID
      .addCase(getBookingById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBookingById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBooking = action.payload;
      })
      .addCase(getBookingById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update booking status
      .addCase(updateBookingStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBookingStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.bookings.findIndex(b => b.id === action.payload.id);
        if (index !== -1) {
          state.bookings[index] = action.payload;
        }
        if (state.currentBooking?.id === action.payload.id) {
          state.currentBooking = action.payload;
        }
      })
      .addCase(updateBookingStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Cancel booking
      .addCase(cancelBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.bookings.findIndex(b => b.id === action.payload.booking.id);
        if (index !== -1) {
          state.bookings[index].status = 'cancelled';
        }
        if (action.payload.refund) {
          state.refunds.unshift(action.payload.refund);
        }
      })
      .addCase(cancelBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Request refund
      .addCase(requestRefund.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(requestRefund.fulfilled, (state, action) => {
        state.loading = false;
        state.refunds.unshift(action.payload.refund);
        state.currentRefund = action.payload.refund;
      })
      .addCase(requestRefund.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Get refunds
      .addCase(getRefunds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRefunds.fulfilled, (state, action) => {
        state.loading = false;
        state.refunds = action.payload.data;
        state.refundPagination = action.payload.meta;
      })
      .addCase(getRefunds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Get refund by ID
      .addCase(getRefundById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRefundById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRefund = action.payload;
      })
      .addCase(getRefundById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Process refund
      .addCase(processRefund.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(processRefund.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.refunds.findIndex(r => r.id === action.payload.refund.id);
        if (index !== -1) {
          state.refunds[index] = action.payload.refund;
        }
        if (state.currentRefund?.id === action.payload.refund.id) {
          state.currentRefund = action.payload.refund;
        }
      })
      .addCase(processRefund.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Request reschedule
      .addCase(requestReschedule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(requestReschedule.fulfilled, (state, action) => {
        state.loading = false;
        // Update booking status to pending
        const index = state.bookings.findIndex(b => b.id === action.payload.reschedule.bookingId);
        if (index !== -1) {
          state.bookings[index].status = 'pending';
        }
      })
      .addCase(requestReschedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Handle reschedule request
      .addCase(handleRescheduleRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(handleRescheduleRequest.fulfilled, (state, action) => {
        state.loading = false;
        // Update booking status based on reschedule result
        // This would need the bookingId from the response
      })
      .addCase(handleRescheduleRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearError,
  clearCurrentBooking,
  clearCurrentRefund,
  setCurrentBooking,
  setCurrentRefund,
} = bookingSlice.actions;

export default bookingSlice.reducer;