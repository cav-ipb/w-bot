import { Job } from "./types/job";
import { Log } from "./types/log";
import { Login, LoginResponse } from "./types/login";

export interface IElectronAPI {
	/// JOBS
	getJobs: () => any;
	enqueueJob: (job: Job) => void;
	dequeueJob: (job: Job) => void;
	onTasksCompleted: (
		callback: (result: { jobId: string; remaining: number }) => void
	) => void;

	/// WHATSAPP
	startWhatsAppClient: () => void;
	onWhatsAppQRUpdate: (callback: (qr: any) => void) => void;
	onWhatsAppConnected: (callback: () => void) => void;
	onWhatsAppDisconnected: (callback: () => void) => void;
	toggleWhatsAppLocalAuth: () => void;

	/// LOGIN
	handleAccountLogin: (login: Login) => void;
	onAccountLogin: (callback: (session: LoginResponse) => void) => void;
	onAccountLogout: (callback: () => void) => void;

	/// MESSAGING
	onLog: (callback: (log: Log) => void) => void;
	onMessage: (callback: (message: Message) => void) => void;

	/// STORE
	getStoreField: (key: keyof StoreFields) => any;
}

declare global {
	interface Window {
		electronApi: IElectronAPI;
	}
}
