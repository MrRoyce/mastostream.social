import { writable } from "svelte/store";
import type { ChatUser } from "$lib/models";

export const chatUsersStore = writable<ChatUser[]>([]);

export const chatNumUsers = writable(0)