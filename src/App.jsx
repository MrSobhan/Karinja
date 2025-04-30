import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { AuthProvider }  from "@/context/authContext";

import HomePage from "./pages/Home";
import Login from "./pages/Login";
import Singup from "./pages/Singup";

import DevAuth from "@/components/DevAuth";


// ? DashboardAdmin

import PAdminPrivate from "@/components/DashboardAdmin/Private/PAdminPrivate";
import MainDashboard from "./pages/DashboardAdmin/MainDashboard";

import Dashboard from "@/components/DashboardAdmin/Dashboard";
import Users from "@/components/DashboardAdmin/Users";

import "./App.css";


export default function App() {

  // ? Routes Project


  const routes = [
    { path: "/", element: <HomePage /> },
    { path: "/login", element: <Login /> },
    { path: "/singup", element: <Singup /> },
    {
      path: "/dashboard/*",
      element: (
        <PAdminPrivate>
          <MainDashboard />
        </PAdminPrivate>
      ),
      children: [
        { path: "", element: <Dashboard /> },
        { path: "users", element: <Users /> }
      ],
    },
  ]

  const router = createBrowserRouter(routes)


  return (
    <AuthProvider>
      <DevAuth>
        <RouterProvider router={router} />
      </DevAuth>
    </AuthProvider>
  );
}