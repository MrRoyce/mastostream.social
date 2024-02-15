// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
/// <reference types="@sveltejs/kit" />
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
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
	acct: string;
	avatar: string;
	bot: boolean;
	createdAt: string;
	displayName: string;
	fields: Fields[];
	followersCount: number;
	followingCount: number;
	lastStatusAt: string;
	statusesCount: number;
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
