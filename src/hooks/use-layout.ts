import { useEffect, useState } from 'react';
import useSession from './use-session';

const useLayout = () => {
    const [userName, setUserName] = useState<string>(null);
    const {getSession} = useSession(); 

    useEffect(() => {
        init();
    }, []);

    const init = async () => {
        const result = await getSession();
        if (result) {
            setUserName(result.user.fullName);
        }
    }

    return { userName };
};

export default useLayout;
