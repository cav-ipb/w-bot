import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Login } from '../types/login';




const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect( () => {
        window.electronApi.onAccountLogin(() => navigate('/'));
    }, []);


    async function handleLogin(
        login: Login
    ) {
        login = {
            appVersion: "1.0.0",
            deviceId: "101",
            os: "MacOS",
            osVersion: "10.1.0",
            ...login
        }

        setLoading(true);
        try {
            const result = await window.electronApi.handleAccountLogin(login);
            return result;
        } catch(e) {console.log(e);} 
        finally {
            setLoading(false);
        }
    }

    return {
        handleLogin,
        loading,
    };
};

export default useLogin;
