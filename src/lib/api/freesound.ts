import { FREESOUND_API_KEY } from '$lib/config';

export async function querySounds(query: string) {
	return fetch(
		`https://freesound.org/apiv2/search/text/?query=ambient ${query}&token=${FREESOUND_API_KEY}`
	);
}

export async function getSound(soundID: string) {
	return fetch(`https://freesound.org/apiv2/sounds/${soundID}?token=${FREESOUND_API_KEY}`);
}
