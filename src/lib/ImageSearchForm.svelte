<script lang="ts">
	import { searchImages } from '$lib/api/nasa';
	import { imageItems } from '$lib/stores';
	import SearchIcon from '$lib/SearchIcon.svelte';

	let searchQuery: string;

	async function handleSubmit() {
		const response = await searchImages(searchQuery);
		if (!response.ok) throw new Error('Failed to fetch images from NASA');
		const data = await response.json();
		imageItems.set(data.collection.items);
	}
</script>

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
