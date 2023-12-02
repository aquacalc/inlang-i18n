<script>
	import { cubicOut } from 'svelte/easing';
	import { tweened } from 'svelte/motion';
	import {
		phObjTest,
		alkObjTest,
		tempObjTest,
		salObjTest,
		tanObjTest
	} from '../../../wq-stores/WqMapStateStoreScrolly';
	import {
		calcCo2OfDic,
		calcRho,
		calcDicOfAlk,
		phNbsToPhFree,
		// for LSI calculation //
		getK2,
		calcKspCa,
		calcKspAr,
		calcPhTotForOmegaAr,
		calcIonicStrength
	} from '../../wq-brains/CarbCalcFunctions';

	// see: https://www.youtube.com/watch?v=Y6IbPfMU1xM
	import { i, languages, language, switchLanguage } from '@inlang/sdk-js';
	import Layout from '../../../../routes/+layout.svelte';

	export let value;
	export let step = 1;

	// NB: When needed, over-ride round() in generalConversions
	const round = (value, decimals) => Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);

	// ------------------------------------ //
	// TEST LSI calculation
	// $: {
	// 	let phObsNbs = $phObjTest.icInput;
	// 	let phObsFree = phNbsToPhFree($phObjTest.icInput,$salObjTest.icInput, $tempObjTest.icInput, 0);
	// 	let A = $alkObjTest.icInput / 1000; // eq/kg
	// 	let Ca = 0.010117940054740959; // mol/kg (NOT as CaCO3 equivalents)
	// 	// let Ca = 0.0103; // mol/kg (NOT as CaCO3 equivalents)
	// 	// let Ca = 0.0075; // mol/kg (NOT as CaCO3 equivalents)
	//   // let Ca = 0.004128; // molar mass Ca: 40.0789 g/mol

	// 	console.log(`alk: ${A} meq/kg`);
	// 	console.log(`Ca: ${Ca} mol/kg`);

	// 	let pK2 = -Math.log10(getK2($tempObjTest.icInput, $salObjTest.icInput, 0));
	// 	let pKspCa = -Math.log10(calcKspCa($tempObjTest.icInput, $salObjTest.icInput));
	// 	let pKspAr = -Math.log10(calcKspAr($tempObjTest.icInput, $salObjTest.icInput));

	// 	let phLsiCa = pK2 - pKspCa + -Math.log10(A) + -Math.log10(Ca);
	// 	let phLsiAr = pK2 - pKspAr + -Math.log10(A) + -Math.log10(Ca);

	// 	// console.log(`I = ${calcIonicStrength($salObjTest.icInput)}`);

	// 	// console.log(`pK2 = ${pK2}`);

	// 	// console.log(`pKspCa = ${pKspCa}`);
	// 	// console.log(`pK2 - pKspCa = ${pK2 - pKspCa}`);
	// 	// console.log(`phLsiCa = ${phLsiCa}`);

	// 	// console.log(`pKspAr = ${pKspAr}`);
	// 	// console.log(`pK2 - pKspAr = ${pK2 - pKspCa}`);
	// 	// console.log(`phLsiAr = ${phLsiAr}`);

	// 	console.log(`**  LSI-calcite = ${round(phObsNbs - phLsiCa, 2)}`);
	// 	console.log(`**  LSI-calcite (F) = ${round(phObsFree - phLsiCa, 2)}`);
	// 	console.log(`**  LSI-aragonite = ${round(phObsNbs - phLsiAr, 2)}`);
	// 	console.log(`**  LSI-aragonite (F) = ${round(phObsFree - phLsiAr, 2)}`);
	// 	console.log(` --- `);
	// 	console.log(` `);
	// }

	// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ //

	// TWEENING
	// let myAlk = 2.0;
	let tMyAlk = tweened(null, {
		duration: 750,
		easing: cubicOut
	});
	$: tMyAlk.set($alkObjTest.icInput);
	// $: $alkObjTest.icInput = myAlk;

	let tMyPh = tweened(null, {
		duration: 750,
		easing: cubicOut
	});
	$: tMyPh.set($phObjTest.icInput);

	let tMyTan = tweened(null, {
		duration: 750,
		easing: cubicOut
	});
	$: tMyTan.set($tanObjTest.icInput);

	$: myPhFree = phNbsToPhFree($phObjTest.icInput, $salObjTest.icInput, $tempObjTest.icInput, 0);

	$: myRho = calcRho($tempObjTest.icInput, $salObjTest.icInput) / 1000.0; // kg/L

	$: myDic = calcDicOfAlk(
		$alkObjTest.icInput / 1000,
		myPhFree,
		$tempObjTest.icInput,
		$salObjTest.icInput
	);

	// $: console.log(`myDic = ${myDic}, ${$alkObjTest.icInput / 1000}`)

	$: myCo2 = calcCo2OfDic(myDic, $tempObjTest.icInput, $salObjTest.icInput, myPhFree); // mg/kg
	$: myCo2_L = myCo2 * myRho; // mg/L

	let tMyCo2 = tweened(null, {
		duration: 750,
		easing: cubicOut
	});
	$: tMyCo2.set(myCo2_L); // for display mg/L (from mg/kg)
	// $: tMyCo2.set(myCo2);
	// [NB] Don't store this CO2; it's re-calc'd from entered
	//      T, S, pH, & alk
	// $: $co2CritObjTest.icInput = myCo2_L; // for STORAGE

	// $: console.log(`${myCo2} mg/kg -> ${myCo2_L} mg/L`);

	// $: console.log(`myDic = ${myDic} mmol/kg`);
