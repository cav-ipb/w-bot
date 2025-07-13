import { createHash } from "crypto";
import { Login, LoginResponse } from "../types/login";
import { BrowserWindow } from "electron";
import api from "./api-interceptor";
import { store } from "../store/store";
import { BaseApiService } from "./base-api-service";
import { BaseHttpResponsesHandler } from "./http-responses-handler";
import { IPC_CHANNELS } from "../channels";

const sha512Hash = (input: string) => {
	return createHash("sha512").update(input).digest("hex");
};

export class AuthenticationService extends BaseApiService {
	url = "api/desktop/auth";

	login(
		login: Login
	): Promise<LoginResponse> {
		login.password = sha512Hash(login.password);

		return this.handleRequest(
			api.post<LoginResponse>(`${this.url}/login`, login),
			new BaseHttpResponsesHandler()
		).then((data: LoginResponse) => {
			BrowserWindow.getAllWindows().forEach((win) => {
				win.webContents.send(IPC_CHANNELS.ON_ACCOUNT_LOGIN, data);
			});

			store.set("session", data);

			return Promise.resolve(data);
		});
	}
}
