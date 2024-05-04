import { writable } from "svelte/store";
import type { ChatMessage } from "$lib/models";

export const chatMessagesStore = writable<ChatMessage[]>([]);