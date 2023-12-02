<script>
	import { cubicOut } from 'svelte/easing';
	import { tweened } from 'svelte/motion';
	// import { ToggleSwitch } from 'fluent-svelte';
	import {
		tempObjTest,
		salObjTest,
		showHidePhTopo
	} from '../../../wq-stores/WqMapStateStoreScrolly';

	// see: https://www.youtube.com/watch?v=Y6IbPfMU1xM
	import { i, languages, language, switchLanguage } from '@inlang/sdk-js';

	export let value;
	export let step = 1;

	// NB: When needed, over-ride round() in generalConversions
	const round = (value, decimals) => Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);

	// TWEENING
	let tMySal = tweened(null, {
		duration: 750,
		easing: cubicOut
	});
	$: tMySal.set($salObjTest.icInput);
	$: $salObjTest.input = $salObjTest.icInput;

	let tMyTemp = tweened(null, {
		duration: 750,
		easing: cubicOut
	});
	$: tMyTemp.set($tempObjTest.input);
	$: $tempObjTest.input = $tempObjTest.input;
	$: $tempObjTest.icInput = $tempObjTest.input + 273.15;
</script>

<h4 class="index-of-count" class:active={value + 1 === step}>{step} of 7</h4>
<!-- <h3 class="step-title" class:active={value + 1 === step}>A topographic map of pH</h3> -->
<h3 class="step-title" class:active={value + 1 === step}>{i('one-title')}</h3>
<section class:active={value + 1 === step}>
	<!-- <p>Aquaculture water quality can be visualized with a modified Deffeyes Diagram.</p> -->
	<p>{@html i('one-p1')}</p>
	<!-- <p>
		Alkalinity (<strong>[Alk]</strong>) is on the <em>y</em>-axes. The <em>x</em>-axis is the sum of bicarbonate, carbonate,
		&amp; CO<sub>2</sub> (<strong>DIC</strong>).
	</p> -->
	<p>
		{@html i('one-p2')}
	</p>

	<!-- <p>Lines of equal pH are projected onto the map.</p> -->
	<p>{i('one-p3')}</p>

	<hr />

	<small>
		<!-- <em>Changing temperature &amp; salinity changes the pH topography.</em> -->
		<em>{@html i('one-p4')}</em>
	</small>
</section>

<label class="range-input-label" for="temp-slider">
	<input
		id="temp-slider"
		type="range"
		bind:value={$tempObjTest.input}
		min="4"
		max="40"
		step="0.1"
	/>
	Temperature: {round($tMyTemp, 1).toFixed(1)}° C
</label>

<label class="range-input-label" for="sal-slider">
	<input
		id="sal-slider"
		type="range"
		bind:value={$salObjTest.icInput}
		min="0"
		max="40"
		step="0.1"
	/>
	Salinity: {round($tMySal, 1).toFixed(1)}‰
</label>
<br />
