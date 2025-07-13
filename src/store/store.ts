import { ipcMain } from "electron";
import { LoginResponse } from "../types/login";
import { Job } from "../types/job";

export interface StoreFields {
    session?: LoginResponse;
    queue: Job[];
}

export class Store {
    store : StoreFields = {
        session: null,
        queue: []
    }

    get(key: keyof StoreFields) {
        return this.store[key];
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    set(key: keyof StoreFields, value: any) {
        this.store[key] = value;
    }
}

export const store = new Store();

ipcMain.handle('get-store-field', async (event, key: keyof StoreFields) => {
    return store.get(key);
});

