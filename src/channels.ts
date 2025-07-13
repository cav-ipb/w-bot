export enum IPC_CHANNELS {
    MESSAGE="message",
    TOGGLE_WHATSAPP_LOCAL_AUTH='toggle-whatsapp-local-auth',
    GET_JOBS='get-jobs',
    ENQUEUE_JOB='enqueue-job',
    DEQUEUE_JOB='dequeue-job',
    ON_TASKS_COMPLETED='on-tasks-completed',
    ON_LOG='on-log',
    ON_WHATSAPP_DISCONNECTED='on-whatsapp-disconnected',
    ON_WHATSAPP_CONNECTED='on-whatsapp-connected',
    ON_ACCOUNT_LOGIN='on-account-login',
    ON_ACCOUNT_LOGOUT='on-account-logout',
    HANDLE_ACCOUNT_LOGIN='handle-account-login',
    GET_STORE_FIELD='get-store-field',
    START_WHATSAPP_CLIENT='start-whatsapp-client',
    ON_WHATSAPP_QR_UPDATE='on-whatsapp-qr-update'
}