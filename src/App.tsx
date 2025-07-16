import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import AdminDashboard from "./pages/dashboard/admin/AdminDashboard";
import AgentDashboard from "./pages/dashboard/agent/AgentDashboard";
import LandingPage from "./pages/landing-page/LandingPage";
import AgentTravelPackage from "./pages/dashboard/agent/AgentTravelPackage";
import LayoutWrapper from "./pages/dashboard/components/LayoutWrapper";
import AdminSidebar from "./pages/dashboard/components/AdminSidebar";
import AgentSidebar from "./pages/dashboard/components/AgentSidebar";
import AgentFlight from "./pages/dashboard/agent/AgentFlight";
import AddFlight from "./pages/dashboard/agent/AddFlight";
import AddPackage from "./pages/dashboard/agent/AddPackage";
import AgentHotel from "./pages/dashboard/agent/AgentHotel";
import AddHotel from "./pages/dashboard/agent/AddHotel";
import EditFlight from "./pages/dashboard/agent/EditFlight";
import EditPackage from "./pages/dashboard/agent/EditPackage";
import EditHotel from "./pages/dashboard/agent/EditHotel";
import FlightListing from "./pages/flight/FlightListing";
import FLightDetail from "./pages/flight/FLightDetail";
import HotelListing from "./pages/hotel/HotelListing";
import HotelDetail from "./pages/hotel/HotelDetail";
import PackageListing from "./pages/package/PackageListing";
import PackageDetail from "./pages/package/PackageDetail";
import BookingForm from "./pages/bookings/BookingForm";
import AgentBooking from "./pages/dashboard/agent/AgentBooking";
import CustomerProfile from "./pages/profile/CustomerProfile";
import ChatPages from "./pages/chat/ChatPages";
import AgentManagement from "./pages/dashboard/admin/AgentManagement";
import PaymentSuccess from "./pages/bookings/PaymentSuccess";
import { VerifiedIcon } from "lucide-react";
import Verification from "./pages/auth/Verification";
import AdminAnalytics from "./pages/dashboard/admin/AdminAnalytics";

let router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },

  {
    path: "/admin",
    element: <LayoutWrapper sidebar={<AdminSidebar />} />,
    children: [
      {
        index: true,
        element: (
          <Navigate
            to="/admin/dashboard"
            replace
          />
        ),
      },
      { path: "dashboard", element: <AdminDashboard /> },
      { path: "agents", element: <AgentManagement /> },
      { path: "bookings", element: <AgentBooking /> },
      { path: "packages", element: <AgentTravelPackage /> },
      { path: "packages/add", element: <AddPackage /> },
      { path: "packages/edit/:id", element: <EditPackage /> },
      { path: "flights", element: <AgentFlight /> },
      { path: "flights/add", element: <AddFlight /> },
      { path: "flights/edit/:id", element: <EditFlight /> },
      { path: "hotels", element: <AgentHotel /> },
      { path: "hotels/add", element: <AddHotel /> },
      { path: "hotels/edit/:id", element: <EditHotel /> },
      { path: "analytics", element: <AdminAnalytics /> },
    ],
  },
  {
    path: "/agent",
    element: <LayoutWrapper sidebar={<AgentSidebar />} />,
    children: [
      {
        index: true,
        element: (
          <Navigate
            to="/agent/dashboard"
            replace
          />
        ),
      },
      { path: "dashboard", element: <AgentDashboard /> },
      { path: "packages", element: <AgentTravelPackage /> },
      { path: "packages/add", element: <AddPackage /> },
      { path: "packages/edit/:id", element: <EditPackage /> },
      { path: "flights", element: <AgentFlight /> },
      { path: "flights/add", element: <AddFlight /> },
      { path: "flights/edit/:id", element: <EditFlight /> },
      { path: "hotels", element: <AgentHotel /> },
      { path: "hotels/add", element: <AddHotel /> },
      { path: "hotels/edit/:id", element: <EditHotel /> },
      { path: "bookings", element: <AgentBooking /> },
      { path: "chat/:receiverId", element: <ChatPages /> },
    ],
  },
  {
    path: "/flight/listing",
    element: <FlightListing />,
  },
  {
    path: "/flight/detail/:id",
    element: <FLightDetail />,
  },
  {
    path: "/hotel/listing",
    element: <HotelListing />,
  },
  {
    path: "/hotel/detail/:id",
    element: <HotelDetail />,
  },
  {
    path: "/package/listing",
    element: <PackageListing />,
  },
  {
    path: "/package/detail/:id",
    element: <PackageDetail />,
  },
  {
    path: "/booking/:type/:id",
    element: <BookingForm />,
  },
  {
    path: "/profile",
    element: <CustomerProfile />,
  },
  {
    path: "/chat/:receiverId",
    element: <ChatPages />,
  },
  {
    path: "/payment/callback",
    element: <PaymentSuccess />,
  },
  {
    path: "/verification/:token",
    element: <Verification />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
