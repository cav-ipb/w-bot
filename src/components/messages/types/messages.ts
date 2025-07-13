export interface Message {
    severity: 'success' | 'info' | 'warn' | 'error' | undefined;
    summary: string;
    detail: string;
}

export interface MessageService {
    show(message: Message): void;
}

export interface MessageServiceContextType {
    messageService?: MessageService;
}
