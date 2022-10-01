<script lang="ts">
	import { onMount } from 'svelte';
	import { searchImages } from '$lib/api/nasa';
	import { imageItems } from '$lib/stores';
	import SearchIcon from '$lib/SearchIcon.svelte';

	let searchInput: HTMLInputElement;
	let searchQuery: string;
	let loading = false;

	async function handleSubmit() {
		loading = true;
		const response = await searchImages(searchQuery);
		if (!response.ok) {
			loading = false;
			throw new Error('Failed to fetch images from NASA');
		}
		const data = await response.json();
		imageItems.set(data.collection.items);
		searchInput.blur();
		loading = false;
	}

	onMount(() => {
		searchInput.focus();
	});
</script>

<form on:submit|preventDefault={handleSubmit}>
	<div class="form-control">
		<div class="input-group">
			<input
				bind:value={searchQuery}
				bind:this={searchInput}
				type="text"
				placeholder="Search…"
				class="input input-bordered grow"
				disabled={loading}
			/>
			<button class="btn btn-square" disabled={loading} class:loading>
				{#if !loading}
					<SearchIcon />
				{/if}
			</button>
		</div>
	</div>
</form>
