import type { DecodedIdToken } from "firebase-admin/auth";

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
/// <reference types="@sveltejs/kit" />
declare global {
	type Optional<T> = T | undefined | null;
	// interface Error {}
	interface Error {
		errorId: string;
		message: string;
	}
	namespace App {
		// interface Error {}
		interface Locals {
			getSession(): Promise<DecodedIdToken | null>;
			user: {
				admin: boolean
				displayName: string
				email: string
				picture: string
				uid: string
			};
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	interface TokenValidateResponse {
		'error-codes': string[];
		success: boolean;
		action: string;
		cdata: string;
	}
	interface ImportMetaEnv {
		// safe to share
		readonly VITE_APIKEY: string
		readonly VITE_APP_ID: string
		readonly VITE_AUTH_DOMAIN: string
		readonly VITE_MEASUREMENT_ID: string
		readonly VITE_MESSAGING_SENDER_ID: string
		readonly VITE_PROJECT_ID: string
		readonly VITE_STORAGE_BUCKET: string
		// NEVER EXPOSE
		readonly FB_CLIENT_EMAIL: string
		readonly FB_PRIVATE_KEY: string
		readonly FB_PROJECT_ID: string
	}

	interface ImportMeta {
		readonly env: ImportMetaEnv
	}

	type Fields = {
		name: string;
		value: string;
		verifiedAt: string;
	}

	interface AccountRow {  // DO NOT CHANGE ORDER!
		id: string; // Have to bypass the 1st column when displaying rows!!
		avatar: string;
		displayName: string;
		bot: boolean;
		acct: string;
		followersCount: number;
		followingCount: number;
		statusesCount: number;
		createdAt: string;
		lastStatusAt: string;
		fields: Fields[];
		locked: boolean;
		timestamp: string;
		url: string;
		username: string;
	}

	type getDataFunction = ({
		appdata
	}: {
		appdata: AcountRow;
	}) => void;

	type Toot = {
		uri?: string;
		content?: string;
		imageUrl?: string;
	}

	type TableData = {
		color: string | 'blue';
		hoverable: boolean | true;
		striped: boolean | true;
		tableHead: Array<string>;
	}
}