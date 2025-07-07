
// Types
export interface PaymentInput {
  bookingId: number;
  method: string;
  amount: number;
  proofUrl?: string;
}

interface MidtransResponse {
  token: string;
  redirectUrl: string;
}

interface Payment {
  id: number;
  bookingId: number;
  method: string;
  amount: number;
  paymentDate: string | null;
  proofUrl: string | null;
  createdAt: string;
  updatedAt: string;
  booking?: any; // Include booking details when needed
}

export interface PaymentState {
  payments: Payment[];
  currentPayment: Payment | null;
  paymentHistory: Payment[];
  midtransResponse: MidtransResponse | null;
  loading: boolean;
  error: string | null;
  processingPayment: boolean;
  retryingPayment: boolean;
}

