import { createContext } from "react";


const AuthContext = createContext({
    baseUrl: "",
    LoginUser :() => { }  ,
    user : () => { } ,
    setLocalStorage: () => { },
    getLocalStorage: () => { },
    toggleTheme: () => { },
    isLogin: () => { },
    getMe: () => { },
    LogOut: () => { }
});

export default AuthContext;