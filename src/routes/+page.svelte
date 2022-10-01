<script lang="ts">
	import { searchImages } from '$lib/api/nasa';
	import Sensor from '$lib/Sensor.svelte';
	import SearchIcon from '$lib/SearchIcon.svelte';
	import type { ImageItem } from '$lib/types';

	let searchQuery: string;
	let imageItems: Array<ImageItem> = [];
	let selectedImageItem: ImageItem | null = null;

	async function handleSubmit() {
		const response = await searchImages(searchQuery);
		if (!response.ok) throw new Error('Failed to fetch images from NASA');
		const data = await response.json();
		imageItems = data.collection.items;
	}

	function selectImage(imageItem: ImageItem) {
		selectedImageItem = imageItem;
	}
</script>

{#if selectedImageItem}
	<Sensor imageSrc={selectedImageItem.links[0].href} />
{:else}
	<form on:submit|preventDefault={handleSubmit}>
		<div class="form-control">
			<div class="input-group">
				<input
					bind:value={searchQuery}
					type="text"
					placeholder="Search…"
					class="input input-bordered"
				/>
				<button class="btn btn-square">
					<SearchIcon />
				</button>
			</div>
		</div>
	</form>

	<div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
		{#each imageItems as imageItem}
			<img
				src={imageItem.links[0].href}
				alt={imageItem.data[0].description}
				title={imageItem.data[0].description}
				on:click={() => selectImage(imageItem)}
				class="hover:border-2 border-primary hover:cursor-pointer"
			/>
		{/each}
	</div>
{/if}
