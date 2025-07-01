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
      { path: "/admin/dashboard", element: <AdminDashboard /> },
    ],
  },
  {
    path: "/agent",
    element: <LayoutWrapper sidebar={<AgentSidebar />} />,
    children: [
      { path: "dashboard", element: <AgentDashboard /> },
      { path: "packages", element: <AgentTravelPackage /> },
      { path: "packages/add", element: <AddPackage /> },
      { path: "packages/edit/:id", element: <EditPackage /> },
      { path: "flights", element: <AgentFlight /> },
      { path: "flights/add", element: <AddFlight /> },
      { path: "flights/edit/:id", element: <EditFlight /> },
      { path: "hotels", element: <AgentHotel /> },
      { path: "hotels/add", element: <AddHotel /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
