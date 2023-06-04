<script>
	// TWEEN-ing
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';

	import { subTwo, superPlus } from '../wqmap-controls/wq-input/WqInputData';

	// -- ** STORES ** -- //
	import {
		showHideBicarb,
		showHideCarb,
		showHideCaOh2,
		showHideAeration,
		wqMapTransformStateFn
	} from '../../wq-stores/WqMapStateStoreScrolly';

	const wqMapTransformState = wqMapTransformStateFn();

	import { initWpFn, targetWpFn } from '../../wq-stores/WaypointStoreScrolly';

	const initWp = initWpFn();
	const targetWp = targetWpFn();

	// ----------------------- //
	import { pHCritForUianObjTest, co2CritObjTest } from '../../wq-stores/WqMapStateStoreScrolly';
	// ^^^^^^^^^^^^^^^^^^^^^^^ //
	// $: console.log(`$pHCritForUianObjTest: `, $pHCritForUianObjTest)
	// $: console.log(`$co2CritObjTest.icInput: `, $co2CritObjTest.icInput)

	// -- ** ^^^^^^ ** -- //

	// Initital & Target WP calcs
	import { wpCoords } from '../wq-chart/waypoint-state/waypoint-state-calcs';

	import {
		calcRho,
		phNbsToPhFree,
		calcCo2OfDic,
		convertCaToMolesPerKg,
		calcOmegaCa,
		calcOmegaAr,
		percentNh3ForTemp
	} from '../wq-brains/CarbCalcFunctions';

	// wpCoords(icTemp, icSal, phNbs, Alk)
	$: dicInit = wpCoords(
		newTemp, // K
		newSal, // ppt
		newPh, // NBS
		newAlk // mmol/kg
	);

	// D3 in Svelte for WQ Map
	// ported from React (https://www.aquatoolbox.com/scroll-wqmap.html)
	// see: https://github.com/TomFevrier/svelte-d3-demo/blob/master/src/ScatterPlot.svelte
	// and: https://d3-graph-gallery.com/graph/interactivity_zoom.html
	// ** my mod of latter...
	// /Users/nickstaresinic/Documents/Documents/Udemy Courses/Svelte/html-zoom/html-zoom-axes/script-modified.js
	import { select, pointer } from 'd3-selection';
	import { scaleLinear } from 'd3-scale';
	import { zoom, zoomIdentity } from 'd3-zoom';
	import { drag } from 'd3-drag';

	// console.log(`zoomIdentity: `, zoomIdentity);

	import { fade, fly } from 'svelte/transition';

	import Icon from 'svelte-awesome';
	import mapMarker from 'svelte-awesome/icons/mapMarker';
	import mapPin from 'svelte-awesome/icons/mapPin';
	import circle from 'svelte-awesome/icons/circle';

	// Tom Février's Axis component (modified)
	import Axis from './axes/Axis.svelte';

	// The pH isopleths
	import PhLine from './ph-topo/PhLine.svelte';

	// The zones
	import GreenZone from './zones/GreenZone.svelte';
	import UianDangerZone from './zones/UianDangerZone.svelte';
	import Co2DangerZone from './zones/Co2DangerZone.svelte';
	import OmegaArZone from './zones/OmegaArZone.svelte';
	import AdjZoneBicarbCarb from './zones/AdjZoneBicarbCarb.svelte';

	export let wqMapData;
	export let isInputValid;

	// [ADD] step prop to mark scroll position
	export let step = 0;

	// [ADD] newSal prop to let user control pH topo in Step 1
	export let newSal = 34.5;
	export let newTemp = 15;
	export let newPh = 7.0;
	export let newAlk = 2.0;
	export let newTan = 0.15; // mg/L
	export let newUianCrit = 12.5; // µg/L
	export let showHideGreenZone;
	// export let showHideOmegaArZone;
	export let omegaArValue;
	// export let showHidePhTopo;

	// ** -- Set Chart Dimensions -- ** //
	let svgWidth = 650;
	let svgHeight = 450;

	let margin = { top: 10, right: 60, bottom: 60, left: 60 };

	let width = svgWidth - margin.left - margin.right;
	let height = svgHeight - margin.top - margin.bottom;

	// Re-scaled x & y
	let newScaleX;
	let newScaleY;
	let newScaleYPpm;

	// pointer shift for dragging Target WP
	let myShiftX;
	let myShiftY;

	let sweetSpotX;
	let sweetSpotY;

	// Init & Target wqypoint dimensions
	let initWpWidth = 18.29;
	let initWpHeight = 32; // 27.43 ??

	let targetWpWidth = 18.29;
	let targetWpHeight = 30; // 27.43 ??

	// ** SET DRAG LIMITS TO CHART VALUES ** //
	let minChartX = 0;
	let maxChartX = 8.0;
	let minChartY = 0.0;
	let maxChartY = 8.0;

	// +++++++++++++++++++++++++++++++++++++++ //
	// TEMPORARY (to understand how to shift target clip)
	let coords = [];

	// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ //

	// $: console.log(`omegaArCoords: `, wqMapData.omegaArCoords)

	// NB: When needed, over-ride round() in generalConversions
	const round = (value, decimals) => Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);

	// Add X axis
	// [** NB **] ".clamp(true)" breaks the panning!!
	$: xScale = scaleLinear().domain([minChartX, maxChartX]).range([0, width]);
	// $: myDummyXScale = scaleLinear().domain([0, 8]).range([0, width]);

	// Add Y axis
	$: yScale = scaleLinear().domain([minChartY, maxChartX]).range([height, 0]);
	// $: myDummyYScale = scaleLinear().domain([0, 8]).range([height, 0]);

	// Add Y axis
	$: yScalePpm = scaleLinear().domain([0, 400]).range([height, 0]);

	// Are input data valid?
	$: isInputValid;
	$: isValidX = newScaleX && isInputValid;
	$: isValidY = newScaleY && isInputValid;

	// Reset Target WP when off chart
	// $: {
	// 	if ($resetTargetWaypoint) {
	// 		console.log(`Reset Target? ${$resetTargetWaypoint}`);
	// 		// alert(`Reset!!  ${$resetTargetWaypoint}`);

	// 		sweetSpotX = newScaleX(2.5) + margin.left + targetWpWidth / 2;
	// 		sweetSpotY = newScaleY(2.5) + margin.top + targetWpHeight;

	// 		// $targetWp.dic = newScaleX.invert(sweetSpotX - margin.left);
	// 		// $targetWp.alk = newScaleY.invert(sweetSpotY - margin.top);

	// 		$targetWp.dic = 3.0;
	// 		$targetWp.alk = 2.5;

	// 		// GIVEN $targetWp.dic ($targetWp.alk), calculate $targetWp.x ($target.y)
	// 		$targetWp.x = newScaleX
	// 			? newScaleX.invert(newScaleX($targetWp.dic) - targetWpWidth / 2)
	// 			: xScale.invert(xScale($targetWp.dic) - targetWpWidth / 2);
	// 		$targetWp.y = newScaleY
	// 			? newScaleY.invert(newScaleY($targetWp.alk) - targetWpHeight)
	// 			: yScale.invert(yScale($targetWp.alk) - targetWpHeight);

	// 		// console.log(`** ${$targetWp.dic} -> ${$targetWp.x} **`);
	// 		// console.log(`** ${$targetWp.alk} -> ${$targetWp.y} **`);

	// 		$resetTargetWaypoint = false;
	// 	}
	// }

	// $: $initWp.dic = dicInit;
	// $: console.log(`${dicInit}`);

	// ---------------------------- //

	// -- ** WQ STATE DATA ** -- //
	$: rho = calcRho(newTemp, newSal);
	$: phFree = phNbsToPhFree(newPh, newSal, newTemp);
	$: myCo2 = calcCo2OfDic(dicInit / 1000, newTemp, newSal, phFree); // mg/kg

	let myCaMgKg = 412.1; // [Ca++], mg/kg
	// let myCaMgKg = 423.36; // [Ca++], mg/kg
	// let myCaMgKg = myCaMgL / (calcRho(newTemp, newSal) / 1000);

	$: myCaMolKg = convertCaToMolesPerKg(myCaMgKg, 'mg/kg (ppm)', newTemp, newSal);

	// $: {
	// 	console.log(`${round(calcRho(newTemp, newSal) / 1000, 4)} kg/L`);
		
	// 	console.log(`${myCaMgKg} mg/kg = ${round(convertCaToMolesPerKg(myCaMgKg, 'mg/kg (ppm)', newTemp, newSal), 5)} mol/kg`);
	// 	console.log(`${myCaMgKg} mg/L = ${round(convertCaToMolesPerKg(myCaMgKg, 'mg/L', newTemp, newSal), 5)} mol/L`);
	// }
	

	$: omegaCa = calcOmegaCa(dicInit / 1000, myCaMolKg, newTemp, newSal, phFree);
	$: omegaAr = calcOmegaAr(dicInit / 1000, myCaMolKg, newTemp, newSal, phFree);

	// Calculate UIA-N in μg/L
	// $: console.log(`PERCENT UIA-N: ${percentNh3ForTemp(newTemp, newSal, phFree)}%`)

	$: newUian = (1000 * newTan * percentNh3ForTemp(newTemp, newSal, phFree)) / 100;

	// $: console.log(`Ω-ca ${omegaCa}, Ω-ar ${omegaAr}`)

	// $: myHco3 = calcHCO3(dicInit / 1000, newTemp, newSal, phFree) * 1000;
	// $: myCo3 = calcCO3(dicInit / 1000, newTemp, newSal, phFree) * 1000;

	// $: console.log(`${myCo2} mg/kg -> ${myCo2 * (rho / 1000)} mg/L`)
	// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^ //

	// -------- TWEEN-ing WP markers like ------- //

	// Stahl tweening Datapoint?
	let tX = tweened(null, {
		duration: 750,
		easing: cubicOut
		// interpolate: interpolatePath,
	});
	let tY = tweened(null, {
		duration: 750,
		easing: cubicOut
		// interpolate: interpolatePath,
	});

	$: tX.set(
		newScaleX ? newScaleX(dicInit) - initWpWidth / 2 : xScale(dicInit) - initWpWidth / 2
		// newScaleX ? newScaleX($initWp.dic) - initWpWidth / 2 : xScale($initWp.dic) - initWpWidth / 2
	);
	$: tY.set(
		newScaleY ? newScaleY(newAlk) - initWpHeight : yScale(newAlk) - initWpHeight
		// newScaleY ? newScaleY($initWp.alk.alk) - initWpHeight : yScale($initWp.alk.alk) - initWpHeight
	);

	// console.log(`*** DIC ${$initWp.dic}`);
	// console.log(`*** ALK ${$initWp.alk.alk}`)

	let tX_Target = tweened(null, {
		duration: 750,
		easing: cubicOut
	});
	let tY_Target = tweened(null, {
		duration: 750,
		easing: cubicOut
	});

	$: tX_Target.set(newScaleX ? newScaleX($targetWp.x) : xScale($targetWp.x));
	$: tY_Target.set(newScaleY ? newScaleY($targetWp.y) : yScale($targetWp.y));

	// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ //

	// tween sal (and temp) below heading
	let tSal = tweened(null, {
		duration: 750,
		easing: cubicOut
	});
	$: tSal.set(newSal);

	let tTemp = tweened(null, {
		duration: 750,
		easing: cubicOut
	});
	$: tTemp.set(newTemp);

	// tween PH (ALK, CO2, etc.) for init WP Step
	let tPh = tweened(null, {
		duration: 750,
		easing: cubicOut
	});
	$: tPh.set(newPh);

	let tAlk = tweened(null, {
		duration: 750,
		easing: cubicOut
	});
	$: tAlk.set(newAlk);

	let tCo2 = tweened(null, {
		duration: 750,
		easing: cubicOut
	});
	$: tCo2.set(myCo2);
	// $: tCo2.set(myCo2 * (rho / 1000));

	let tOmegaCa = tweened(null, {
		duration: 750,
		easing: cubicOut
	});
	$: tOmegaCa.set(omegaCa);

	let tOmegaAr = tweened(null, {
		duration: 750,
		easing: cubicOut
	});
	$: tOmegaAr.set(omegaAr);

	let tUian = tweened(null, {
		duration: 750,
		easing: cubicOut
	});
	$: tUian.set(newUian);

	let tUianCrit = tweened(null, {
		duration: 750,
		easing: cubicOut
	});
	$: tUianCrit.set(newUianCrit);

	let tTan = tweened(null, {
		duration: 750,
		easing: cubicOut
	});
	$: tTan.set(newTan);

	let tCritPhUian = tweened(null, {
		duration: 750,
		easing: cubicOut
	});
	$: tCritPhUian.set($pHCritForUianObjTest.input);

	let tCritCo2 = tweened(null, {
		duration: 750,
		easing: cubicOut
	});
	$: tCritCo2.set($co2CritObjTest.icInput);

	// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ //

	// Svelte acion attached to svg
	const addInvizRect = (node) => {
		// How set initial zoom/pan state?
		// .call(zoom, zoomIdentity.translate(0,0).scale(2.5))
		// see @nero: https://stackoverflow.com/questions/16178366/d3-js-set-initial-zoom-level

		// Initial transform to apply
		// Good place to start?
		// k: 4.1182510161098795
		// x: -262.2313178449341
		// y: -963.3251381728401
		// let transform = zoomIdentity
		// 	.translate($wqMapTransformState.x, $wqMapTransformState.y)
		// 	.scale($wqMapTransformState.k);

		// ** [NB] ** For Scrolly, use un-zoomed WQ Map
		let transform = zoomIdentity;

		// console.log(`TRANSFORM: `, transform, $wqMapTransformState.x, $wqMapTransformState.y, $wqMapTransformState.k)

		const mySvg = select('#wq-svg');

		mySvg.on('mousemove', function (event) {
			coords = pointer(event);
			// console.log(coords[0], coords[1]); // log the mouse x,y position
		});

		mySvg
			.call(
				zoom()
					.scaleExtent([1, 6])
					.extent([
						[0, 0],
						[width, height]
					])
					.translateExtent([
						[0, 0],
						[width, height]
					])
					.on('zoom', zoomed)
			)
			.call(zoom().on('zoom', zoomed).transform, transform);

		// **                  ** //
		// ** Initial Waypoint ** //
		// **                  ** //

		// **                  ** //
		// ** TARGET Waypoint ** //
		// **                  ** //

		let target = mySvg
			.select('#wq-target-group') // mySvg = select("#wq-svg")
			.attr('opacity', 1)
			.call(
				drag() // call specific function when circle is dragged
					.on('start', dragstarted)
					.on('drag', dragged)
					.on('end', dragended)
			);

		// [NB] NEED THIS SELECTION to reach Icon wrapped in <g>
		const myTarget = target
			.select('.fa-icon.target-icon')
			// .attr("opacity", "0.75")
			// .style("fill", "#6868e2") // for Icon, need 'style', not 'attr'?
			.style('fill', '#566b21')
			.attr('cursor', 'grab');

		let targetCircle = target
			.select('#wq-target-group-circle .fa-icon') // mySvg = select("#wq-svg")
			.attr('cursor', 'grab')
			.style('fill', 'white')
			.attr('opacity', 0.15);

		// ** --              -- ** //
		// ** -- DRAG STARTED -- ** //
		// ** --              -- ** //
		function dragstarted(event) {
			// [NB] clientX v pageX v offsetX v screenX v layerX v x
			// see: https://www.youtube.com/watch?v=dxADq_DlS-w
			// see: https://www.codetd.com/en/article/12514516
			// console.log(`000. START DRAG...`);
			// console.log(`000. START DRAG...`, event);

			// 1. Get upper-left point of target icon’s <g>: [newScaleX($targetWp.x), newScaleY($targetWp.y)]

			// 2. Apply <g>’s width & length to calculate target’s “focus” point
			sweetSpotX = newScaleX($targetWp.x) + margin.left + targetWpWidth / 2;
			sweetSpotY = newScaleY($targetWp.y) + margin.top + targetWpHeight;

			myShiftX = newScaleX($targetWp.x) - event.subject.x;
			myShiftY = newScaleY($targetWp.y) - event.subject.y;

			target
				.select('.fa-icon.target-icon')
				.attr('cursor', 'grabbing')
				.style('fill', '#566b21') // for Icon, need 'style', not 'attr'?
				.style('opacity', 1)
				.attr('font-size', (d) => 2.0 + 'em')
				.raise();

			target.select('#wq-target-group-circle .fa-icon').attr('cursor', 'grabbing');
		}

		// ** --              -- ** //
		// ** --   DRAGGING   -- ** //
		// ** --              -- ** //
		function dragged(event) {
			console.log(` `);
			// console.log(`111. DRAGGING...${$targetWp.dic} & ${$targetWp.x}`);
			// console.log(`111. DRAGGING...`, newScaleX.invert(event.x));

			target.select('.fa-icon.target-icon').attr('cursor', 'grabbing');

			// If drag a MOUSE event (or a TOUCH event)
			if (event && event.sourceEvent && event.sourceEvent.offsetX) {
				// console.log(`-- MOUSE EVENT --`);

				// [*]... SiMPLIFIED RELATIONSHIP BETWEEN UPPER-LEFT & POINT OF TARGET ICON ... //
				// $targetWp.dic = newScaleX.invert(event.sourceEvent.offsetX - margin.left + (newScaleX($targetWp.x) - event.subject.x) + targetWpWidth / 2)

				// $targetWp.x = newScaleX.invert(newScaleX($targetWp.dic) - event.sourceEvent.offsetX + margin.left + event.subject.x - (targetWpWidth / 2))

				// console.log(`DIC: ${$targetWp.dic} <- X: ${$targetWp.x}`);
				// console.log(`${newScaleX($targetWp.dic) - newScaleX($targetWp.x)} = ${targetWpWidth / 2}`);
				// console.log(`X: ${$targetWp.x} = newScaleX.invert(newScaleX(${$targetWp.dic}) - ${targetWpWidth / 2}) = ${newScaleX.invert(newScaleX($targetWp.dic) - targetWpWidth / 2)}`);
				// ^^^^^^^^^^^^^^^^^^^^^

				// Get current target waypoint position ([dic, alk])
				$targetWp.dic = newScaleX.invert(
					event.sourceEvent.offsetX - margin.left + myShiftX + targetWpWidth / 2
				);

				$targetWp.alk = newScaleY.invert(
					event.sourceEvent.offsetY - margin.top + myShiftY + targetWpHeight
				);
				// myShiftY = newScaleY($targetWp.y) - event.subject.y;

				// BEFORE TRANSFORM the <g> with the target: Is target within chart area?
				if (
					$targetWp.dic >= minChartX &&
					$targetWp.dic <= maxChartX - 0.5 &&
					$targetWp.alk >= minChartY &&
					$targetWp.alk <= maxChartY - 0.5
				) {
					// console.log(`GOOD-TO-DRAG`);

					// target.attr(
					//   'transform', `translate(${$tX_Target}, ${$tY_Target})`);

					target.attr(
						'transform',
						`translate(${event.sourceEvent.offsetX - margin.left + myShiftX},
            ${event.sourceEvent.offsetY - margin.top + myShiftY})`
					);

					// target.attr(
					//   "transform",
					//   `translate(${event.sourceEvent.offsetX - margin.left + myShiftX},
					//   ${
					//     newScaleY(
					//       newScaleY.invert(newScaleY(3.0) - 0.625 * targetWpHeight)
					//     ) - margin.top
					//   })`
					// );

					console.log(`--- --- ---`);

					mySvg
						.select('#init-to-target-line')
						.attr('x2', event.sourceEvent.offsetX - margin.left + myShiftX + targetWpWidth / 2)
						.attr('y2', event.sourceEvent.offsetY - margin.top + myShiftY + targetWpHeight)
						.style('stroke', '#566b21')
						.style('stroke-width', '2px');
				} else {
					console.log(`0. MOUSE dragged out-of-bounds...(${$targetWp.dic})`);

					console.log(event.sourceEvent.clientX);
					console.log(event.subject.x);
					console.log(event.sourceEvent.pageX);

					if (event.sourceEvent.clientX < svgWidth) {
						if ($targetWp.dic < minChartX) $targetWp.dic = minChartX;
						if ($targetWp.dic > maxChartX - 0.5) $targetWp.dic = maxChartX - 0.5;
						if ($targetWp.alk < minChartY) $targetWp.alk = minChartY;
						if ($targetWp.alk > maxChartY - 0.5) $targetWp.alk = maxChartY - 0.5;

						$targetWp.x = newScaleX
							? newScaleX.invert(newScaleX($targetWp.dic) - targetWpWidth / 2)
							: xScale.invert(xScale($targetWp.dic) - targetWpWidth / 2);
						$targetWp.y = newScaleY
							? newScaleY.invert(newScaleY($targetWp.alk) - targetWpHeight)
							: yScale.invert(yScale($targetWp.alk) - targetWpHeight);

						console.log(`$targetWp.dic: ${$targetWp.dic}`);
						console.log(`  $targetWp.x: ${$targetWp.x}`);
						console.log(`$targetWp.alk: ${$targetWp.alk}`);
						console.log(`  $targetWp.y: ${$targetWp.y}`);
						console.log(`1. MOUSE dragged out-of-bounds...(${$targetWp.dic})`);

						target
							// .transition()
							// .duration(250)
							.attr(
								'transform',
								`translate(${newScaleX ? newScaleX($targetWp.x) : xScale($targetWp.x)}, 
                ${newScaleY ? newScaleY($targetWp.y) : yScale($targetWp.y)})`
							);

						mySvg
							.select('#init-to-target-line')
							// .attr(
							//   "x2",
							//   event.sourceEvent.offsetX -
							//     margin.left +
							//     myShiftX +
							//     targetWpWidth / 2
							// )
							// .attr(
							//   "y2",
							// event.sourceEvent.offsetY - margin.top + myShiftY + targetWpHeight
							// )
							.attr('x2', newScaleX ? newScaleX($targetWp.dic) : xScale($targetWp.dic))
							.attr('y2', newScaleY ? newScaleY($targetWp.alk) : yScale($targetWp.alk))
							.style('stroke', '#566b21')
							.style('stroke-width', '2px');
					}
					// else {
					//   console.log(`WAY out-of-bounds... ${newScaleX ? newScaleX($targetWp.dic) : xScale($targetWp.dic)}`);
					// }
				}

				// TODO: If good-to-go, then calc UIA-N & CO2 for current target position
				//       and style the target icon accordingly
				target
					.select('#wq-target-group-circle .fa-icon')
					.style('fill', $targetWp.dic >= 5.0 ? 'tomato' : 'white')
					// .style("fill", "lightgreen") // bright green #5ae416 or #6aff00
					.attr('opacity', 0.15);
			} else if (event.sourceEvent.targetTouches) {
				// ** see: https://developpaper.com/details-of-js-event-object-offsetx-pagex-screenx-clientx/
				// see: https://stackoverflow.com/questions/17130940/retrieve-the-same-offsetx-on-touch-like-mouse-event
				// console.log(`*** TOUCH EVENT ***`);

				// "effective" offset?
				let simpleDragTranslationX = event.x + (newScaleX($targetWp.x) - event.subject.x);
				let simpleDragTranslationY = event.y + (newScaleY($targetWp.y) - event.subject.y);

				console.log(`0. TOUCH... simpleDragTranslationX: ${simpleDragTranslationX}`);
				console.log(`$targetWp.dic: ${$targetWp.dic}`);
				console.log(`  $targetWp.x: ${$targetWp.x}`);
				console.log(`$targetWp.alk: ${$targetWp.alk}`);
				console.log(`  $targetWp.y: ${$targetWp.y}`);

				if (
					// simpleDragTranslationX >= minChartX &&
					// simpleDragTranslationX <= maxChartX - 0.5 &&
					// simpleDragTranslationY >= minChartY &&
					// simpleDragTranslationY <= maxChartY - 0.5
					$targetWp.dic >= minChartX &&
					$targetWp.dic <= maxChartX - 0.5 &&
					$targetWp.alk >= minChartY &&
					$targetWp.alk <= maxChartY - 0.5
				) {
					console.log(`TOUCH EVENT: GOOD-TO-GO`);

					target.attr(
						'transform',
						`translate(${simpleDragTranslationX}, ${simpleDragTranslationY})`
					);

					mySvg
						.select('#init-to-target-line')
						.attr('x2', simpleDragTranslationX + targetWpWidth / 2)
						.attr('y2', simpleDragTranslationY + targetWpHeight)
						.style('stroke', '#566b21')
						.style('stroke-width', '2px');
				} else {
					console.log(`TOUCH EVENT: OUT-OF-BOUNDS`);
				}
			} else {
				console.log(`...DRAGGING ERROR...`);
			}
		}

		// ** --              -- ** //
		// ** --  DRAG ENDED  -- ** //
		// ** --              -- ** //
		function dragended(event) {
			console.log(`-- DRAG ENDED -- ${$targetWp.dic}, ${$targetWp.x}`);
			// console.log(`-- DRAG ENDED -- [${event.subject.x}, ${event.subject.y}]`);
			// console.log(`event: `, event);

			if (event.sourceEvent.targetTouches) {
				let simpleDragTranslationX = event.x + (newScaleX($targetWp.x) - event.subject.x);
				let simpleDragTranslationY = event.y + (newScaleY($targetWp.y) - event.subject.y);

				$targetWp.x = newScaleX.invert(simpleDragTranslationX);
				$targetWp.y = newScaleY.invert(simpleDragTranslationY);
			} else {
				// $targetWp.x = newScaleX.invert(
				//   event.sourceEvent.offsetX - margin.left + myShiftX
				// );
				// $targetWp.y = newScaleY.invert(
				//   event.sourceEvent.offsetY - margin.top + myShiftY
				// );

				$targetWp.x = newScaleX
					? newScaleX.invert(newScaleX($targetWp.dic) - targetWpWidth / 2)
					: xScale.invert(xScale($targetWp.dic) - targetWpWidth / 2);
				$targetWp.y = newScaleY
					? newScaleY.invert(newScaleY($targetWp.alk) - targetWpHeight)
					: yScale.invert(yScale($targetWp.alk) - targetWpHeight);

				// console.log(`>> ${newScaleX.invert(
				//   event.sourceEvent.offsetX - margin.left + myShiftX
				// )} v. ${newScaleX.invert(event.x + (newScaleX($targetWp.x) - event.subject.x))}`)
			}

			// 3. Use the coords of the “focus” point to calculate the focus pt's WQ ([dic, alk])
			sweetSpotX = newScaleX($targetWp.x) + margin.left + targetWpWidth / 2;
			sweetSpotY = newScaleY($targetWp.y) + margin.top + targetWpHeight;

			// If target waypoint dragged outside of chart bounds...

			// ... SiMPLIFIED RELATIONSHIP BETWEEN UPPER-LEFT & POINT OF TARGET ICON ... //
			// $targetWp.dic = newScaleX.invert(event.sourceEvent.offsetX - margin.left + (newScaleX($targetWp.x) - event.subject.x) + targetWpWidth / 2)

			// $targetWp.x = newScaleX.invert(newScaleX($targetWp.dic) - event.sourceEvent.offsetX + margin.left + event.subject.x - (targetWpWidth / 2))

			// console.log(`DIC: ${$targetWp.dic} <- X: ${$targetWp.x}`);
			// console.log(`${newScaleX($targetWp.dic) - newScaleX($targetWp.x)} = ${targetWpWidth / 2}`);
			// console.log(`X: ${$targetWp.x} = newScaleX.invert(newScaleX(${$targetWp.dic}) - ${targetWpWidth / 2}) = ${newScaleX.invert(newScaleX($targetWp.dic) - targetWpWidth / 2)}`);
			// ^^^^^^^^^^^^^^^^^^^^^

			$targetWp.dic = newScaleX.invert(sweetSpotX - margin.left);
			$targetWp.alk = newScaleY.invert(sweetSpotY - margin.top);

			// if (
			//   $targetWp.dic < 0.1 ||
			//   $targetWp.dic > 7.9 ||
			//   $targetWp.alk < minChartY ||
			//   $targetWp.alk > maxChartY
			// ) {
			//   console.log(`OUT_OF_BOUNDS`);
			//   // if ($targetWp.x < minChartX) $targetWp.dic = 0.5;
			//   // if ($targetWp.x > maxChartX) $targetWp.dic = 7.5;
			//   // if ($targetWp.alk < minChartY) $targetWp.alk = 0;
			//   // if ($targetWp.alk > maxChartY) $targetWp.alk = 8;

			//   $targetWp.x <= 0.1 ? $targetWp.x + 0.1 : $targetWp.x - 0.1;
			//   $targetWp.y <= 0.1 ? $targetWp.y + 0.1 : $targetWp.y - 0.1;

			//   sweetSpotX = newScaleX($targetWp.x) + margin.left + targetWpWidth / 2;
			//   sweetSpotY = newScaleY($targetWp.y) + margin.top + targetWpHeight;

			//   // If target waypoint dragged outside of chart bounds...
			//   $targetWp.dic = newScaleX.invert(sweetSpotX - margin.left);
			//   $targetWp.alk = newScaleY.invert(sweetSpotY - margin.top);

			//   myShiftX = newScaleX($targetWp.x) - event.subject.x;
			//   myShiftY = newScaleY($targetWp.y) - event.subject.y;

			//   mySvg
			//     .select("#init-to-target-line")
			//     .attr(
			//       "x2",
			//       event.sourceEvent.offsetX -
			//         margin.left +
			//         myShiftX +
			//         targetWpWidth / 2
			//     )
			//     .attr(
			//       "y2",
			//       event.sourceEvent.offsetY - margin.top + myShiftY + targetWpHeight
			//     )
			//     .style("stroke", "blue")
			//     .style("stroke-width", "2px");
			// } else {
			//   console.log(`NOT out-of-bounds`);

			target.select('svg.fa-icon.target-icon').attr('cursor', 'grab');

			target.select('#wq-target-group-circle .fa-icon').attr('cursor', 'grab');

			//   $targetWp.dic = newScaleX.invert(sweetSpotX - margin.left);
			//   $targetWp.alk = newScaleY.invert(sweetSpotY - margin.top);
			// }
		}

		// Implement zoom behavior
		// [NB] In Chrome Developer Tools, emulate mobile touch events...
		// see: https://www.frontify.com/en/blog/how-to-emulate-touch-events-in-chrome/
		function zoomed({ transform }) {
			// console.log(`...ZOOMED...`);
			// console.log(`Zoom Transform`, transform);

			// zoomed.attr("transform", transform);

			// Let D3 recalculate the new x- and y-scales
			// [??] Make this $: reactive, like xScale & yScale
			// [??] But...then how get the transform object?
			newScaleX = transform.rescaleX(xScale);
			newScaleY = transform.rescaleY(yScale);
			newScaleYPpm = transform.rescaleY(yScalePpm);

			let desiredScreenCoordX = newScaleX($targetWp.dic) - targetWpWidth / 2;
			let desiredScreenCoordY = newScaleY($targetWp.alk) - targetWpHeight;

			$targetWp.x = newScaleX.invert(desiredScreenCoordX);
			$targetWp.y = newScaleY.invert(desiredScreenCoordY);

			// console.log(`ZOOMED: $targetWp.y = ${$targetWp.y}`);

			// Re-set stored transform values here
			$wqMapTransformState = transform;
		}

		return {
			// update(newParams) {
			//   console.log(`Action update with `, newParams);
			// },

			destroy() {
				console.log(`Ex-ter-min-ate!`, node);
			}
		};
	};

	// const resetTarget = () => {
	// 	console.log(`Reset Target Waypoint...`);
	// 	$resetTargetWaypoint = false;
	// };

	function typewriter(node, { speed = 1 }) {
		const valid = node.childNodes.length === 1 && node.childNodes[0].nodeType === Node.TEXT_NODE;

		if (!valid) {
			throw new Error(`This transition only works on elements with a single text node child`);
		}

		const text = node.textContent;
		const duration = text.length / (speed * 0.01);

		return {
			duration,
			tick: (t) => {
				const i = Math.trunc(text.length * t);
				node.textContent = text.slice(0, i);
			}
		};
	}
