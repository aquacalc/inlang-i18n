<script>
	import { cubicOut } from 'svelte/easing';
	import { tweened } from 'svelte/motion';

	// import { ToggleSwitch } from 'fluent-svelte';
	import { omegaArValue } from '../../../wq-stores/WqMapStateStoreScrolly';

	// see: https://www.youtube.com/watch?v=Y6IbPfMU1xM
	import { i, languages, language, switchLanguage } from '@inlang/sdk-js';

	export let value;
	export let step = 1;

	// NB: When needed, over-ride round() in generalConversions
	const round = (value, decimals) => Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);

	// TWEENING
	let tMyOmegaAr = tweened(null, {
		duration: 750,
		easing: cubicOut
	});
	$: tMyOmegaAr.set($omegaArValue);
</script>

<h4 class="index-of-count" class:active={value + 1 === step}>{step} of 6</h4>
<h3 class="step-title" class:active={value + 1 === step}>
	{@html i('five-title-a')} <span style="color: {value + 1 === step ? 'rebeccapurple' : '#ccc'};"
		>{@html i('five-title-b')}</span
	>{@html i('five-title-c')}
</h3>

<section class:active={value + 1 === step} style="margin-top: 0rem;">
	<p>
		{@html i('five-p1')}
	</p>
	<p>
		{@html i('five-p2')}
	</p>

	<hr style="margin: 1rem auto;" />

	<small>
		<em>{@html i('five-p3')}</em>
	</small>

	<div style="font-family: sans-serif;">
		<label for="omega-ar-slider">
			<input
				type="range"
				id="omega-ar-slider"
				style="width: 55%;"
				bind:value={$omegaArValue}
				min="1.0"
				max="4.0"
				step="0.1"
			/>
			&Omega;-aragonite: {round($tMyOmegaAr, 1).toFixed(1)}</label
		>
	</div>
</section>

<!-- <br /> -->
