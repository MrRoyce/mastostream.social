// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
/// <reference types="@sveltejs/kit" />
declare namespace App {
	// interface Error {}
	interface Locals {
		user: {
			admin: boolean
			email: string
			picture: string
			uid: string
			displayName: string
		};
	}
	interface Error {
		errorId: string;
		message: string;
	}
	// interface PageData {}
	// interface Platform {}
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

interface AcountRow {  // DO NOT CHANGE ORDER!
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

export { };
