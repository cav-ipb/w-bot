import { Route, Routes } from 'react-router';
import AppLayout from './app-layout';
import AppLogin from '../components/app-login';
import JobDashboard from '../components/job-dashboard';
import { useContext, useEffect } from 'react';
import { MessageServiceContext } from '../components/messages';
const AppRouter: React.FC = () => {

    const {messageService } =  useContext(MessageServiceContext);

    useEffect(() => {
        window.electronApi.onMessage((message) => {
            if (messageService != null)
                messageService.show(message);
        });
    }, [])

    return (
        <Routes>
            <Route path="/" element={<AppLayout/>}>
                <Route index element={<JobDashboard/>} /> 
            </Route>
            <Route path="/account-login" element={<AppLogin/>}></Route>
        </Routes>
    );
};

export default AppRouter;
