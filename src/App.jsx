import React from "react";
import {  Route, Routes } from "react-router-dom";
import "./App.css";


import HomePage from "./pages/Home";
import Login from "./pages/Login";
import Singup from "./pages/Singup";

export default function App() {
  const routes = [
    { path: "/", element: <HomePage /> },
    { path: "/login", element: <Login /> },
    { path: "/singup", element: <Singup /> }
  ]

  return (
    <>
      <Routes>

        {routes.map((route, i) => (
          <Route key={i} path={route.path} element={route.element} />
        ))}

      </Routes>
    </>
  );
}