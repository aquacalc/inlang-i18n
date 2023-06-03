<script>
	// see: https://www.youtube.com/watch?v=Y6IbPfMU1xM
	import { i, languages, language, switchLanguage } from '@inlang/sdk-js';

	// console.log(`languages: `, languages);
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
</style>
