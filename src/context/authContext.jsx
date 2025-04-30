import { createContext, useState, useEffect } from "react";


const AuthContext = createContext();


export function AuthProvider({ children }) {

  const baseUrl = "https://karinja.onrender.com";

  const setLocalStorage = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  const getLocalStorage = (key) => {
    return JSON.parse(localStorage.getItem(key));
  };

  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(null);

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
  }, []);

  const isLogin = () => {
    return !!getLocalStorage("token");
  };

  const LoginUser = async (userName, pass) => {
    try {
      const res = await fetch(`${baseUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName, password: pass }),
      });
      const data = await res.json();

      if (res.ok && data.token) {
        setLocalStorage("token", data.token);
        setUser(data.user);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Login error:", err);
      return false;
    }
  };

  const LogOut = async () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const getMe = async () => {
    try {
      const token = getLocalStorage("token");
      const res = await fetch(`${baseUrl}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setUser(data.user);
    } catch (err) {
      console.error("getMe error:", err);
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
