import React from 'react';
import { MessageServiceContextType } from '../types/messages';

const MessageServiceContext = React.createContext<MessageServiceContextType>(
    {},
);

export default MessageServiceContext;
