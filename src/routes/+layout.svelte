<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { mainContainerWidth, mainContainerHeight } from '$lib/stores';

	let mainElement: HTMLElement;

	onMount(() => {
		mainContainerWidth.set(mainElement.offsetWidth);
		mainContainerHeight.set(mainElement.offsetHeight);
	});
</script>

<div class="flex flex-col h-screen">
	<main bind:this={mainElement} class="flex container mx-auto h-full">
		<slot />
	</main>
</div>

<style lang="postcss">
	main {
		touch-action: none;
	}
</style>
