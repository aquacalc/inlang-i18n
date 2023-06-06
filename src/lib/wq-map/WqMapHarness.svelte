<script>
	import { onMount } from 'svelte';

	// see: https://github.com/RobBrazier/svelte-awesome
	// [NB] Error: https://github.com/ArdenIvanov/svelte-intellisense/issues/32
	// import Icon from 'svelte-awesome';
	// import chevronCircleRight from 'svelte-awesome/icons/chevronCircleRight';
	// import chevronCircleLeft from 'svelte-awesome/icons/chevronCircleLeft';

	// WQ Store
	import {
		tempObjFn,
		salObjFn,
		tanObjFn,
		uianObjFn,
		co2CritObjFn
		// anObject,
		// aCompressedObject,
	} from '../wq-stores/WqMapStateStoreScrolly';

	import { initWpFn } from '../wq-stores/WaypointStoreScrolly';

	// Import pH isopleth data
	import { wqTopoData } from './wq-chart/ph-topo/PhTopoFamily';

	// Initital & Target WP calcs
	import { wpCoords } from './wq-chart/waypoint-state/waypoint-state-calcs';

	// $: console.log(`wpCoords: `, wpCoords)

	// WQ MAP DECORATION CALCS
	import { greenZoneCoords } from './wq-chart/zones/zone-calcs/green-zone-calcs';
	import { uianZoneCoords } from './wq-chart/zones/zone-calcs/uian-zone-calcs';
	import { omegaArZoneCoords } from './wq-chart/zones/zone-calcs/omega-ar-zone-calcs';
	import { adjBicarbCarbZoneCoords } from './wq-chart/zones/zone-calcs/adj-bicarb-carb-zone-calcs';

	// import WqMap from './wq-chart/WqMap.svelte';
	// import WqMap from './wq-chart/WqMapNoTrans.svelte';
	import WqMap from './wq-chart/WqMapLOWTrans.svelte';

	const tempObj = tempObjFn();
	const salObj = salObjFn();
	const tanObj = tanObjFn();
	const uianObj = uianObjFn();
	const co2CritObj = co2CritObjFn();
	const initWp = initWpFn();

	import {
		tempObjTest,
		salObjTest,
		phObjTest,
		alkObjTest,
		tanObjTest,
		uianObjTest,
		co2CritObjTest,
		showHideGreenZone,
		showHideOmegaArZone,
		omegaArValue,
		showHidePhTopo,
		showHideBicarb,
		showHideCarb,
		showHideCaOh2,
		showHideAeration
	} from '../wq-stores/WqMapStateStoreScrolly';

	// $: console.log(`HARNESS: $salObjTest.icInput = ${$salObjTest.icInput}`);

	// PROP to mark scrolling position
	export let step;

	// [NB] For step 4 (and, for now, beyond), re-set default pH topo
	//      Also see reactive block in +page.svelte
	$: {
		if (step === 4) {
			$tempObjTest.input = 15;
			$tempObjTest.icInput = 15 + 273.15;
			$salObjTest.icInput = 34.5;

			// Set init WP to position for get-to-GZ explanation
			$phObjTest.icInput = 6.75;
			$phObjTest.input = 6.75;

			$alkObjTest.icInput = 2.2;
			$alkObjTest.input = 2.2;

			$tanObjTest.icInput = 0.15;
			$tanObjTest.input = 0.15;

			$uianObjTest.icInput = 12.5;
			$uianObjTest.input = 12.5;

			$co2CritObjTest.icInput = 15.0;
			$co2CritObjTest.input = 15.0;
		}

		if (step < 6) {
			$showHideGreenZone = false;
			$showHideOmegaArZone = false;
		}

		if (step !== 6) {
			$showHideBicarb = false;
			$showHideCarb = false;
			$showHideCaOh2 = false;
			$showHideAeration = false;
		}
	}

	// [ADD] newSal prop to let user control pH topo in Step 1
	// export let newSal = 34.5;

	// [HACK] Make sure that all Wq input objects in store have .isValid = true
	// Why? Because when invalid data are entered, they are not stored
	// If they are, then 'exotic' pH isopleths may be plotted on the WQ Map

	// Thus, the isValid property of the *previously* valid data was true
	// Then, the object's isValid property is set to false so that the WQ Map
	// can be styled in a way that communicates "invalidity" -- until valid data are entered.

	// The problem: If the app is shut down with the invalid styling in-place, then,
	// upon re-launching, the otherwise valid 'old/previous & *stored*' input object retains
	// the inValid propert as false

	// So...all stored input objects have their isValid set to true in onMount()
	// (All were stored with valid value-units and so have isValid as true;
	//  but to cover the special case just noted above, any for which isValid is false
	//  are 'forced' back to true -- which reflects their stored state)
	onMount(() => {
		$tempObj.isValid = true;
		$salObj.isValid = true;

		$tanObj.isValid = true;
		$uianObj.isValid = true;

		$co2CritObj.isValid = true;
	});

	$: isWqMapStateValid =
		$tempObj.isValid &&
		$salObj.isValid &&
		$tanObj.isValid &&
		$uianObj.isValid &&
		$co2CritObj.isValid;

	$: phTopo = wqTopoData($tempObjTest.icInput, $salObjTest.icInput);

	$: gzCoords = greenZoneCoords(
		$tempObjTest.icInput,
		$salObjTest.icInput,
		// +$tempObj.icInput, // icTemp
		// +$salObj.icInput, // icSal
		7.17347266900028, // crit phFree for icTemp, icSal, & icTAN
		$tanObjTest.icInput, // tanVal
		// +$tanObj.icInput, // tanVal
		'mg/L', // tanUnits
		$uianObjTest.icInput, // uianCritVal
		// +$uianObj.icInput, // uianCritVal
		'μg/L', // uianCritUnits
		$co2CritObjTest.icInput, // ***** co2CritValMgL *****
		// +$co2CritObj.icInput, // co2CritValMgL
		1.0, // alkLowValue
		'meq/kg', // alkLowUnits
		3.5, // alkHighValue
		'meq/kg' // alkHighUnits
	);

	$: co2UianCoords = uianZoneCoords(
		$tempObjTest.icInput,
		$salObjTest.icInput,
		// +$tempObj.icInput,
		// +$salObj.icInput,
		7.17347266900028,
		$tanObjTest.icInput,
		// +$tanObj.icInput,
		'mg/L',
		$uianObjTest.icInput,
		// +$uianObj.icInput,
		'μg/L',
		$co2CritObjTest.icInput,
		// +$co2CritObj.icInput,
		1.0,
		'meq/kg',
		3.5,
		'meq/kg'
	);

	$: omegaArCoords = omegaArZoneCoords(
		$tempObjTest.icInput,
		$salObjTest.icInput,
		$omegaArValue,
		0.0103
		// omegaArValue,
		// calciumInMolPerKg
	);

	$: adjBicarCarbCoords = adjBicarbCarbZoneCoords();

	// $: console.log(`adjBicarCarbCoords: `, adjBicarCarbCoords)

	$: wqMapData = {
		phTopo,
		gzCoords,
		co2Coords: co2UianCoords.co2Coords,
		uianCoords: co2UianCoords.uianCoords,
		omegaArCoords,
		adjBicarCarbCoords
		// Waypoint coords?
		// waypointData: {
		//   dicInit,
		// },
	};

	let bar = '<span>|</span>';
