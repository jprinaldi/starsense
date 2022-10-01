<script lang="ts">
	import type { ImageItem } from '$lib/types';
	import { selectedImageItem } from '$lib/stores';
	import { imageItems } from '$lib/stores';
	import { CORS_PROXY_URL } from '$lib/config';

	function selectImage(imageItem: ImageItem) {
		selectedImageItem.set(imageItem);
	}
</script>

<div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
	{#each $imageItems as imageItem}
		<img
			src={`${CORS_PROXY_URL}/${imageItem.links[0].href}`}
			alt={imageItem.data[0].description}
			title={imageItem.data[0].description}
			on:click={() => selectImage(imageItem)}
			class="hover:border-2 border-primary hover:cursor-pointer"
		/>
	{/each}
</div>
