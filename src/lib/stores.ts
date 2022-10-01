import { writable } from 'svelte/store';
import type { ImageItem } from '$lib/types';

export const imageItems = writable<Array<ImageItem>>([]);
export const selectedImageItem = writable<ImageItem | null>(null);
export const mainContainerWidth = writable<number | null>(null);
export const mainContainerHeight = writable<number | null>(null);
