<script>
	// import { ToggleSwitch } from 'fluent-svelte';
	import { showHideGreenZone } from '../../../wq-stores/WqMapStateStoreScrolly';

	// see: https://www.youtube.com/watch?v=Y6IbPfMU1xM
	import { i, languages, language, switchLanguage } from '@inlang/sdk-js';

	export let value;
	export let step = 1;
</script>

<h4 class="index-of-count" class:active={value + 1 === step}>{step} of 6</h4>
<h3 class="step-title" class:active={value + 1 === step}>
	{@html i('six-title-a')}<span style="color: {value + 1 === step ? 'green' : '#ccc'};">{@html i('six-title-b')}</span>{@html i('six-title-c')}
</h3>

<section class:active={value + 1 === step}>
	<p>
		{@html i('six-p1-a')}<span
			style="color: {value + 1 === step
				? 'green'
				: '#ccc'}; font-family: sans-serif; font-size: 1.05rem;">{@html i('six-p1-b')}</span
		>{@html i('six-p1-c')}
	</p>

	<!-- <p>
			Toggle the switch to Show/Hide the <span style="color: green; font-family: sans-serif; font-size: 1.05rem;"
				>Green Zone</span
			>.
		</p> -->
	<!-- </section> -->

	<div style="text-align: center;">
		<label for="green-zone">
			<input
				type="checkbox"
				id="green-zone"
				bind:checked={$showHideGreenZone}
				style="cursor: {value + 1 === step ? 'pointer' : 'not-allowed'};"
				disabled={value + 1 !== step}
			/>
			<span style="cursor: pointer; font-family: sans-serif; font-size: 1.05rem;"
				>{$showHideGreenZone ? i('six-hide') : i('six-show')}</span
			>
			<span
				style="cursor: pointer; color: {value + 1 === step
					? 'green'
					: '#ccc'}; font-family: sans-serif; font-size: 1.05rem;">{i('six-gz')}</span
			></label
		>
	</div>

	<!-- <section class:active={value + 1 === step} style="margin-top: 0.5rem;"> -->
	<p>
		{@html i('six-p2')}
	</p>

	<p>
		{i('six-p3-a')}<span
			style="font-weight: 900; color: {value + 1 === step
				? 'rebeccapurple'
				: '#ccc'}; font-family: sans-serif; font-size: 1.05rem;">{i('six-p3-b')}</span
		>
		{i('six-p3-c')}
		<span
			style="font-weight: 900; color: {value + 1 === step
				? 'rebeccapurple'
				: '#ccc'}; font-family: sans-serif; font-size: 1.05rem;">{i('six-p3-d')}</span
		>{i('six-p3-e')}
		<span
			style="color: {value + 1 === step
				? 'green'
				: '#ccc'}; font-family: sans-serif; font-size: 1.05rem;">{i('six-p3-f')}</span
		>{i('six-p3-g')}
	</p>
</section>

<!-- <br /> -->
