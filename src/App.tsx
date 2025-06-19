import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Login from "./pages/auth/Login"
import Register from "./pages/auth/Register"
import AdminDashboard from "./pages/dashboard/AdminDashboard"
import AgentDashboard from "./pages/dashboard/AgentDashboard"
import LandingPage from "./pages/landing-page/LandingPage"


let router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/register",
    element: <Register />
  },
  {
    path: "/dashboard/admin",
    element: <AdminDashboard />
  },
  {
    path: "/dashboard/agent",
    element: <AgentDashboard />
  },
])

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
