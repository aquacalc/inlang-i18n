<script>
	import {
		showHideBicarb,
		showHideCarb,
		showHideCaOh2,
		showHideAeration
	} from '../../../wq-stores/WqMapStateStoreScrolly';

	// see: https://www.youtube.com/watch?v=Y6IbPfMU1xM
	import { i, languages, language, switchLanguage } from '@inlang/sdk-js';

	export let value;
	export let step = 1;

	// Reagents
	$: rgts = [$showHideBicarb, $showHideCarb, $showHideCaOh2, $showHideAeration];
	$: rgtsUnchecked = [0, 1, 2, 3];
	$: rgtsChecked = [];

	$: isDisabled = (idx) => {
		return (rgtsChecked.length === 2 && rgtsUnchecked.includes(idx)) || value + 1 !== step;
	};

	$: {
		rgts.forEach((rgt, idx) => {
			// Is it already in rgtsChecked?
			let isInRgtChecked = rgtsChecked.indexOf(idx) > -1;

			// Is checked and NOT in array, so ADD IT to array
			if (rgt && !isInRgtChecked) {
				// console.log(`${idx} is CHECKED and not in rgtsChecked`);
				// ADD to checked array
				rgtsChecked = [...rgtsChecked, idx];

				// REMOVE from rgtUnchecked array
				rgtsUnchecked = [...rgtsUnchecked.filter((r) => r !== idx)];

				// If added any two rgts, then disable those remaining
			} else if (!rgt && isInRgtChecked) {
				// console.log(`Remove ${idx} from `, rgtsChecked);
				rgtsChecked = [...rgtsChecked.filter((rgt) => rgt !== idx)];

				// Add back to unchecked array
				// console.log(`3. rgtUnchecked: `, rgtsUnchecked);
				rgtsUnchecked = [...rgtsUnchecked, idx];
			} else {
				// console.log(' ')
			}
		});
	}
</script>

<!-- <h4 class="index-of-count" class:active={value + 1 === step}>{step} of 7</h4> -->
<h3 class="step-title" class:active={value + 1 === step}>
	<!-- <em>What can <span style="color: {value + 1 === step ? 'black' : '#ccc'}">you</span> do with the Water
		Quality Map?</em> -->
		<em>{@html i('seven-title')}</em>
</h3>

<section class:active={value + 1 === step} style="margin-top: 0.0rem; margin-bottom: 0;">
	<p>
		{i('seven-p1-a')}<span
			style="cursor: pointer; color: {value + 1 === step
				? 'green'
				: '#ccc'}; font-family: sans-serif; font-size: 1.05rem;">{i('seven-p1-b')}</span
		>{i('seven-p1-c')}
	</p>

	<p>
		{i('seven-p2-a')}<svg
			version="1.1"
			class="fa-icon s-0fuyeY-3QfUe"
			width="12.8"
			height="16.0"
			role="presentation"
			viewBox="0 0 1024 1792"
			style="fill: {value + 1 === step ? 'red' : '#ccc'}; font-size: 1.4em;"
		>
			<path
				id="path-0"
				d="M512 1088q66 0 128-15v655q0 26-19 45t-45 19h-128q-26 0-45-19t-19-45v-655q62 15 128 15zM512 0q212 0 362 150t150 362-150 362-362 150-362-150-150-362 150-362 362-150zM512 224q14 0 23-9t9-23-9-23-23-9q-146 0-249 103t-103 249q0 14 9 23t23 9 23-9 9-23q0-119 84.5-203.5t203.5-84.5z"
			/></svg
		>
		{i('seven-p2-b')}
		<span
			style="cursor: pointer; color: {value + 1 === step
				? 'green'
				: '#ccc'}; font-family: sans-serif; font-size: 1.05rem;">{i('seven-p2-c')}</span
		>{i('seven-p2-d')}
	</p>

	<!-- <hr /> -->

</section>

