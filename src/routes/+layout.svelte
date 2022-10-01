<script lang="ts">
	import '../app.css';
	import Navbar from '$lib/Navbar.svelte';
</script>

<div class="flex flex-col h-screen">
	<Navbar />
	<main class="container mx-auto p-4">
		<slot />
	</main>
</div>
