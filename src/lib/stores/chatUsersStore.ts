import { writable } from "svelte/store";
import type { ChatUser } from "$lib/models";

export const chatUsersStore = writable<ChatUser[]>([]);