</script>

<div class="wq-map-harness">
	<div class="harness-content-grid">
		<div id="wq-map">
			<!-- [ADD] step prop to mark scroll position -->
			<WqMap
				{wqMapData}
				isInputValid={isWqMapStateValid}
				{step}
				newTemp={$tempObjTest.icInput}
				newSal={$salObjTest.icInput}
				newPh={$phObjTest.icInput}
				newAlk={$alkObjTest.icInput}
				newTan={$tanObjTest.icInput}
				newUianCrit={$uianObjTest.icInput}
				{showHideGreenZone}
				{omegaArValue}
			/>
		</div>
	</div>
</div>

<style>
	.wq-map-harness {
		text-align: center;
		margin-left: 1.5rem;
	}

	.harness-content-grid {
		display: grid;
		grid-template-columns: 2fr 1fr;
		gap: 1.1rem;
	}

	#wq-map {
		background-color: var(--wq-map-bkg);
		border-radius: 8px;
		width: 41rem;
	}

	@media screen and (max-width: 1180px) {
		.harness-content-grid {
			grid-template-columns: 1fr;
			justify-items: center;
		}
	}

	/* THIS modified from the repo to toggle drawer's open/close */
	/* (it's "-1" in the repo; '1' froze the WQ Map pointer-events) */
	.wq-map-harness :global(aside.drawer) {
		z-index: 0;
	}

	.wq-map-harness :global(.drawer .overlay) {
		background: #02081282;
	}

	.wq-map-harness :global(.drawer .panel) {
		background: rgba(57, 74, 114, 0.35);
		color: white;
		--size: 350px;
		padding: 1rem;
	}

	/* THIS modified from the repo to expose right-hand strip */
	.wq-map-harness :global(.drawer .panel.left) {
		left: 0;
		transform: translate(-90%, 0);
		/* for listel */
		padding-right: 0;
		padding-top: 0;
	}
</style>
