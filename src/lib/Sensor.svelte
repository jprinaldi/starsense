<script lang="ts">
	import { onMount } from 'svelte';
	import { selectedImageHref } from '$lib/stores';
	import { CORS_PROXY_URL, SOUND_SRC } from '$lib/config';
	import { getRandomInt } from '$lib/helpers';

	const pixelIntensityThreshold = 32;

	let audio: HTMLAudioElement;
	let canvas: HTMLCanvasElement;
	let context: CanvasRenderingContext2D | null;

	function loadContext() {
		context = canvas.getContext('2d', { willReadFrequently: true });
	}

	function loadAudio() {
		audio = new Audio(SOUND_SRC);
		audio.load();
	}

	function playSound() {
		if (audio === undefined) loadAudio();
		audio.play();
	}

	function vibrate() {
		window.navigator.vibrate(200);
	}

	function getPixelIntensity(x: number, y: number): number {
		if (!context) throw new Error('Tried to inspect pixel without a canvas context');

		const pixelData = context.getImageData(x, y, 1, 1).data;
		const pixelIntensity = (pixelData[0] + pixelData[1] + pixelData[2]) / 3;
		return pixelIntensity;
	}

	function handleContactLocation(x: number, y: number) {
		const pixelIntensity = getPixelIntensity(x, y);
		if (pixelIntensity >= pixelIntensityThreshold) {
			playSound();
			vibrate();
		}
	}

	function handleTouch(e: TouchEvent) {
		const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
		const x = e.targetTouches[0].pageX - rect.left;
		const y = e.targetTouches[0].pageY - rect.top;

		handleContactLocation(x, y);
	}

	function createImage(imageSrc: string) {
		const baseImage = new Image();
		// Without a CORS proxy in place, I was getting the following error:
		// "The canvas has been tainted by cross-origin data"
		// In order to fix it, I introduced a CORS proxy which returns a special HTTP header
		// that makes this work alongside the crossOrigin property on img.
		// More info: https://stackoverflow.com/questions/22097747/how-to-fix-getimagedata-error-the-canvas-has-been-tainted-by-cross-origin-data
		baseImage.crossOrigin = 'Anonymous';
		baseImage.src = `${CORS_PROXY_URL}/${imageSrc}?dummy=${getRandomInt(10000)}`;
		baseImage.onload = () => {
			if (context) {
				drawImageScaled(baseImage, context);
			}
		};
	}

	function drawImageScaled(img: HTMLImageElement, ctx: CanvasRenderingContext2D) {
		var canvas = ctx.canvas;
		var hRatio = canvas.width / img.width;
		var vRatio = canvas.height / img.height;
		var ratio = Math.min(hRatio, vRatio);
		var centerShift_x = (canvas.width - img.width * ratio) / 2;
		var centerShift_y = (canvas.height - img.height * ratio) / 2;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.drawImage(
			img,
			0,
			0,
			img.width,
			img.height,
			centerShift_x,
			centerShift_y,
			img.width * ratio,
			img.height * ratio
		);
	}

	onMount(() => {
		loadAudio();
		loadContext();
		if ($selectedImageHref !== null) createImage($selectedImageHref);
	});
</script>

<div class="flex flex-col grow space-y-4">
	<canvas
		bind:this={canvas}
		on:touchstart={(e) => handleTouch(e)}
		on:touchmove={(e) => handleTouch(e)}
		width={window.innerWidth}
		height={window.innerHeight}
	/>
</div>
