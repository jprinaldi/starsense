<script lang="ts">
	import ImageGrid from '$lib/ImageGrid.svelte';
	import ImageSearchForm from '$lib/ImageSearchForm.svelte';
</script>

<div class="flex flex-col grow space-y-4">
	<div class="p-4 space-y-4">
		<ImageSearchForm />
		<ImageGrid />
	</div>
</div>
