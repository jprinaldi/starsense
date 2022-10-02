<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import Sensor from '$lib/Sensor.svelte';
	import { selectedImageHref } from '$lib/stores';
	import { getImage } from '$lib/api/nasa';

	onMount(async () => {
		const response = await getImage($page.params.id);
		const data = await response.json();
		const imageItem = data.collection.items[0];
		selectedImageHref.set(imageItem.href);
	});
</script>

{#if $selectedImageHref !== null}
	<Sensor />
{/if}
