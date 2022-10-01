<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import Sensor from '$lib/Sensor.svelte';
	import { selectedImageItem } from '$lib/stores';

	onMount(async () => {
		if ($selectedImageItem === null) {
			await goto('/');
		}
	});
</script>

<Sensor />
