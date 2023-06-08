<script>
	// see: https://www.youtube.com/watch?v=Y6IbPfMU1xM
	import { i, languages, language, switchLanguage } from '@inlang/sdk-js';

	// console.log(`languages: `, languages);

	import Scrolly from '$lib/scrolly/Scrolly.svelte';

	import WqMapHarness from '$lib/wq-map/WqMapHarness.svelte';

	import StepChangeTopo from '$lib/wq-map/wq-chart/scroll-step-cards/StepChangeTopo.svelte';
	import StepPlotInitWp from '$lib/wq-map/wq-chart/scroll-step-cards/StepPlotInitWp.svelte';
	import StepDangerUian from '$lib/wq-map/wq-chart/scroll-step-cards/StepDangerUian.svelte';
	import StepDangerCo2 from '$lib/wq-map/wq-chart/scroll-step-cards/StepDangerCo2.svelte';
	import StepGreenZone from '$lib/wq-map/wq-chart/scroll-step-cards/StepGreenZone.svelte';
	import StepWhatCanYouDo from '$lib/wq-map/wq-chart/scroll-step-cards/StepWhatCanYouDo.svelte';
	import StepOmegaArZone from '$lib/wq-map/wq-chart/scroll-step-cards/StepOmegaArZone.svelte';

	import '$lib/styles/wq-step-styles.css';

	let value = 0;

	const stepArray = [0, 1, 2, 3, 4, 5, 6];

	// ** -- Adjust step element attrs based on step value -- ** //
	$: {
		const tempSlider = document.getElementById('temp-slider');
		const salSlider = document.getElementById('sal-slider');

		const phSlider = document.getElementById('ph-slider');
		const alkSlider = document.getElementById('alk-slider');

		const tanSlider = document.getElementById('tan-slider');
		const uianSlider = document.getElementById('uian-slider');
		const critPh = document.getElementById('crit-ph');

		const co2Slider = document.getElementById('co2-slider');

		const greenZoneCheckbox = document.getElementById('green-zone');
		const omegaArZoneCheckbox = document.getElementById('omega-ar-slider');
		// const omegaArZoneSpan = document.getElementById('omega-ar-zone-span');

		const nahco3Checkbox = document.getElementById('nahco3');
		const na2co3Checkbox = document.getElementById('na2co3');
		const caoh2Checkbox = document.getElementById('caoh2');
		const aerationCheckbox = document.getElementById('aeration');

		if (tempSlider && salSlider) {
			if (value !== 0) {
				tempSlider.disabled = true;
				salSlider.disabled = true;
			} else {
				tempSlider.disabled = false;
				salSlider.disabled = false;
			}
		}

		if (phSlider && alkSlider) {
			if (value !== 1) {
				phSlider.disabled = true;
				alkSlider.disabled = true;
			} else {
				phSlider.disabled = false;
				alkSlider.disabled = false;
			}
		}

		if (tanSlider && uianSlider) {
			if (value !== 2) {
				tanSlider.disabled = true;
				uianSlider.disabled = true;
				critPh.style.opacity = 0.3;
			} else {
				tanSlider.disabled = false;
				uianSlider.disabled = false;
				critPh.style.opacity = 1.0;
			}
		}

		if (co2Slider) {
			if (value !== 3) {
				co2Slider.disabled = true;
			} else {
				co2Slider.disabled = false;
			}
		}

		if (omegaArZoneCheckbox) {
			if (value !== 4) {
				omegaArZoneCheckbox.disabled = true;
			} else {
				omegaArZoneCheckbox.disabled = false;
			}
		}

		// if (greenZoneCheckbox && omegaArZoneCheckbox) {
		if (greenZoneCheckbox) {
			if (value < 5) {
				greenZoneCheckbox.checked = false;
				// omegaArZoneCheckbox.checked = false;
			}
		}

		// [NB] Also see reactive block in WqMapHarness.svelte
		if (value >= 4) {
			// Re-set default pH topo
			tempSlider.value = 15;
			salSlider.value = 34.5;

			// Re-set default danger zone sliders
			tanSlider.value = 0.15;
			uianSlider.value = 12.5;
			co2Slider.value = 15.0;
		}

		// [NB] (Re-)display init WP at default position
		if (value === 6) {
			// Re-set default pH topo
			phSlider.value = 6.75;
			alkSlider.value = 2.2;
		}

		if (value < 6 && nahco3Checkbox && na2co3Checkbox && caoh2Checkbox && aerationCheckbox) {
			nahco3Checkbox.checked = false;
			na2co3Checkbox.checked = false;
			caoh2Checkbox.checked = false;
			aerationCheckbox.checked = false;
		}
	}
</script>

<!-- 
  "flag": "🇨🇦", 
  "flag": "🇩🇪",
  "flag": "🇪🇸",
  "flag": "🇫🇷",
  "flag": "🇸🇦",
 -->

<div class="hero" style="margin-bottom: 1.25rem;">
	<h1 style="text-align: center;">{i('hero')}</h1>
</div>

<!-- <p>
	{@html i('welcome')}
</p> -->
<span style='unicode-bidi: plaintext;'></span>
<div
	style="font-size: 1.35rem; width: 90%; margin: 0 auto; text-align: {language === 'ar' ||
	language === 'il'
		? 'right'
		: 'left'};"
