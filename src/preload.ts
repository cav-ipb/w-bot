// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts


import { contextBridge, ipcRenderer } from 'electron';
import { Login, LoginResponse } from './types/login';
import { StoreFields } from './store/store';
import { Job } from './types/job';
import { Log } from './types/log';
import { Message } from './components/messages';
import { IPC_CHANNELS } from './channels';


contextBridge.exposeInMainWorld('electronApi', {

    /// JOBS

    getJobs: () => ipcRenderer.invoke(IPC_CHANNELS.GET_JOBS),

    enqueueJob: (job: Job) => ipcRenderer.invoke(IPC_CHANNELS.ENQUEUE_JOB, job),

    dequeueJob: (job: Job) => ipcRenderer.invoke(IPC_CHANNELS.DEQUEUE_JOB, job),

    onTasksCompleted: (callback: (result: {jobId: string, remaining: number}) => void) => {
        ipcRenderer.on(IPC_CHANNELS.ON_TASKS_COMPLETED, (_, result) => callback(result));
    },

    
    /// WHATSAPP
    
    startWhatsAppClient: () => ipcRenderer.invoke(IPC_CHANNELS.START_WHATSAPP_CLIENT),

    onWhatsAppQRUpdate: (callback: (qr:any) => void) => {
        ipcRenderer.on(IPC_CHANNELS.ON_WHATSAPP_QR_UPDATE, (_, qr) => callback(qr));
    },

    onWhatsAppConnected: (callback: () => void) => {
        ipcRenderer.on(IPC_CHANNELS.ON_WHATSAPP_CONNECTED, (_)=> callback());
    },

    onWhatsAppDisconnected: (callback: () => void) => {
        ipcRenderer.on(IPC_CHANNELS.ON_WHATSAPP_DISCONNECTED, (_)=> callback());
    },
    
    toggleWhatsAppLocalAuth: () => ipcRenderer.invoke(IPC_CHANNELS.TOGGLE_WHATSAPP_LOCAL_AUTH),
   

    // LOGIN

    handleAccountLogin: (login: Login) => ipcRenderer.invoke(IPC_CHANNELS.HANDLE_ACCOUNT_LOGIN, login),

    onAccountLogin: (callback: (session:LoginResponse) => void) => {
        ipcRenderer.on(IPC_CHANNELS.ON_ACCOUNT_LOGIN, (_, session) => callback(session));
    },

    onAccountLogout: (callback: () => void) => {
        ipcRenderer.on(IPC_CHANNELS.ON_ACCOUNT_LOGOUT, (_) => callback());
    },


    /// MESSAGING

    onLog: (callback: (log: Log) => void) => {
        ipcRenderer.on(IPC_CHANNELS.ON_LOG, (_,log)=> callback(log));
    },

    onMessage: (callback: (message: Message) => void) => {
        ipcRenderer.on(IPC_CHANNELS.MESSAGE, (_,message)=> callback(message));
    },


    /// STORES

    getStoreField: (key: keyof StoreFields) => ipcRenderer.invoke(IPC_CHANNELS.GET_STORE_FIELD, key),

  
});