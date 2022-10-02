const IMAGES_API_URL = 'https://images-api.nasa.gov';

export async function searchImages(searchQuery: string) {
	return fetch(`${IMAGES_API_URL}/search?media_type=image&q=${searchQuery}`);
}

export async function getImage(id: string) {
	return fetch(`${IMAGES_API_URL}/asset/${id}`);
}
