import { writable, type Writable } from 'svelte/store';

type User = {
	admin: boolean;
	displayName: string | null;
	email: string | null;
	picture: string | null;
	uid: string | null;
}

const authUser = writable<User | undefined>(undefined);

export type SessionState = {
	user: User | null;
	loading?: boolean;
	loggedIn?: boolean;
	photoURL?: string;
};

export { authUser };
export const session = <Writable<SessionState>>writable();
