<script>
	import { cubicOut } from 'svelte/easing';
	import { tweened } from 'svelte/motion';
	import {
		co2CritObjTest,
		tempObjTest,
		salObjTest
	} from '../../../wq-stores/WqMapStateStoreScrolly';

	// see: https://www.youtube.com/watch?v=Y6IbPfMU1xM
	import { i, languages, language, switchLanguage } from '@inlang/sdk-js';

	export let value;
	export let step = 1;

	// NB: When needed, over-ride round() in generalConversions
	const round = (value, decimals) => Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);

	// TWEENING
	let tMyCo2 = tweened(null, {
		duration: 750,
		easing: cubicOut
	});
	$: tMyCo2.set($co2CritObjTest.icInput);
</script>

<h4 class="index-of-count" class:active={value + 1 === step}>{step} of 7</h4>
<h3 class="step-title" class:active={value + 1 === step}>
	{@html i('four-title-a')}<span style="color: {value + 1 === step ? '#bf0d0d' : '#ccc'};"
		>{@html i('four-title-b')}</span
	>{@html i('four-title-c')}
</h3>

<section class:active={value + 1 === step}>
	<p>
		{@html i('four-p1')}
	</p>

	<p>
		{@html i('four-p2')}
		<!-- It's often <small>~</small>10 - 15 mg/L, but lower for larvae and up to 60 mg/L for a hardy
		species like Tilapia. -->
	</p>

	<hr />

	<small>
		<em> {@html i('four-p3')}</em>
	</small>
</section>

<label class="range-input-label" for="co2-slider">
	<input
		id="co2-slider"
		type="range"
		bind:value={$co2CritObjTest.icInput}
		min="5"
		max="60"
		step="0.1"
	/>
	CO<sub style="padding-top: 5px; padding-right: 4px;">2</sub>
	{@html i('three-tolerance')}: {round($tMyCo2, 1).toFixed(1)} mg/L
</label>

<br />

<!-- <section style="margin-top: 0.5rem;">
	<small
		><sup>*</sup>for {$tempObjTest.input}{$tempObjTest.selectedShort}
		&amp; {$salObjTest.icInput}{$salObjTest.selectedShort}</small
	>
</section> -->