>
	<section
		style="font-size: 1.5rem; margin: 0rem 6.15rem; line-height: 2.25rem; text-align: {language ===
			'ar' || language === 'il'
			? 'right'
			: 'left'};"
	>
		<p class="viz-para" style="margin-top: 0;">{@html i('p1')}</p>
		<p class="viz-para" style="margin-top: 0;">{@html i('p2')}</p>
		<p class="viz-para" style="margin-top: 0;">{@html i('p3')}</p>
		<blockquote>
			<p class="viz-para" style="margin-bottom: 0; font-size: 1.35rem; line-height: 3rem;">
				{@html i('block')}
			</p>
		</blockquote>

		<p class="viz-para">
			{@html i('below')}
		</p>
		<hr style="width: 60%; margin-bottom: 0; opacity: 1;" />
	</section>
</div>

<div class="section-container">
	<div class="steps-container">
		<Scrolly bind:value>
			{#each stepArray as idx}
				<div class="step" class:active={value === idx}>
					<div
						class="step-content"
						style="text-align: {language === 'ar' || language === 'il' ? 'right' : 'left'};"
					>
						{#if idx === 0}
							<StepChangeTopo {value} step={1} />
						{:else if idx === 1}
							<StepPlotInitWp {value} step={2} />
						{:else if idx === 2}
							<StepDangerUian {value} step={3} />
						{:else if idx === 3}
							<StepDangerCo2 {value} step={4} />
						{:else if idx === 4}
							<StepOmegaArZone {value} step={5} />
						{:else if idx === 5}
							<StepGreenZone {value} step={6} />
						{:else if idx === 6}
							<StepWhatCanYouDo {value} step={7} />
						{/if}
					</div>
				</div>
			{/each}
			<div class="spacer" />
		</Scrolly>
	</div>
	<div class="sticky">
		<WqMapHarness step={value} />
	</div>
</div>

<section
	id="top-section"
	style="text-align: {language === 'ar' || language === 'il'
		? 'right'
		: 'left'}; font-size: 1.5rem; margin: 2rem 10rem 0 10rem; line-height: 2.5rem;"
>
	<hr style="width: 60%; margin-bottom: 35px; opacity: 1;" />

	<h4 style="color: var(--about-text-highlight); margin-bottom: 0;">{@html i('end-navigate')}</h4>

	<p class="viz-para">
		{@html i('end-p1-a')}
		<svg
			version="1.1"
			class="fa-icon svelte-1dof0an"
			width="18.285714285714285"
			height="32"
			role="presentation"
			viewBox="0 0 1024 1792"
			style="fill: green; opacity: 1; cursor: none;font-size: 2em"
			><path
				d="M768 640q0-106-75-181t-181-75-181 75-75 181 75 181 181 75 181-75 75-181zM1024 640q0 109-33 179l-364 774q-16 33-47.5 52t-67.5 19-67.5-19-46.5-52l-365-774q-33-70-33-179 0-212 150-362t362-150 362 150 150 362z"
			/>
		</svg>
		{@html i('end-p1-b')}
	</p>

	<div style="text-align: center;">
		<img style="width: 80%;" src="/wq-map-quantitative.png" alt="The Water Quality Map - example" />
	</div>

	<p class="viz-para">
		{@html i('end-p2')}
	</p>

	<hr style="width: 60%; margin-bottom: 35px; opacity: 1;" />

	<h4 style="color: var(--about-text-highlight); margin-bottom: 0;">{@html i('end-skills-gap')}</h4>

	<p class="viz-para">{@html i('end-p3')}</p>

	<p class="viz-para">
		{@html i('end-p4')}
	</p>

	<p class="viz-para">
		{@html i('end-p5-a')}<a
			style="font-family: sans-serif; font-size: 1.35rem;"
			href="https://www.wq-faq.com"
			target="_blank"
			rel="noopener noreferrer">{@html i('end-p5-b')}</a
		>{i('end-p5-c')}
	</p>
</section>

<footer>
	<p>
		&copy; {new Date().getFullYear()}
		<a
			class="btn btn-primary"
			href="mailto: aquacalc@protonmail.ch?subject=WQ-Viz"
			target="_blank"
			rel="noopener noreferrer"
		>
			<span style="font-family: sans-serif;">—Nick/ Staresinic</span></a
		>
	</p>

	<p style="font-family: sans-serif; font-size: 1rem;">
		Powered by
		<a href="https://kit.svelte.dev/" target="_blank" rel="noopener noreferrer">SvelteKit</a>,
		<a href="https://d3js.org/" target="_blank" rel="noopener noreferrer">D3</a>, &amp;
		<a
			href="https://svelte.dev/repl/d806d5f6e300426ab4af317d9e1d0cb3?version=3.42.4"
			target="_blank"
			rel="noopener noreferrer">Scrolly</a
		>
		(<a
			href="https://www.connorrothschild.com/post/svelte-scrollytelling"
			target="_blank"
			rel="noopener noreferrer">Scrolly tutorial</a
		>)
	</p>

	<!-- <p style="font-family: sans-serif; font-size: 1rem;">
		<a
			href="https://www.flaticon.com/free-icons/water"
			target="_blank"
			rel="noopener noreferrer"
			title="water icons">favicon created by Freepik - Flaticon</a
		>
	</p> -->

	<p style="font-family: sans-serif; font-size: 1rem;">
		<a
			href="https://www.flaticon.com/free-icons/location"
			target="_blank"
			rel="noopener noreferrer"
			title="water icons">favicon created by Moon.de - Flaticon</a
		>
	</p>
</footer>

<style>
	footer {
		color: var(--footer-color);
		font-size: 0.8em;
		margin: 0 auto;
		max-width: 1400px;
		padding: 3em 2em;
		text-align: center;
		width: 100%;
		background-color: var(--bkg-hero);
	}

	footer p {
		font-size: 1.3rem;
	}
</style>
