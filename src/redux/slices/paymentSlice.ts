import type { PaymentInput, PaymentState } from "@/types/paymentTypes";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/axios";


const initialState: any = {
  payments: [],
  currentPayment: null,
  paymentHistory: [],
  midtransResponse: null,
  loading: false,
  error: null,
  processingPayment: false,
  retryingPayment: false,
};

// Async thunks
export const processPayment = createAsyncThunk(
  'payment/processPayment',
  async (paymentData: PaymentInput, { rejectWithValue }) => {
    try {
      const response = await api.post('/payment', paymentData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to process payment'
      );
    }
  }
);

export const getPaymentHistory = createAsyncThunk(
  'payment/getPaymentHistory',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/payment/history');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch payment history'
      );
    }
  }
);

export const getPaymentDetails = createAsyncThunk(
  'payment/getPaymentDetails',
  async (paymentId: number, { rejectWithValue }) => {
    try {
      const response = await api.get(`/payment/${paymentId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch payment details'
      );
    }
  }
);

export const retryPayment = createAsyncThunk(
  'payment/retryPayment',
  async (
    { bookingId, paymentData }: { bookingId: number; paymentData: Omit<PaymentInput, 'bookingId'> },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post(`/payment/retry/${bookingId}`, paymentData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to retry payment'
      );
    }
  }
);

// Optional: Add transaction status check if you need it
export const checkTransactionStatus = createAsyncThunk(
  'payment/checkTransactionStatus',
  async (orderId: string, { rejectWithValue }) => {
    try {
      // You'll need to create this endpoint in your backend
      const response = await api.get(`/payment/status/${orderId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to check transaction status'
      );
    }
  }
);

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    clearPaymentError: (state) => {
      state.error = null;
    },
    clearCurrentPayment: (state) => {
      state.currentPayment = null;
    },
    clearMidtransResponse: (state) => {
      state.midtransResponse = null;
    },
    resetPaymentState: (state) => {
      state.payments = [];
      state.currentPayment = null;
      state.paymentHistory = [];
      state.midtransResponse = null;
      state.loading = false;
      state.error = null;
      state.processingPayment = false;
      state.retryingPayment = false;
    },
    setCurrentPayment: (state, action: any) => {
      state.currentPayment = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Process Payment
      .addCase(processPayment.pending, (state) => {
        state.processingPayment = true;
        state.error = null;
      })
      .addCase(processPayment.fulfilled, (state, action) => {
        state.processingPayment = false;
        state.currentPayment = action.payload.payment;
        state.midtransResponse = action.payload.midtrans;
        state.payments.push(action.payload.payment);
      })
      .addCase(processPayment.rejected, (state, action) => {
        state.processingPayment = false;
        state.error = action.payload as string;
      })

      // Get Payment History
      .addCase(getPaymentHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPaymentHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentHistory = action.payload;
      })
      .addCase(getPaymentHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Get Payment Details
      .addCase(getPaymentDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPaymentDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPayment = action.payload;
      })
      .addCase(getPaymentDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Retry Payment
      .addCase(retryPayment.pending, (state) => {
        state.retryingPayment = true;
        state.error = null;
      })
      .addCase(retryPayment.fulfilled, (state, action) => {
        state.retryingPayment = false;
        state.currentPayment = action.payload.payment;
        state.midtransResponse = action.payload.midtrans;
        // Update the payment in the history if it exists
        const index = state.paymentHistory.findIndex(
          (p: any) => p.bookingId === action.payload.payment.bookingId
        );
        if (index !== -1) {
          state.paymentHistory[index] = action.payload.payment;
        } else {
          state.paymentHistory.push(action.payload.payment);
        }
      })
      .addCase(retryPayment.rejected, (state, action) => {
        state.retryingPayment = false;
        state.error = action.payload as string;
      })

      // Check Transaction Status
      .addCase(checkTransactionStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkTransactionStatus.fulfilled, (state, action) => {
        state.loading = false;
        // You can update payment status based on the response
        // depending on your backend implementation
      })
      .addCase(checkTransactionStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearPaymentError,
  clearCurrentPayment,
  clearMidtransResponse,
  resetPaymentState,
  setCurrentPayment,
} = paymentSlice.actions;

export default paymentSlice.reducer;
