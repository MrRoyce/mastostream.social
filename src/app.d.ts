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

type Toot = {
	uri?: string;
	content?: string;
	imageUrl?: string;
}

export { };
