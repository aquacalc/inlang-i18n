<script>
	import { cubicOut } from 'svelte/easing';
	import { tweened } from 'svelte/motion';
	import {
		tanObjTest,
		uianObjTest,
		tempObjTest,
		salObjTest,
		pHCritForUianObjTest
	} from '../../../wq-stores/WqMapStateStoreScrolly';
	import {
		critPhFreeForTanMillero,
		calcCritPhTan,
		phFreeToPhNbs
	} from '../../wq-brains/CarbCalcFunctions';

	// see: https://www.youtube.com/watch?v=Y6IbPfMU1xM
	import { i, languages, language, switchLanguage } from '@inlang/sdk-js';

	export let value;
	export let step = 1;

	// NB: When needed, over-ride round() in generalConversions
	const round = (value, decimals) => Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);

	// [HACK] Convert myUian from µg/L -> mg/L
	$: critPhFree = calcCritPhTan(
		$tanObjTest.icInput,
		$uianObjTest.icInput / 1000,
		$tempObjTest.icInput,
		$salObjTest.icInput
	);
	$: critPhFreeMillero = critPhFreeForTanMillero(
		$tanObjTest.icInput,
		$uianObjTest.icInput / 1000,
		$tempObjTest.icInput,
		$salObjTest.icInput
	);

	// $: critPhNbs = phFreeToPhNbs(critPhFree, $salObjTest.icInput, $tempObjTest.icInput, 0);
	$: critPhNbsMillero = phFreeToPhNbs(
		critPhFreeMillero,
		$salObjTest.icInput,
		$tempObjTest.icInput,
		0
	);

	$: $pHCritForUianObjTest.input = critPhNbsMillero;
	$: $pHCritForUianObjTest.icInput = critPhNbsMillero;

	// $: console.log(`STORE ${$pHCritNbsForUianObjTest.input} v. ${critPhNbsMillero}`)

	// TWEENING
	let tMyTan = tweened(null, {
		duration: 750,
		easing: cubicOut
	});
	$: tMyTan.set($tanObjTest.icInput);

	let tMyUian = tweened(null, {
		duration: 750,
		easing: cubicOut
	});
	$: tMyUian.set($uianObjTest.icInput);

	let tMyCritPhNbsMillero = tweened(null, {
		duration: 750,
		easing: cubicOut
	});
	$: tMyCritPhNbsMillero.set(critPhNbsMillero);
</script>

<h4 class="index-of-count" class:active={value + 1 === step}>{step} of 6</h4>
<h3 class="step-title" class:active={value + 1 === step}>
	{@html i('three-title-a')}
	<span style="color: {value + 1 === step ? '#bf0d0d' : '#ccc'};">{@html i('three-title-b')}</span> {@html i('three-title-c')}
</h3>

<section class:active={value + 1 === step}>
	<p>
		{@html i('three-p1')}
	</p>

	<p>
		{@html i('three-p2')}
	</p>

	<hr />

	<small>
		<em>{@html i('three-p3')}</em>
	</small>
</section>

<label class="range-input-label" for="tan-slider">
	<input
		id="tan-slider"
		type="range"
		bind:value={$tanObjTest.icInput}
		min="0.05"
		max="2.25"
		step="0.01"
	/>
	TA-N: {round($tMyTan, 2).toFixed(2)} mq/L
</label>

<label class="range-input-label" for="uian-slider">
	<input
		id="uian-slider"
		type="range"
		bind:value={$uianObjTest.icInput}
		min="5.0"
		max="40"
		step="0.1"
	/>
	UIA-N {i('three-tolerance')}: {round($tMyUian, 1).toFixed(1)} μg/L
</label>

<!-- <section style="margin-top: 0.5rem;">
	<small
		><sup>*</sup>for {$tempObjTest.input}{$tempObjTest.selectedShort}
		&amp; {$salObjTest.icInput}{$salObjTest.selectedShort}</small
	>
</section> -->

<label class="crit-ph-label" for="crit-ph" style="margin-top: 0.75rem;">
	<h4 id="crit-ph">
		{i('three-highest-safe-ph')}: {round($tMyCritPhNbsMillero, 2).toFixed(2)}
	</h4>
</label>
