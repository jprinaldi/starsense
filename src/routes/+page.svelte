<script lang="ts">
	import ImageGrid from '$lib/ImageGrid.svelte';
	import ImageSearchForm from '$lib/ImageSearchForm.svelte';
	import Sensor from '$lib/Sensor.svelte';
	import { selectedImageItem } from '$lib/stores';
</script>

{#if $selectedImageItem === null}
	<ImageSearchForm />
	<ImageGrid />
{:else}
	<Sensor />
{/if}
