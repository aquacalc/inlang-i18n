<script>
	import { onMount } from 'svelte';

	// see: https://vercel.com/docs/concepts/analytics/audiences/quickstart
	import { dev } from '$app/environment';
	import { inject } from '@vercel/analytics';

	import { fade } from 'svelte/transition';
	import Moon from '$lib/icons/moon.svelte';
	import Sun from '$lib/icons/sun.svelte';

	// import Icon from 'svelte-awesome';
	// import globe from 'svelte-awesome/icons/globe';

	export let data;
	console.log(`data prop: `, data);

	inject({ mode: dev ? 'development' : 'production' });

	let currentTheme = '';

	onMount(() => {
		// currentTheme = document.documentElement.dataset.theme;
		const userPrefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
		const hasUserSetDarkModeManually = document.documentElement.dataset.theme == 'dark';
		if (!hasUserSetDarkModeManually) {
			setTheme(userPrefersDarkMode ? 'dark' : 'light');
		}
	});

	// see: https://www.youtube.com/watch?v=mt56gKUeppk&list=PLm_Qt4aKpfKjf77S8UD79Ockhwp_699Ms&index=20
	const setTheme = (theme) => {
		// document.cookie = `siteTheme=${theme};Max-Age=31536000;path="/"`;

		// Access HTML tag
		document.documentElement.dataset.theme = theme;
		// Set cookie for SSR persistence
		document.cookie = `siteTheme=${theme}; max-age=31536000; path="/"`;
		// document.cookie = `siteTheme=${theme}; Max-Age=1704085200; path="/"`;
		currentTheme = theme;
	};

	// see: https://www.youtube.com/watch?v=Y6IbPfMU1xM
	import { i, languages, language, switchLanguage } from '@inlang/sdk-js';

	// console.log(`exported data: `, data);
	// console.log(`language = ${language}`);

	// --------------- //

	// Make this assignment to show correct select selection on refresh
	let selectedLang = language;

	const handleLanguageSelection = async (e) => {
		// console.log(`1. language = ${language} (vs. ${e.target.value})`)
		await switchLanguage(e.target.value);
	};
</script>

<nav>
	<div
		style="display: flex; justify-content: space-between; 
	align-items: center;"
	>
		<a
			class="btn btn-primary"
			href="https://www.wq-faq.com/about"
			target="_blank"
			rel="noopener noreferrer"
			style="margin-left: 1rem; font-size: 2rem;"
			title="Visual RAS Water Quality"
		>
			<span style="font-family: sans-serif;"
				><img id="map-marker-menu" src="/map-marker.png" alt="contact" /></span
			></a
		>

		<ul id="nav-ul" style="height: 40px;">
			<li>
				<a href="https://www.wq-faq.com" target="_blank" rel="noopener noreferrer"
					><img id="recycle-drop-menu" src="/recycle-drop.png" alt="WQ | FAQ icon" /> WQ
					<span style="color: orange;">|</span> FAQ Blog</a
				>
			</li>
			<li>
				<div style="text-align: right; margin-right: 0px;">
					<!-- <Icon data={globe} id='lang-icon' scale="1.25" style="fill: #ccc; padding-top: 5px;" /> -->
					<select
						name="langs"
						id="langs"
						on:change={handleLanguageSelection}
						bind:value={selectedLang}
						style="text-align: {language === 'ar' || language === 'il'
							? 'right'
							: 'right'}; padding-right: 5px;"
					>
						<option value="br">Brasileiro</option>
						<option value="de">Deutsch</option>
						<option value="gr">Ελληνικά</option>
						<option value="en">English</option>
						<option value="es">Español</option>
						<option value="fr">Français</option>
						<option value="ml">Melayu</option>
						<option value="tr">Türkçe</option>
						<option value="ar">اللغة العربية</option>
						<option value="ch">中文</option>
						<!-- <option value="il">עִברִית</option> -->
						<option value="hi">हिंदी</option>
					</select>
				</div>
			</li>

			<li>
				<a
					class="btn btn-primary"
					href="mailto: aquacalc@protonmail.ch?subject=WQ-Viz"
					target="_blank"
					rel="noopener noreferrer"
					style="font-size: 1.75rem;"
					title="Contact..."
				>
					<span style="font-family: sans-serif;"> ✉️</span></a
				>
			</li>

			<li class="relative">
				{#if currentTheme == 'light'}
					<a class="moon" href={'#'} on:click={() => setTheme('dark')}>
						<Moon />
					</a>
				{:else}
					<a class="sun" href={'#'} on:click={() => setTheme('light')}>
						<Sun />
					</a>
				{/if}
			</li>
		</ul>
	</div>
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
		gap: 1.5rem;
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

	/* For i18n select in navbar */

	select {
		font-size: 1.15rem;
		border: none;
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

	/* #lang-icon {
		cursor: pointer;
		color: #ccc;
	}

	#lang-icon:hover {
		color: #eee;
	} */

	#recycle-drop-menu {
		width: 16px;
		padding-right: 2px;
		opacity: 0.9;
	}

	#map-marker-menu {
		width: 28px;
		padding-right: 2px;
		opacity: 0.9;
	}

	/* a #recycle-drop-menu:hover {
		opacity: 1;
	} */
</style>
