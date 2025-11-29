import { createContext, useState, useEffect } from "react";
import axios from 'axios';


const AuthContext = createContext();

export function AuthProvider({ children }) {
  const baseUrl = "https://karinja-jrg0.onrender.com";
  // Helpers for localStorage
  const setLocalStorage = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  const getLocalStorage = (key) => {
    const value = localStorage.getItem(key);
    try {
      return value ? JSON.parse(value) : null;
    } catch {
      return null;
    }
  };

  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(null);
  // let user = null;

  const toggleTheme = () => {
    const isDark = !darkMode;
    setDarkMode(isDark);
    setLocalStorage("theme", isDark ? "dark" : "light");
    document.documentElement.classList.toggle("dark", isDark);
  };

  useEffect(() => {
    const storedTheme = getLocalStorage("theme");
    if (storedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }

    if (!user) {
      getMe()
    }
  }, []);

  const isLogin = () => {
    if (getLocalStorage("token")) {
      return Boolean(getLocalStorage("token"))
    } else {
      return false
    }

  };

  const LoginUser = async (username, password) => {
    try {
      const res = await axios.post(`${baseUrl}/login`, {
        username: "full_admin",
        password: "full_admin"
      }, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
      });
      const data = res.data;
      // console.log(res.data);

      if (res.status === 200 && data.access_token) {
        setLocalStorage("token", data.access_token);
        setLocalStorage("idUser", data.user_id);
        const userObj = {
          user_id: data.user_id,
          user_role: data.user_role,
          user_full_name: data.user_full_name,
          user_status: data.user_status
        };
        // console.log(userObj);

        setUser(userObj);

        if (data.user_status === "غیر فعال" && data.user_role === "employer") {
          return { userInfo: false, user_status: data.user_status };
        }

        return { userInfo: true, user_status: data.user_status };
      }
      return false;
    } catch (err) {
      if (err.response && err.response.data && err.response.data.detail) {
        console.error("Login error:", err.response.data.detail);
      } else if (err.message) {
        console.error("Login error:", err.message);
      } else {
        console.error("Login error: خطایی رخ داد. لطفا مجددا تلاش کنید.");
      }
      return false;
    }
  };

  const LogOut = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("idUser");
    setUser(null);
  };

  const getMe = async () => {
    const token = getLocalStorage("token");
    if (token) {
      try {

        const res = await axios.get(`${baseUrl}/get_me`, {
          headers: {
            "accept": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
        const data = res.data;

        const userObj = {
          user_id: data.id,
          user_role: data.role,
          user_full_name: data.full_name,
          user_status: data.account_status
        };

        setUser(userObj);

      } catch (err) {
        console.error("getMe error:", err);
        navigator('/login')
      }
    }
  };


  return (
    <AuthContext
      value={{
        baseUrl,
        user,
        darkMode,
        toggleTheme,
        setLocalStorage,
        getLocalStorage,
        isLogin,
        LoginUser,
        LogOut,
        getMe,
      }}
    >
      {children}
    </AuthContext>
  );
}


export default AuthContext;
