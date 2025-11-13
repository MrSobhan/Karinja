import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "@/context/authContext";

export default function PAdminPrivate({ children }) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const isActiveAdmin = user && user.user_role && user.user_status === "فعال";
    if (!isActiveAdmin) {
      navigate("/login");
    }
  }, []);


  return <>{children}</>;
}
