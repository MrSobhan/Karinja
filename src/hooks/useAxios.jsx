import { useContext } from 'react';
import axios from 'axios';
import AuthContext from '@/context/authContext';

const useAxios = () => {
    const { baseUrl, getLocalStorage } = useContext(AuthContext);

    const axiosInstance = axios.create({
        baseURL: baseUrl,
        headers: {
            "accept": "application/json",
            "Authorization": `Bearer ${getLocalStorage("token")}`,
        },
    });

    return axiosInstance;
};

export default useAxios;