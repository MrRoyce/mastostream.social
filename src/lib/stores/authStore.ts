import { writable } from 'svelte/store';

interface AuthUser {
	displayName: string | null,
	email: string | null,
	name: string | null,
	uid: string | null,
}

const authUser = writable<AuthUser | undefined>(undefined);

export { authUser };
