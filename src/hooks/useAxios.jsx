import { useContext } from 'react';
import axios from 'axios';
import AuthContext from '@/context/authContext';

const useAxios = () => {
    const { baseUrl } = useContext(AuthContext);

    const axiosInstance = axios.create({
        baseURL: baseUrl,
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${yourToken}`,
            // 'Custom-Header': 'value'
        }
    });

    return axiosInstance;
};

export default useAxios;