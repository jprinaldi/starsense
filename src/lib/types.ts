// The following interfaces represent the format of the data returned
// by NASA's images API.

export interface ImageItem {
	data: Array<ImageItemData>;
	href: string;
	links: Array<ImageItemLink>;
}

export interface ImageItemLink {
	href: string;
}

export interface ImageItemData {
	center: string;
	date_created: string;
	description: string;
	title: string;
	nasa_id: string;
}

// The following interfaces represent the format of the data returned
// by Freesound's APIs

export interface SoundItem {
	id: string;
}