<!-- rgtsChecked.length === 2 && rgtsUnchecked.includes(0) -->
<div style="display: flex; flex-direction: column; padding-left: 2rem; margin-bottom: 0; text-align: left;">
	<label for="nahco3">
		<input
			type="checkbox"
			id="nahco3"
			bind:checked={$showHideBicarb}
			style="cursor: {isDisabled(0) ? 'not-allowed' : 'pointer'}"
			disabled={isDisabled(0)}
		/>
		<span
			style="cursor: {isDisabled(0)
				? 'not-allowed'
				: 'pointer'}; font-family: sans-serif; font-size: 1.05rem; color: {isDisabled(0)
				? '#999'
				: '#333'};">{$showHideBicarb ? i('six-hide') : i('six-show')}</span
		>
		<span
			style="cursor: {isDisabled(0) ? 'not-allowed' : 'pointer'}; color: {isDisabled(0)
				? '#999'
				: value + 1 === step
				? 'blue'
				: '#ccc'}; font-family: sans-serif; font-size: 1.05rem;"
			>Sodium bicarbonate (NaHCO<sub>3</sub>)</span
		></label
	>

	<label for="na2co3">
		<input
			type="checkbox"
			id="na2co3"
			bind:checked={$showHideCarb}
			style="cursor: {isDisabled(1) ? 'not-allowed' : 'pointer'};"
			disabled={isDisabled(1)}
		/>
		<span
			style="cursor: {isDisabled(1)
				? 'not-allowed'
				: 'pointer'}; font-family: sans-serif; font-size: 1.05rem; color: {isDisabled(1)
				? '#999'
				: '#333'};">{$showHideCarb ? i('six-hide') : i('six-show')}</span
		>
		<span
			style="cursor: {isDisabled(1) ? 'not-allowed' : 'pointer'}; color: {isDisabled(1)
				? '#999'
				: value + 1 === step
				? 'green'
				: '#ccc'}; font-family: sans-serif; font-size: 1.05rem;"
			>Sodium carbonate (Na<sub>2</sub>CO<sub>3</sub>)</span
		></label
	>

	<label for="caoh2">
		<input
			type="checkbox"
			id="caoh2"
			bind:checked={$showHideCaOh2}
			style="cursor: {isDisabled(2) ? 'not-allowed' : 'pointer'};"
			disabled={isDisabled(2)}
		/>
		<span
			style="cursor: {isDisabled(2)
				? 'not-allowed'
				: 'pointer'}; font-family: sans-serif; font-size: 1.05rem; color: {isDisabled(2)
				? '#999'
				: '#333'};">{$showHideCaOh2 ? i('six-hide') : i('six-show')}</span
		>
		<span
			style="cursor: {isDisabled(2) ? 'not-allowed' : 'pointer'}; color: {isDisabled(2)
				? '#999'
				: value + 1 === step
				? 'red'
				: '#ccc'}; font-family: sans-serif; font-size: 1.05rem;"
			>Calcium hydroxide (Ca(OH)<sub>2</sub>)</span
		></label
	>

	<label for="aeration">
		<input
			type="checkbox"
			id="aeration"
			bind:checked={$showHideAeration}
			style="cursor: {isDisabled(3) ? 'not-allowed' : 'pointer'};"
			disabled={isDisabled(3)}
		/>
		<span
			style="cursor: {isDisabled(3)
				? 'not-allowed'
				: 'pointer'}; font-family: sans-serif; font-size: 1.05rem; color: {isDisabled(3)
				? '#999'
				: '#333'};">{$showHideAeration ? i('six-hide') : i('six-show')}</span
		>
		<span
			style="cursor: {isDisabled(3) ? 'not-allowed' : 'pointer'}; color: {isDisabled(3)
				? '#999'
				: value + 1 === step
				? 'rebeccapurple'
				: '#ccc'}; font-family: sans-serif; font-size: 1.05rem;"
			>Aeration ({i('seven-lower')} CO<sub>2</sub>)</span
		></label
	>

	<p style="margin-top: 0; margin-bottom: 0; color: {$showHideAeration ? 'tomato' : 'inherit'};">
		<small>
			<em>{i('seven-ceiling')}</em>
		</small>
	</p>
</div>

<section class:active={value + 1 === step} style="margin-top: 0rem; margin-bottom: 0;">
	<hr />

	<p>
		{@html i('seven-p3')}
	</p>

	<p />
</section>
