import { useNavigate } from 'react-router';
import { LoginResponse } from '../types/login';

const useSession = () => {
    const navigate = useNavigate();

    const getSession : () => Promise<LoginResponse> = async () => {
        const session = await window.electronApi.getStoreField('session') as LoginResponse; 

        if (session == null){
            return null;
        } else {
            return session;
        }
    }

    const checkSession : () => Promise<boolean> = async () => {
        window.electronApi.onAccountLogout(() => navigate('/account-login'));
        const session = await window.electronApi.getStoreField('session') as LoginResponse; 

        if (session == null){
            navigate('/account-login');
            return false;
        }
        return true;
    }


    return { getSession, checkSession };
};

export default useSession;
