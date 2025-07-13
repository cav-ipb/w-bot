import axios from "axios";
import { store } from "../store/store";
import { BrowserWindow } from "electron";
import { LoginResponse } from "../types/login";

const api = axios.create({
	baseURL: "http://localhost:5000",
});

api.interceptors.request.use(
	(config) => {
		// get token from the app store
		const session = store.get("session") as LoginResponse;
		const token = session ? session.token : null;

		// if token exists, add it to headers
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}

		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

api.interceptors.response.use(
	(response) => response,
	async (error) => {
		// if 401 (unauthorized) logout the user
		if (error.response.status === 401) {
			BrowserWindow.getAllWindows().forEach((win) => {
				win.webContents.send("on-user-logout");
			});

			store.set("session", null); // clear the session
		}

		return Promise.reject(error);
	}
);

export default api;
