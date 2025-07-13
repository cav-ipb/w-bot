import React from 'react';
import { PrimeReactProvider } from 'primereact/api';
import { HashRouter } from 'react-router';
import { ToastMessageServiceProvider } from '../components/messages';

const AppContainer: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    return (
        <PrimeReactProvider value={{ unstyled: false }}>
            <ToastMessageServiceProvider>
                <HashRouter>
                    {children}
                </HashRouter>
             </ToastMessageServiceProvider>
        </PrimeReactProvider>
    );
};

export default AppContainer;
