import { writable } from "svelte/store";
import type { ChatRoom } from "$lib/models";

export const chatRoomsStore = writable<ChatRoom[]>([]);