</script>

<!-- <h2 class="tab-callout" class:active={step === 0}> -->
<h2 class="tab-callout">
	<span>The Water Quality Map</span>
</h2>

<!-- <h3 class="temp-and-sal-heading" class:active={step === 0}> -->
<h3 class="temp-and-sal-heading">
	Temperature: {round($tTemp - 273.15, 1).toFixed(1)}° C <span style="color: #ff3e00;">|</span>
	Salinity: {round($tSal, 1).toFixed(1)}‰
</h3>

<!-- <h5>
  WPs: [{round($initWp.dic, 2)}, {round($initWp.alk.alk, 2)}] -> [{round(
    $targetWp.dic,
    2
  )}, {round($targetWp.alk, 2)}] DIC: {round(dicInit, 2)}
  mmol/kg
</h5> -->

<div class="scatter-plot-div" bind:clientWidth={svgWidth}>
	{#if svgWidth}
		<svg id="wq-svg" use:addInvizRect width={svgWidth} height={svgHeight}>
			<!-- clip path definition -->
			<defs>
				<clipPath id="clipPathId">
					<rect id="clipRect" x={0} y={0} {width} {height} />
				</clipPath>
			</defs>

			<!-- <g> that's home to the clip path (where chart content lives) -->
			<g
				id="my-clipped-g"
				clip-path="url(#clipPathId)"
				transform={`translate(${margin.left}, ${margin.top})`}
				style="pointer-events: {isInputValid ? 'none' : 'none'}"
			>
				<!-- {#if step >= 0} -->
				{#each wqMapData.phTopo as ph}
					<!-- <g in:fade={{duration: 350}}> -->
					<g>
						<PhLine
							lineData={ph}
							xScale={isValidX ? newScaleX : xScale}
							yScale={isValidY ? newScaleY : yScale}
						/>
					</g>
				{/each}
				<!-- {/if} -->

				<!-- ** -- GREEN ZONE -- ** -->
				{#if (step === 5 && $showHideGreenZone) || step === 6}
					<g in:fly={{ x: -400, y: 300, duration: 750 }} out:fade>
						<GreenZone
							gzPoints={[...wqMapData.gzCoords, wqMapData.gzCoords[0]]}
							xScale={isValidX ? newScaleX : xScale}
							yScale={isValidY ? newScaleY : yScale}
						/>
					</g>
				{/if}

				<!-- ** -- OMEGA ARAGONITE ZONE -- ** -->
				<!-- {#if step >= 6 && $showHideOmegaArZone} -->
				{#if step === 4}
					<g>
						<OmegaArZone
							omegaArPoints={wqMapData.omegaArCoords}
							xScale={isValidX ? newScaleX : xScale}
							yScale={isValidY ? newScaleY : yScale}
						/>

						<rect class="info-rect" x={260} y={220} width={250} height={102} />

						<text class="wq-props-aragonite" x={40} y={50}>super-saturated</text>

						<text class="wq-props-aragonite" x={80} y={120}>with</text>

						<text class="wq-props-aragonite" x={120} y={190}>aragonite</text>

						<text class="wq-props" style="fill: rebeccapurple; font-size: 1.15rem;" x={277} y={245}
							>Aragonite Saturation Zone</text
						>

						<text class="wq-props" x={353} y={272}
							>&Omega;<tspan style="font-size: 0.75rem; font-style: oblique;">ar</tspan> = {$omegaArValue.toFixed(
								1
							)}</text
						>

						<line x1={320} y1={287} x2={450} y2={287} 
						stroke='rebeccapurple'
						stroke-linecap="round"
						stroke-dasharray="2, 4"
						stroke-width="2"
						stroke-opacity="0.40" />

						<text class="wq-props" x={278} y={309} style='font-size: 0.80rem;'
							>[Ca{superPlus}{superPlus}] = 0.01028 mol/kg (412.1 mg/kg)</text
						>
						<!-- > -->
					</g>
				{/if}

				<!-- ** -- BICARB or CARB line -- ** -->
				<!-- {#if step >= 6} -->
				{#if step === 6 && ($showHideBicarb || $showHideCarb || $showHideCaOh2 || $showHideAeration)}
					{#if $showHideBicarb && $showHideCarb}
						<g>
							<AdjZoneBicarbCarb
								adjBicarbCarbPoints={wqMapData.adjBicarCarbCoords.bicarbCarb}
								xScale={isValidX ? newScaleX : xScale}
								yScale={isValidY ? newScaleY : yScale}
							/>

							<text
								class="wq-props-aragonite"
								style="fill: rebeccapurple; font-size: 0.9rem;"
								x={350}
								y={55}>Bicarb-Carbonate</text
							>
							<text
								class="wq-props-aragonite"
								style="fill: rebeccapurple; font-size: 0.9rem;"
								x={334}
								y={95}>Adjustment</text
							>
							<text
								class="wq-props-aragonite"
								style="fill: rebeccapurple; font-size: 0.9rem;"
								x={310}
								y={135}>Zone</text
							>
						</g>
					{/if}

					{#if $showHideBicarb && $showHideCaOh2}
						<g>
							<AdjZoneBicarbCarb
								adjBicarbCarbPoints={wqMapData.adjBicarCarbCoords.bicarbHydroxide}
								xScale={isValidX ? newScaleX : xScale}
								yScale={isValidY ? newScaleY : yScale}
							/>

							<text
								class="wq-props-aragonite"
								style="fill: rebeccapurple; font-size: 1.1rem;"
								x={230}
								y={55}>BIcarbonate-Hydroxide</text
							>
							<text
								class="wq-props-aragonite"
								style="fill: rebeccapurple; font-size: 1.1rem;"
								x={255}
								y={95}>Adjustment</text
							>
							<text
								class="wq-props-aragonite"
								style="fill: rebeccapurple; font-size: 1.1rem;"
								x={275}
								y={135}>Zone</text
							>
						</g>
					{/if}

					{#if $showHideCarb && $showHideCaOh2}
						<g>
							<AdjZoneBicarbCarb
								adjBicarbCarbPoints={wqMapData.adjBicarCarbCoords.carbHydroxide}
								xScale={isValidX ? newScaleX : xScale}
								yScale={isValidY ? newScaleY : yScale}
							/>

							<text
								class="wq-props-aragonite"
								style="fill: rebeccapurple; font-size: 0.9rem;"
								x={188}
								y={55}>Carbonate-Hydroxide</text
							>
							<text
								class="wq-props-aragonite"
								style="fill: rebeccapurple; font-size: 0.9rem;"
								x={208}
								y={95}>Adjustment</text
							>
							<text
								class="wq-props-aragonite"
								style="fill: rebeccapurple; font-size: 0.9rem;"
								x={221}
								y={135}>Zone</text
							>
						</g>
					{/if}

					<!-- With AERATION -->

					{#if $showHideBicarb && $showHideAeration}
						<g>
							<AdjZoneBicarbCarb
								adjBicarbCarbPoints={wqMapData.adjBicarCarbCoords.bicarbAeration}
								xScale={isValidX ? newScaleX : xScale}
								yScale={isValidY ? newScaleY : yScale}
							/>

							<text
								class="wq-props-aragonite"
								style="fill: rebeccapurple; font-size: 1.1rem;"
								x={130}
								y={55}>Bicarbonate-Aeration</text
							>
							<text
								class="wq-props-aragonite"
								style="fill: rebeccapurple; font-size: 1.1rem;"
								x={150}
								y={95}>Adjustment</text
							>
							<text
								class="wq-props-aragonite"
								style="fill: rebeccapurple; font-size: 1.1rem;"
								x={170}
								y={135}>Zone</text
							>
						</g>
					{/if}

					{#if $showHideCarb && $showHideAeration}
						<g>
							<AdjZoneBicarbCarb
								adjBicarbCarbPoints={wqMapData.adjBicarCarbCoords.carbAeration}
								xScale={isValidX ? newScaleX : xScale}
								yScale={isValidY ? newScaleY : yScale}
							/>

							<text
								class="wq-props-aragonite"
								style="fill: rebeccapurple; font-size: 1.1rem;"
								x={80}
								y={55}>Carbonate-Aeration</text
							>
							<text
								class="wq-props-aragonite"
								style="fill: rebeccapurple; font-size: 1.1rem;"
								x={100}
								y={95}>Adjustment</text
							>
							<text
								class="wq-props-aragonite"
								style="fill: rebeccapurple; font-size: 1.1rem;"
								x={120}
								y={135}>Zone</text
							>
						</g>
					{/if}

					{#if $showHideCaOh2 && $showHideAeration}
						<g>
							<AdjZoneBicarbCarb
								adjBicarbCarbPoints={wqMapData.adjBicarCarbCoords.hydroxideAeration}
								xScale={isValidX ? newScaleX : xScale}
								yScale={isValidY ? newScaleY : yScale}
							/>

							<text
								class="wq-props-aragonite"
								style="fill: rebeccapurple; font-size: 1.1rem;"
								x={17}
								y={55}>Hydroxide-Aeration</text
							>
							<text
								class="wq-props-aragonite"
								style="fill: rebeccapurple; font-size: 1.1rem;"
								x={45}
								y={95}>Adjustment</text
							>
							<text
								class="wq-props-aragonite"
								style="fill: rebeccapurple; font-size: 1.1rem;"
								x={68}
								y={135}>Zone</text
							>
						</g>
					{/if}

					<!-- INDIVIDUAL RGTS -->

					{#if $showHideBicarb}
						<line
							id="init-bicarb-line"
							x1={$tX + initWpWidth / 2}
							y1={$tY + initWpHeight}
							x2={xScale(8)}
							y2={yScale(1 * (8.0 - dicInit) + newAlk)}
							stroke="blue"
							stroke-linecap="round"
							stroke-dasharray="7, 7"
							stroke-width="2"
							stroke-opacity="0.35"
						/>
					{/if}

					{#if $showHideCarb}
						<line
							id="init-bicarb-line"
							x1={$tX + initWpWidth / 2}
							y1={$tY + initWpHeight}
							x2={xScale(8)}
							y2={yScale(2 * (8.0 - dicInit) + newAlk)}
							stroke="green"
							stroke-linecap="round"
							stroke-dasharray="7, 7"
							stroke-width="2"
							stroke-opacity="0.35"
						/>
					{/if}

					{#if $showHideCaOh2}
						<line
							id="init-caoh2-line"
							x1={$tX + initWpWidth / 2}
							y1={$tY + initWpHeight}
							x2={$tX + initWpWidth / 2}
							y2={yScale(8.0)}
							stroke="red"
							stroke-linecap="round"
							stroke-dasharray="7, 7"
							stroke-width="2"
							stroke-opacity="0.35"
						/>
					{/if}

					{#if $showHideAeration}
						<line
							id="init-aeration-line"
							x1={$tX + initWpWidth / 2}
							y1={$tY + initWpHeight}
							x2={xScale(0.0)}
							y2={$tY + initWpHeight}
							stroke="rebeccapurple"
							stroke-linecap="round"
							stroke-dasharray="7, 7"
							stroke-width="2"
							stroke-opacity="0.35"
						/>
					{/if}
				{/if}

				<!-- ** -- UIAN DANGER ZONE -- ** -->
				{#if step === 2}
					<g in:fade={{ duration: 150 }}>
						<UianDangerZone
							uianCoords={wqMapData.uianCoords}
							xScale={isValidX ? newScaleX : xScale}
							yScale={isValidY ? newScaleY : yScale}
						/>
					</g>
					<g in:fade={{ duration: 150 }}>
						<image
							class="danger-image"
							href="danger-ammonia.png"
							x="45"
							y="50"
							height="100"
							width="100"
						/>
					</g>
				{/if}

				{#if step === 5}
					<g transition:fade>
						<UianDangerZone
							uianCoords={wqMapData.uianCoords}
							xScale={isValidX ? newScaleX : xScale}
							yScale={isValidY ? newScaleY : yScale}
						/>
					</g>
					<g transition:fade>
						<image
							class="danger-image"
							href="danger-ammonia.png"
							x="45"
							y="50"
							height="100"
							width="100"
						/>
					</g>
				{/if}

				<!-- ** -- CO2 DANGER ZONE -- ** -->
				{#if step === 3}
					<g transition:fade>
						<Co2DangerZone
							co2Coords={wqMapData.co2Coords}
							xScale={isValidX ? newScaleX : xScale}
							yScale={isValidY ? newScaleY : yScale}
						/>
					</g>
					<g transition:fade>
						<image
							class="danger-image"
							href="danger-co2.png"
							x="350"
							y="220"
							height="100"
							width="100"
						/>
					</g>
				{/if}
				<!-- {#if step === 6 && !$showHideGreenZone} -->
				{#if step === 5}
					<g transition:fade>
						<Co2DangerZone
							co2Coords={wqMapData.co2Coords}
							xScale={isValidX ? newScaleX : xScale}
							yScale={isValidY ? newScaleY : yScale}
						/>
					</g>
					<g transition:fade>
						<image
							class="danger-image"
							href="danger-co2.png"
							x="350"
							y="220"
							height="100"
							width="100"
						/>
					</g>
				{/if}

				<!-- ** -- INITIAL WAYPOINT -- ** -->
				<!-- {#if step >= 2} -->
				{#if step === 1}
					<g transition:fade class="my-icon" transform={`translate(${$tX}, ${$tY})`}>
						<Icon data={mapPin} scale="2" style="fill: rgb(21, 85, 146);" />
					</g>
				{/if}

				<!-- ** -- WQ PROPS at INITIAL WAYPOINT -- ** -->
				{#if step === 1}
					<g transition:fade>
						<rect class="info-rect" x={333} y={185} width={160} height={178} />

						<text class="wq-props" x={368} y={210}>pH:</text>
						<text class="wq-props" x={400} y={210}>{round($tPh, 2).toFixed(2)} (NBS)</text>

						<text class="wq-props" x={357} y={244}>[Alk]:</text>
						<text class="wq-props" x={400} y={235}>{round($tAlk, 1).toFixed(1)} meq/kg</text>
						<text class="wq-props" x={400} y={255}
							>{round($tAlk * (100.0869 / 2), 1).toFixed(1)} ppm</text
						>

						<text class="wq-props" x={344} y={280}>UIA-N:</text>
						<text class="wq-props" x={400} y={280}>{round($tUian, 2).toFixed(2)} µg/L</text>

						<text class="wq-props" x={359} y={305}>CO{subTwo}:</text>
						<text class="wq-props" x={400} y={305}>{round($tCo2, 2).toFixed(2)} mg/L</text>

						<text class="wq-props" x={362} y={332}
							>&Omega;<tspan style="font-size: 0.75rem; font-style: italic;">ca</tspan>:</text
						>
						<text class="wq-props" x={400} y={332}>{round($tOmegaCa, 2).toFixed(2)}</text>

						<text class="wq-props" x={363} y={352}
							>&Omega;<tspan style="font-size: 0.75rem; font-style: italic;">ar</tspan>:</text
						>
						<text class="wq-props" x={400} y={352}>{round($tOmegaAr, 2).toFixed(2)}</text>
					</g>
				{/if}

				<!-- ** -- TA-N & UIA-N INFO AT STEP 3 -- ** -->
				{#if step === 2}
					<g transition:fade>
						<rect class="info-rect" x={333} y={220} width={173} height={100} />

						<text class="wq-props" x={375} y={245}>TA-N:</text>
						<text class="wq-props" x={420} y={245}>{round($tTan, 2).toFixed(2)} mg/L</text>

						<text class="wq-props" x={344} y={270}
							><tspan class="crit-label">crit</tspan> UIA-N:</text
						>
						<text class="wq-props" x={420} y={270}>{round($tUianCrit, 1).toFixed(1)} µg/L</text>

						<line
							x1={390}
							y1={285}
							x2={460}
							y2={285}
							stroke="red"
							stroke-linecap="round"
							stroke-dasharray="2, 4"
							stroke-width="2"
							stroke-opacity="0.40"
						/>

						<text class="wq-props" x={370} y={308}><tspan class="crit-label">safe</tspan> pH</text>
						<text class="wq-props" x={425} y={308}
							><tspan style="fill: #bf0d0d;">&#8804; {round($tCritPhUian, 2).toFixed(2)}</tspan
							></text
						>
					</g>
				{/if}

				<!-- ** -- CO2 INFO AT STEP 4 -- ** -->
				{#if step === 3}
					<g transition:fade>
						<rect
							class="info-rect"
							x={80}
							y={110}
							width={170}
							height={40}
							style="fill: yellow; opacity: 0.25"
						/>

						<text class="wq-props" x={89} y={135}
							><tspan class="crit-label">safe</tspan> CO{subTwo}</text
						>
						<text class="wq-props" x={154} y={135}
							>&#8804; {round($tCritCo2, 1).toFixed(1)} mg/L</text
						>
					</g>
				{/if}

				<!-- Show initial WP AGAIN (for last step) -->
				{#if step === 6}
					<g class="my-icon" transform={`translate(${$tX}, ${$tY})`}>
						<Icon data={mapPin} scale="2" style="fill: red; opacity: 0.5;" />
					</g>
				{/if}

				<!-- ** -- CONSTANT Alkalinity = 2.0 meq/kg -- ** -->
				<!-- <line
					id="const-alk-line"
					x1={xScale(0)}
					y1={yScale(2.0)}
					x2={xScale(8)}
					y2={yScale(2.0)}
					stroke="rebeccapurple"
					stroke-linecap="round"
					stroke-dasharray="2, 4"
					stroke-width="1"
					stroke-opacity="0.75"
				/> -->

				<!-- TARGETWP ALK -->
				<!-- <text x={xScale(0.05)} y={yScale(2.0 + 0.12)} style="fill: blue; text-anchor: start;"
					>{'2.00 meq/kg'}</text
				>
				<text x={xScale(0.05)} y={yScale(2.0 - 0.3)} style="fill: blue; text-anchor: start;"
					>{'100.1 ppm'}</text
				> -->

				<!-- Initial-to-target WP line -->
				<!-- <line
          id="init-to-target-line"
          x1={$tX + initWpWidth / 2}
          y1={$tY + initWpHeight}
          x2={newScaleX ? newScaleX($targetWp.dic) : xScale($targetWp.dic)}
          y2={newScaleY ? newScaleY($targetWp.alk) : yScale($targetWp.alk)}
          stroke="#566b21"
          stroke-linecap="round"
          stroke-width="2"
        /> -->

				<!-- ** -- TARGET WAYPOINT -- ** -->
				<!-- transform={`translate(${$tX_Target}, ${$tY_Target})`} -->
				<!-- <g
          id="wq-target-group"
          transform={`translate(${$tX_Target}, ${$tY_Target})`}
        > -->
				<!-- <g
          id="wq-target-group"
          transform={`translate(${
            newScaleX ? newScaleX($targetWp.x) : xScale($targetWp.x)
          }, ${newScaleY ? newScaleY($targetWp.y) : yScale($targetWp.y)})`}
        >
          <Icon class="target-icon" data={mapMarker} scale="2" />
          <g
            id="wq-target-group-circle"
            transform={`translate(${3.95}, ${4.5})`}
          >
            <Icon data={circle} scale="0.75" />
          </g>
        </g> -->
			</g>

			{#if !isInputValid}
				<rect
					id="error-rect"
					x={margin.left}
					y={margin.top}
					{width}
					{height}
					style="pointer-events: none; outline: 3px solid rgba(255, 0, 0, 0.1)"
				/>
			{/if}

			<!-- 
    [NB] 'Invisible' rect that captures zoom & pan pointer events
         append-ed to svg within Svelte "addInvizRect" action
   -->

			<!-- {#if step >= 0} -->
			<g>
				<Axis {width} {height} {margin} scale={isValidX ? newScaleX : xScale} position="bottom" />
				<Axis {width} {height} {margin} scale={isValidY ? newScaleY : yScale} position="left" />
				<Axis
					{height}
					{width}
					{margin}
					scale={isValidY ? newScaleYPpm : yScalePpm}
					position="right"
				/>
				<Axis {height} {width} {margin} scale={isValidX ? newScaleX : xScale} position="top" />
			</g>
			<!-- {/if} -->
		</svg>
	{/if}
</div>

<style>
	/* #eqns { */
	/* background-size: 2px 3px; */
	/* height: 400px;
		width: 620px;
	} */

	/* #wq-svg { */
	/* outline: 1px solid skyblue; */
	/* width: 780px;
    height: 520px; */
	/* } */

	#error-rect {
		fill: red;
		opacity: 0.1;
		/* outline: 3px solid rgba(255, 0, 0, 0.1); */
		/* border-radius: 2px;
    overflow: hidden; */
		/* pointer-events: none;
    cursor: not-allowed; */
	}

	h2 {
		color: rebeccapurple;
		margin-bottom: 16px;
	}

	h2 span {
		padding: 4px;
		font-family: sans-serif;
		/* background-color: rgb(229, 241, 252); */
	}

	h2.tab-callout::before {
		content: '';
		border-top: 2px solid #ff3e00;
		border-bottom: 2px solid #ff3e00;
		border-left: 2px solid #ff3e00;
		padding: 4px;
		border-top-left-radius: 6px;
		border-bottom-left-radius: 6px;
		/* background-color: rgb(229, 241, 252); */
		padding-right: 0.5rem;

		opacity: 1;
		transition: opacity 0.5s;
		transition-delay: 0.25s;
	}

	h2.tab-callout::after {
		content: '';
		border-top: 2px solid #ff3e00;
		border-bottom: 2px solid #ff3e00;
		border-right: 2px solid #ff3e00;
		padding: 4px;
		border-top-right-radius: 6px;
		border-bottom-right-radius: 6px;
		/* background-color: rgb(229, 241, 252); */
		padding-left: 0.5rem;

		opacity: 1;
		transition: opacity 0.5s;
		transition-delay: 0.25s;
	}

	h2.tab-callout span {
		opacity: 1;
		transition: opacity 0.5s;
		transition-delay: 0.25s;
	}

	.temp-and-sal-heading {
		color: #555;
		font-family: sans-serif;

		/* visibility: visible; */
		opacity: 1;
		transition: opacity 0.5s;
		transition-delay: 0.25s;
		/* transition: opacity 2.8s, visibility 2.8s; */
	}

	/* h2.tab-callout.active,
	h2.tab-callout.active::before,
	h2.tab-callout.active::after,
	h2.tab-callout.active span,
	.temp-and-sal-heading.active {
		opacity: 0;
		transition: opacity 0.3s;
	} */

	.info-rect {
		fill: #fdedce;
		opacity: 0.35;
		border-radius: 8px;
		/* filter: drop-shadow(3px 5px 2px rgb(0 0 0 / 0.4)); */
		outline: 2px solid rgba(205, 121, 38, 0.85);
	}

	.wq-props {
		fill: #555;
		font-family: sans-serif;
		text-anchor: start;
		font-size: 1rem;
	}

	.wq-props-aragonite {
		font-family: sans-serif;
		fill: rebeccapurple;
		font-size: 1.5rem;
		/* see: https://css-tricks.com/adding-shadows-to-svg-icons-with-css-and-svg-filters/ */
		/* 
			"That will apply a shadow that starts at 3px horizontally, 
				5px down, 
				with 2px of blur, 
				and is 40% black." 
		*/
		filter: drop-shadow(5px 4px 2px rgb(0 0 0 / 0.2));
	}

	/* style "crit" label in tspan for, e.g., crit UIA-N */
	.crit-label {
		fill: #bf0d0d;
		font-style: italic;
		font-size: 0.9rem;
	}

	.danger-image {
		filter: drop-shadow(3px 5px 2px rgb(0 0 0 / 0.4));
	}
</style>
