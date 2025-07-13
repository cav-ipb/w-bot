
import { BrowserWindow } from 'electron';
import { Message } from '../components/messages';
import { AxiosError } from 'axios';
import { IPC_CHANNELS } from '../channels';

export interface IHttpResponsesHandler {
    handleSuccess?(): void;
    handleError?(errorResponse: AxiosError): void;
}

export interface IHttpResponseHandlerSettings {
    showSuccessMessage?: boolean; // Default false
    successMessage?: string;
    showErrorMessage?: boolean; // Default true
    errorMessage?: string;
    errorStatusesMessages?: { [key: number]: string };
}

export interface ErrorResponseData {
    message: string;
}


const sendMessage = (message: Message) => {
    BrowserWindow.getAllWindows().forEach(element => {
        element.webContents.send(IPC_CHANNELS.MESSAGE, message)
    });
}

export class BaseHttpResponsesHandler implements IHttpResponsesHandler {
    constructor(
        protected settings?: IHttpResponseHandlerSettings,
    ) {}

    handleSuccess(): void {
        if (this.settings && this.settings.showSuccessMessage) {
            sendMessage({
                severity: 'success',
                summary: 'Success!',
                detail: this.settings.successMessage
                    ? this.settings.successMessage
                    : 'Operation completed successfuly',
            });
        }
    }

    handleError(errorResponse: AxiosError<ErrorResponseData>): void {
        if (this.settings && this.settings.showErrorMessage == false) return;

        if (
            this.settings &&
            this.settings.errorStatusesMessages &&
            this.settings.errorStatusesMessages[
                errorResponse.response?.status
                    ? errorResponse.response.status
                    : 0
            ] != null
        ) {
            sendMessage({
                severity: 'error',
                summary: 'Error',
                detail: this.settings.errorStatusesMessages[
                    errorResponse.response?.status
                        ? errorResponse.response.status
                        : 0
                ],
            });
            return;
        }

        if (errorResponse.code === 'ERR_NETWORK') {
            sendMessage({
                severity: 'error',
                summary: 'Error',
                detail: 'A connection with the server could not be stablished, there may be an issue with your internet connection.',
            });
            return;
        }

        this.handleErrorHttpStatusCode(errorResponse);
    }

    protected handleErrorHttpStatusCode(
        errorResponse: AxiosError<ErrorResponseData>,
    ): void {
        switch (errorResponse.status) {
            default:
                this.handleOtherError(errorResponse);
        }
    }

    protected handleOtherError(
        errorResponse: AxiosError<ErrorResponseData>,
    ): void {
        const message = errorResponse.response?.data?.message ? errorResponse.response.data.message : errorResponse.response.data as unknown as string;
        sendMessage({
            severity: 'error',
            summary: 'Error',
            detail: message
                ? message
                :   "An error has occurred at the website and your support team will need to fix the problem. " +
                    "A preliminary report has been sent to the support team.Please do follow - up on the preliminary " +
                    "report using the Report a Problem page",
        });
    }
}