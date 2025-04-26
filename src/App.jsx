import React, { useState, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import AuthContext from "@/context/authContext";

import HomePage from "./pages/Home";
import Login from "./pages/Login";
import Singup from "./pages/Singup";

import DevAuth from "@/components/DevAuth";
import Dashboard from "./pages/Dashboard/Dashboard";

import "./App.css";

export default function App() {
  const routes = [
    { path: "/", element: <HomePage /> },
    { path: "/login", element: <Login /> },
    { path: "/singup", element: <Singup /> },
    { path: "/dashboard", element: <Dashboard /> }
  ]

  const navigate = useNavigate();

  const baseUrl = "https://frail-hortense-sj-group-271834cf.koyeb.app"


  const setLocalStorage = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value))
  }
  const getLocalStorage = (key) => {
    return JSON.parse(localStorage.getItem(key))
  }


  const isLogin = () => {

  }

  const LogOut = async () => {


  }


  const LoginUser = async (userName, pass) => {



  };



  const [darkMode, setDarkMode] = useState(false)

  const toggleTheme = () => {
    const isDark = !darkMode
    setDarkMode(isDark)
    setLocalStorage("theme", isDark ? "dark" : "light")
    document.documentElement.classList.toggle("dark", isDark)
  }

  useEffect(() => {
    const storedTheme = getLocalStorage("theme")
    if (storedTheme === "dark") {
      setDarkMode(true)
      document.documentElement.classList.add("dark")
    }
  }, [])




  return (
    <AuthContext
      value={{
        baseUrl,
        darkMode,
        toggleTheme,
        setLocalStorage,
        getLocalStorage,
        isLogin,
        LogOut,
        LoginUser
      }}
    >
      <DevAuth>
        <Routes>
          {routes.map((route, i) => (
            <Route key={i} path={route.path} element={route.element} />
          ))}
        </Routes>
      </DevAuth>
    </AuthContext>
  );
}