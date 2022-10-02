<script lang="ts">
	import { onMount } from 'svelte';
	import { selectedImageHref } from '$lib/stores';
	import { CORS_PROXY_URL, SOUND_SRC } from '$lib/config';
	import { getRandomInt } from '$lib/helpers';
	import { getSound, querySounds } from '$lib/api/freesound';
	import type { SoundItem } from '$lib/types';

	const vibrationDelay = 100;

	let audio: HTMLAudioElement;
	let backgroundAudio: HTMLAudioElement;
	let canvas: HTMLCanvasElement;
	let context: CanvasRenderingContext2D | null;
	let container: HTMLDivElement;
	let currentPixelIntensity: number | null;
	let vibrationInterval: number;
	let currentPixelIntensityGroup: number | null;

	function loadContext() {
		context = canvas.getContext('2d', { willReadFrequently: true });
	}

	function loadAudio(source: string) {
		audio = new Audio(source);
		audio.load();
	}

	function getAudioVolume(pixelIntensity: number) {
		const pixelIntensityGroup = getPixelIntensityGroup(pixelIntensity);
		return pixelIntensityGroup / 8;
	}

	function playSound() {
		if (audio === undefined) loadAudio(SOUND_SRC);
		if (currentPixelIntensity === null) return;
		const volume = getAudioVolume(currentPixelIntensity);
		audio.volume = volume;
		audio.play();
	}

	function getVibrationDuration(pixelIntensity: number): number {
		const duration = (Math.ceil(Math.log2(pixelIntensity + 1)) + 1) * 10;
		return duration;
	}

	function startVibration(duration: number) {
		navigator.vibrate(duration);
	}

	function startPersistentVibration(duration: number, interval: number) {
		vibrationInterval = window.setInterval(() => {
			startVibration(duration);
		}, interval);
	}

	function stopVibration() {
		if (vibrationInterval) window.clearInterval(vibrationInterval);
		navigator.vibrate(0);
	}

	function getPixelIntensity(x: number, y: number): number {
		if (!context) throw new Error('Tried to inspect pixel without a canvas context');

		const pixelData = context.getImageData(x, y, 1, 1).data;
		const pixelIntensity = (pixelData[0] + pixelData[1] + pixelData[2]) / 3;
		return pixelIntensity;
	}

	function getTouchedPixel(e: TouchEvent): Array<number> {
		const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
		const x = e.targetTouches[0].pageX - rect.left;
		const y = e.targetTouches[0].pageY - rect.top;
		return [x, y];
	}

	function getPixelIntensityGroup(pixelIntensity: number) {
		return Math.ceil(Math.log2(pixelIntensity + 1));
	}

	function handleTouchStart(e: TouchEvent) {
		const [x, y] = getTouchedPixel(e);
		const pixelIntensity = getPixelIntensity(x, y);
		currentPixelIntensity = pixelIntensity;
		const vibrationDuration = getVibrationDuration(currentPixelIntensity);
		startPersistentVibration(vibrationDuration, vibrationDelay);
		playSound();
	}

	function handleTouchMove(e: TouchEvent) {
		const [x, y] = getTouchedPixel(e);
		const pixelIntensity = getPixelIntensity(x, y);
		const pixelIntensityGroup = getPixelIntensityGroup(pixelIntensity);
		if (pixelIntensityGroup !== currentPixelIntensityGroup) {
			currentPixelIntensityGroup = pixelIntensityGroup;
			const vibrationDuration = getVibrationDuration(pixelIntensity);
			stopVibration();
			startPersistentVibration(vibrationDuration, vibrationDelay);
		}
		playSound();
		currentPixelIntensity = pixelIntensity;
	}

	function handleTouchEnd() {
		stopVibration();
		currentPixelIntensity = null;
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

	function createCanvas() {
		canvas = document.createElement('canvas');
		canvas.ontouchstart = (e) => handleTouchStart(e);
		canvas.ontouchmove = (e) => handleTouchMove(e);
		canvas.ontouchend = () => handleTouchEnd();
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		canvas.classList.add('touch-none');
		container.appendChild(canvas);
	}

	function drawImageScaled(img: HTMLImageElement, ctx: CanvasRenderingContext2D) {
		const hRatio = canvas.width / img.width;
		const vRatio = canvas.height / img.height;
		const ratio = Math.min(hRatio, vRatio);
		const centerShiftX = (canvas.width - img.width * ratio) / 2;
		const centerShiftY = (canvas.height - img.height * ratio) / 2;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.drawImage(
			img,
			0,
			0,
			img.width,
			img.height,
			centerShiftX,
			centerShiftY,
			img.width * ratio,
			img.height * ratio
		);
	}

	let experiencing = false;

	async function startExperience() {
		experiencing = true;
		createCanvas();
		loadContext();
		const soundURL = await getSoundscape('moon');
		playSoundscape(soundURL);
		if ($selectedImageHref !== null) createImage($selectedImageHref);
	}

	async function getSoundItems(query: string): Promise<Array<SoundItem>> {
		const response = await querySounds(query);
		const data = await response.json();
		const soundList = data.results;
		return soundList;
	}

	async function getSoundURL(soundID: string): Promise<string> {
		const response = await getSound(soundID);
		const data = await response.json();
		const soundURL = data.previews['preview-hq-ogg'];
		return soundURL;
	}

	async function getSoundscape(query: string): Promise<string> {
		const soundItems = await getSoundItems(query);
		const soundItem = soundItems[Math.floor(Math.random() * soundItems.length)];
		const soundID = soundItem.id;
		const soundURL = await getSoundURL(soundID);
		return soundURL;
	}

	function playSoundscape(source: string) {
		backgroundAudio = new Audio(source);
		backgroundAudio.loop = true;
		backgroundAudio.load();
		backgroundAudio.play();
	}

	onMount(async () => {
		loadAudio(SOUND_SRC);
	});
</script>

<div bind:this={container} class="flex flex-col grow justify-center items-center">
	{#if !experiencing}
		<button class="btn" on:click={() => startExperience()}>Start</button>
	{/if}
</div>
