<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import Sensor from '$lib/Sensor.svelte';
	import { selectedImageHref } from '$lib/stores';

	onMount(async () => {
		if ($selectedImageHref === null) {
			await goto('/');
		}
	});
</script>

<Sensor />
