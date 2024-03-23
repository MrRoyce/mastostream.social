import { writable } from 'svelte/store';

interface AuthUser {
	admin: boolean,
	displayName: string | null,
	email: string | null,
	picture: string | null,
	uid: string | null,
}

const authUser = writable<AuthUser | undefined>(undefined);

export { authUser };
