import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import flightReducer from "./slices/flightSlice";
import travelPackageReducer from "./slices/travelPackageSlice";
import hotelReducer from "./slices/hotelSlice";
import bookingReducer from "./slices/bookingSlice";
import paymentReducer from "./slices/paymentSlice";
import chatReducer from "./slices/chatSlice";
import dashboardReducer from "./slices/dashboardSlice";
import reviewsTestimonialsReducer from "./slices/reviewsTestimonialsSlice"; // Add this import

export const store = configureStore({
  reducer: {
    auth: authReducer,
    flight: flightReducer,
    travelPackage: travelPackageReducer,
    hotel: hotelReducer,
    booking: bookingReducer,
    payment: paymentReducer,
    chat: chatReducer,
    dashboard: dashboardReducer,
    reviewsTestimonials: reviewsTestimonialsReducer, // Add this line
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
        ignoredPaths: [
          "flight.currentFlight.departureTime", 
          "flight.currentFlight.arrivalTime",
          "travelPackage.packages",
          "travelPackage.currentPackage",
          "hotel.hotels",
          "hotel.currentHotel",
          "booking.bookings",
          "booking.refunds",
          "booking.currentBooking",
          "booking.currentRefund",
          "payment.payments",
          "payment.currentPayment",
          "payment.paymentHistory",
          "payment.midtransResponse",
          "chat.messages",
          "chat.chatList",
          "chat.currentChatHistory",
          "dashboard.agentStatistics",
          "dashboard.adminStatistics",
          "dashboard.agentMonthlyReport",
          "dashboard.adminMonthlyReport",
          "dashboard.agentPackages",
          "dashboard.agentPerformances",
          "reviewsTestimonials.reviews", // Add reviewsTestimonials paths
          "reviewsTestimonials.userReviews",
          "reviewsTestimonials.currentReviewList",
          "reviewsTestimonials.testimonials",
          "reviewsTestimonials.userTestimonials",
        ],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;