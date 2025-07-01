import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import flightReducer from "./slices/flightSlice";
import travelPackageReducer from "./slices/travelPackageSlice";
import hotelReducer from "./slices/hotelSlice"; // Add this import

export const store = configureStore({
  reducer: {
    auth: authReducer,
    flight: flightReducer,
    travelPackage: travelPackageReducer,
    hotel: hotelReducer, // Add this line
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
          "hotel.hotels", // Add hotel paths
          "hotel.currentHotel",
        ],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;