</script>

<h4 class="index-of-count" class:active={value + 1 === step}>{step} of 7</h4>
<h3 class="step-title" class:active={value + 1 === step}>{i('two-title')}</h3>

<section class:active={value + 1 === step}>
	<p>
		{i('two-p1a')}
		<svg
			version="1.1"
			class="fa-icon s-0fuyeY-3QfUe"
			width="12.8"
			height="16.0"
			role="presentation"
			viewBox="0 0 1024 1792"
			style="fill: {value + 1 === step ? 'blue' : '#ccc'}; font-size: 1.4em;"
		>
			<path
				id="path-0"
				d="M512 1088q66 0 128-15v655q0 26-19 45t-45 19h-128q-26 0-45-19t-19-45v-655q62 15 128 15zM512 0q212 0 362 150t150 362-150 362-362 150-362-150-150-362 150-362 362-150zM512 224q14 0 23-9t9-23-9-23-23-9q-146 0-249 103t-103 249q0 14 9 23t23 9 23-9 9-23q0-119 84.5-203.5t203.5-84.5z"
			/></svg
		>{i('two-p1b')}
	</p>

	<p>
		{@html i('two-p2')}
	</p>

	<hr />

	<small>
		<em>{i('two-p3')}</em>
	</small>
</section>

<label class="range-input-label" for="ph-slider">
	<input
		id="ph-slider"
		type="range"
		bind:value={$phObjTest.icInput}
		min="6.50"
		max="9.25"
		step="0.01"
	/>
	pH (<abbr title="The NBS pH scale" style="cursor: default; color: rebeccapurple">NBS</abbr>): {round(
		$tMyPh,
		2
	).toFixed(2)}
</label>

<label class="range-input-label" for="alk-slider">
	<input id="alk-slider" type="range" bind:value={$alkObjTest.icInput} min="1" max="5" step="0.1" />
	[Alk]: {round($tMyAlk, 1).toFixed(1)} meq/kg ({round($tMyAlk * (100.0869 / 2), 1).toFixed(0)} ppm)
</label>

<section class:active={value + 1 === step} style="margin-top: 0.0rem;">
	<small
		>(here, [TA-N] = {round($tMyTan, 2).toFixed(2)} mg/L and [Ca<sup>++</sup>] = 412.1 mg/kg)</small
	>
</section>
