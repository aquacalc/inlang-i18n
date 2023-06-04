<script>
	// import { onMount } from 'svelte';

	// // see: https://vercel.com/docs/concepts/analytics/audiences/quickstart
	// import { dev } from '$app/environment';
	// import { inject } from '@vercel/analytics';

	import { fade } from 'svelte/transition';
	// import Moon from '$lib/icons/moon.svelte';
	// import Sun from '$lib/icons/sun.svelte';

	// export let data;

	// inject({ mode: dev ? 'development' : 'production' });

	// let currentTheme = '';

	// onMount(() => {
	// 	// currentTheme = document.documentElement.dataset.theme;
	// 	const userPrefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
	// 	const hasUserSetDarkModeManually = document.documentElement.dataset.theme == 'dark';
	// 	if (!hasUserSetDarkModeManually) {
	// 		setTheme(userPrefersDarkMode ? 'dark' : 'light');
	// 	}
	// });

	// // see: https://www.youtube.com/watch?v=mt56gKUeppk&list=PLm_Qt4aKpfKjf77S8UD79Ockhwp_699Ms&index=20
	// const setTheme = (theme) => {
	// 	// document.cookie = `siteTheme=${theme};Max-Age=31536000;path="/"`;

	// 	// Access HTML tag
	// 	document.documentElement.dataset.theme = theme;
	// 	// Set cookie for SSR persistence
	// 	document.cookie = `siteTheme=${theme}; max-age=31536000; path="/"`;
	// 	// document.cookie = `siteTheme=${theme}; Max-Age=1704085200; path="/"`;
	// 	currentTheme = theme;
	// };

	// see: https://www.youtube.com/watch?v=Y6IbPfMU1xM
	import { i, languages, language, switchLanguage } from '@inlang/sdk-js';
	
	// console.log(`languages: `, languages);
	export let data;

	console.log(`exported data: `, data)
	console.log(`language = ${language}`)

	// --------------- //

	// Make this assignment to show correct select selection on refresh
	let selectedLang = language;

	const handleLanguageSelection = async (e) => {
		// console.log(`1. language = ${language} (vs. ${e.target.value})`)
		await switchLanguage(e.target.value);
	};
</script>

<nav>
	<ul id="nav-ul" style="background-color: #555; height: 60px;">
		<li>
			<a href="/" target="_blank" rel="noopener noreferrer"
				>WQ
				<!-- ><img id="recycle-drop-menu" src="/recycle-drop.png" alt="WQ | FAQ icon" /> WQ -->
				<span style="color: orange;">|</span> FAQ Blog</a
			>
		</li>
		<li>
			<div style="text-align: right; margin-right: 20px;">
				<select
					name="langs"
					id="langs"
					on:change={handleLanguageSelection}
					bind:value={selectedLang}
				>
					<option value="en">English</option>
					<option value="de">Deutsch</option>
					<option value="ar">اللغة العربية</option>
					<option value="fr">Français</option>
					<option value="es">Español</option>
					<option value="il">עִברִית</option>
					<option value="gr">Ελληνικά</option>
					<option value="br">Brasileiro</option>
				</select>
			</div>
		</li>
		<!-- <li class="relative">
			{#if currentTheme == 'light'}
				<a class="moon" href={'#'} on:click={() => setTheme('dark')}>
					<Moon />
				</a>
			{:else}
				<a class="sun" href={'#'} on:click={() => setTheme('light')}>
					<Sun />
				</a>
			{/if}
		</li> -->
	</ul>
</nav>

<!-- {#key data.currentRoute} -->
<main in:fade={{ duration: 350 }}>
	<slot />
</main>

<!-- {/key} -->

<style>
	ul {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		padding: 0 30px;
		gap: 4rem;
		list-style-type: none;
	}

	a {
		color: #ddd;
		text-decoration: none;
		font-size: 1.2rem;
		opacity: 0.9;
	}

	a:hover {
		color: #fff;
		opacity: 1;
	}

	select {
		font-size: 1.35rem;
		border-radius: 8px;
		padding: 2px;
    background: transparent;
    color: #ccc;
    cursor: pointer;
	}

  select:hover {
    color: #eee;
  }

	select:focus {
		outline: none;
	}

	/* #recycle-drop-menu {
		width: 16px;
		padding-right: 2px;
		opacity: 0.9;
	} */

	/* a #recycle-drop-menu:hover {
		opacity: 1;
	} */
</style>
