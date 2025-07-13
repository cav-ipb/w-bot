/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Client } = require("whatsapp-web.js");
import { BrowserWindow } from "electron";
import QRCode from "qrcode";
import { IPC_CHANNELS } from "../channels";


export default class WhatsAppService {
	client: any;
	window: BrowserWindow;
	connected: boolean;
	localAuth: boolean;

	constructor(window: BrowserWindow) {
		this.window = window;
	}

	intitialize(onQrReceivedHandler: (qr: any) => void) {
		this.connected = false;
		this.localAuth = false;

		const client = new Client({
			puppeteer: {
				headless: true,
				args: [
					"--no-sandbox",
					"--disable-setuid-sandbox",
					"--disable-dev-shm-usage",
					"--disable-accelerated-2d-canvas",
					"--no-first-run",
					"--no-zygote",
					"--single-process",
				],
			},
			restartOnAuthFail: true,
		});


		// When the client received QR-Code
		client.on("qr", async (qr: any) => {
			const result = await QRCode.toDataURL(qr);
			onQrReceivedHandler(result);
		});


        client.on("authenticated", (session: any) => {
            console.log("authenticated");
            // TODO: save session to local storage here;
		});


		client.once("ready", () => {
			console.log("WhatsApp client is ready!");
			this.connected = true;
			this.window.webContents.send(IPC_CHANNELS.ON_WHATSAPP_CONNECTED);
		});


		client.on("disconnected", (reason: string) => {
			this.connected = false;
			this.localAuth = false;
			this.window.webContents.send(IPC_CHANNELS.ON_LOG, {
				datetime: new Date(),
				severity: "danger",
				message: `WhatsApp session disconnected due to reason: "${reason}"`,
			});
		});

		client.initialize();
		this.client = client;
	}

	async sendMessage(
		locumId: number,
		phoneNumber: string,
		message: string
	): Promise<boolean> {
		try {
			// Ensure number doesn't start with '+' or whitespaces
			const cleanedNumber = phoneNumber.trim().replaceAll("+", "");
			const numberId = `${cleanedNumber}@c.us`;

			// Check if number is registered on WhatsApp
			const isRegistered = await this.client.isRegisteredUser(numberId);

			if (!isRegistered) {
				this.window.webContents.send(IPC_CHANNELS.ON_LOG, {
					datetime: new Date(),
					severity: "warning",
					message: `The phone ${phoneNumber} for locum with id ${locumId} is not registered on WhatsApp, skipping.`,
				});
				return false;
			}

			await this.client.sendMessage(numberId, message);
			this.window.webContents.send(IPC_CHANNELS.ON_LOG, {
				datetime: new Date(),
				severity: "success",
				message: `Message sent to ${phoneNumber} for locum with id ${locumId}.`,
			});
			return true;
		} catch (error) {
			this.window.webContents.send(IPC_CHANNELS.ON_LOG, {
				datetime: new Date(),
				severity: "danger",
				message: `Error while attempting to send message to number ${phoneNumber} for locum with id ${locumId}.\nOriginal error: ${error}`,
			});
			return false;
		}
	}
}
