<script lang="ts">
	import { goto } from '$app/navigation';
	import type { ImageItem } from '$lib/types';
	import { selectedImageHref } from '$lib/stores';
	import { imageItems } from '$lib/stores';

	function selectImage(imageItem: ImageItem) {
		selectedImageHref.set(imageItem.links[0].href);
		goto('/sense');
	}
</script>

<div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
	{#each $imageItems as imageItem}
		<img
			src={imageItem.links[0].href}
			alt={imageItem.data[0].description}
			title={imageItem.data[0].description}
			on:click={() => selectImage(imageItem)}
			class="hover:border-2 border-primary hover:cursor-pointer"
		/>
	{/each}
</div>
