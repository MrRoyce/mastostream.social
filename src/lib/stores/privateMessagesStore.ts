import { writable } from "svelte/store";
import type { PrivateMessage } from "$lib/models";

export const privateMessagesStore = writable<PrivateMessage[]>([]);