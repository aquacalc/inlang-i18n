<script>
	// see: https://www.youtube.com/watch?v=Y6IbPfMU1xM
	import { i, languages, language, switchLanguage } from '@inlang/sdk-js';

	// console.log(`languages: `, languages);

	import Scrolly from '$lib/scrolly/Scrolly.svelte';

	import '$lib/styles/wq-step-styles.css';
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

<p>
	{@html i('welcome')}
</p>

<div
	style="font-size: 1.35rem; width: 90%; margin: 0 auto; text-align: {language === 'ar' ||
	language === 'il'
		? 'right'
		: 'left'};"
>
	<section style="font-size: 1.5rem; margin: 0rem 6.15rem; line-height: 2.25rem;">
		<p class="viz-para" style="margin-top: 0;">{i('p1')}</p>
		<p class="viz-para" style="margin-top: 0;">{i('p2')}</p>
		<p class="viz-para" style="margin-top: 0;">{i('p3')}</p>
		<blockquote>
			<p class="viz-para" style="margin-bottom: 0; font-size: 1.35rem; line-height: 3rem;">
				{i('block')}
			</p>
		</blockquote>
	</section>
</div>

<section
	id="top-section"
	style="text-align: left; font-size: 1.5rem; margin: 2rem 10rem 0 10rem; line-height: 2.5rem;"
>
	<hr style="width: 60%; margin-bottom: 35px; opacity: 1;" />

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
	.hero {
		height: 20vh;
		display: flex;
		place-items: center;
		flex-direction: column;
		justify-content: center;
		text-align: center;
		/* background-color: var(--bkg-hero); */
		background: linear-gradient(to right, #385c9e, #486bad);
		color: #eee;
		font-family: sans-serif;
		margin-bottom: 1rem;
	}

	.hero h1 {
		/* margin-top: 0; */
		font-weight: 300;
		font-size: 3rem;
		color: #fff;
	}

	/* select {
		font-size: 1.5rem;
		border-radius: 8px;
		padding: 2px;
	} */

	blockquote {
		border-left: 4px solid rebeccapurple;
		border-right: 4px solid rebeccapurple;
		/* border-left: 4px solid var(--about-text-highlight);
		border-right: 4px solid var(--about-text-highlight); */
		border-radius: 8px;
		font-family: sans-serif;
		margin: 2rem 0;
		padding: 0.35rem;
		padding-left: 0.5rem;
		padding-right: 0.5rem;
		background-color: #ebf2fe;
		/* background-color: var(--bkg-blockquote); */
	}

	blockquote .viz-para {
		/* color: var(--about-text-highlight) */
		color: #555;
		/* color: var(--text-blockquote); */
		padding-bottom: 0.35rem;
	}

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
