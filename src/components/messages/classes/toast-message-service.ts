import { RefObject } from 'react';
import { Toast } from 'primereact/toast';
import { Message, MessageService } from '../types/messages';

export class ToastMessageService implements MessageService {
    toast: RefObject<Toast | null>;

    constructor(toast: RefObject<Toast | null>) {
        this.toast = toast;
    }

    show(message: Message): void {
        this.toast.current?.show(message);
    }
}
