<script>
	import {
		tanObjFn,
		uianObjFn,
		tempObjFn,
		salObjFn
	} from '../../../wq-stores/WqMapStateStoreScrolly';

	import WqInput from '../wq-input/WqInput.svelte';
	import { ammoniaData, uiaData } from '../wq-input/WqInputData';

	import {
		calcRho,
		alkToIcUnits,
		ammoniaToTargetUnits,
		percentNh3ForTemp,
		critPhFreeForTanMillero
	} from '../../wq-brains/CarbCalcFunctions';

	// import {
	//   // tempToIcUnits,
	//   reduceSalIndex,
	//   salToIcUnits,
	//   round,
	// } from "../../wq-brains/SalConversionNew";

	const tanObj = tanObjFn();
	const uianObj = uianObjFn();
	const tempObj = tempObjFn();
	const salObj = salObjFn();

	export let phFree_init;
	export let uian_crit;

	// --------------- TA-N & UIA-N* ----------------
	// [NB] convert TA-N & UIA-N* in compatible units
	$: rho = calcRho($tempObj.icInput, $salObj.icInput);

	$: percentUian = percentNh3ForTemp($tempObj.icInput, $salObj.icInput, +phFree_init);

	$: inputTanInMgPerL = ammoniaToTargetUnits(
		$tanObj.input,
		$tanObj.selected,
		'mg/L',
		rho,
		percentUian
	);

	// $: console.log(`$uianObj: `, $uianObj);
	// $: console.log(`rho: ${rho} g/L`);
	// $: console.log(`percentUian: ${percentUian}%`);
	// $: console.log(`inputTanInMgPerL: ${inputTanInMgPerL} mg/L`);

	const onChangeTan = (data) => {
		// console.log(`TA-N ${data.input}`);

		// [NB] IFF entered temp is valid, then calc new IC temp and update store
		if (data.isValid) {
			// --------------- TA-N & UIA-N* ----------------
			// [NB] convert TA-N & UIA-N* in compatible units
			// const percentUian = percentNh3ForTemp(
			//   $tempObj.icInput,
			//   $salObj.icInput,
			//   +phFree_init
			// );

			// **** -- RE-VISIT -- this choice ***
			// [NB] NOT in IC units, mg/kg (ppm), because force MICRO-gram/L
			//      in critPh calculation (below)
			let inputTanInMgPerL = ammoniaToTargetUnits(
				+data.input,
				data.selected,
				'mg/L',
				rho,
				percentUian
			);

			// console.log(`percentUian: ${percentUian}%`);
			// console.log(`inputTanInMgPerL: ${inputTanInMgPerL} mg/L`);

			// Convert input crit UIA-N to insure it's in μg/L
			const critUianInMicrogramsPerLiter = ammoniaToTargetUnits(
				+uian_crit.value,
				uian_crit.units,
				'μg/L',
				rho,
				percentUian
			);

			let critPh = critPhFreeForTanMillero(
				+inputTanInMgPerL * 1000, // [TEST] measured TA-N in μg/L
				+critUianInMicrogramsPerLiter, // [NB] The CRITICAL UIA-N in μg/L
				// +uian_crit.value, // [NB] The CRITICAL UIA-N in same units as inputTanInTargetUnits
				+$tempObj.icInput,
				+$salObj.icInput
			);

			// console.log(` `);
			// console.log(`...Conversions...`);
			// console.log(
			//   `  TA-N: ${$tanObj.input} ${$tanObj.selected} -> ${inputTanInMgPerL} mg/L`
			// );
			// console.log(
			//   `UIA-N*: ${uian_crit.value} ${uian_crit.units} -> ${critUianInMicrogramsPerLiter} µg/L`
			// );
			// console.log(`   pH*: ${critPh} FREE`);
			// // console.log(`  CO2*: ${critCo2_mgL} mg/L`)
			// console.log(` `);

			// ^^^^^^^^^^^^^^^^^^^^^^^^^^ //

			$tanObj = data;
			$tanObj.icInput = inputTanInMgPerL;

			$tanObj.selectedShort = ammoniaData.unitsShort[ammoniaData.unitsLong.indexOf(data.selected)];

			// Need to set explicitly??
			$tanObj.isValid = true;
		} else {
			$tanObj.isValid = false;
		}
	};

	const onChangeUianCrit = (data) => {
		// console.log(`UIA-N crit ${data.input}...`, data);

		if (data.isValid && data.input !== '') {
			$uianObj = data;
			$uianObj.icInput = data.input;

			$uianObj.selectedShort = uiaData.unitsShort[uiaData.unitsLong.indexOf(data.selected)];

			// Need to set explicitly??
			$uianObj.isValid = true;
		} else {
			$uianObj.isValid = false;
		}
	};

	// $: critUianTitle = `<span><em style="color: red">crit</em> UIA-N</span>`;
</script>

<section>
	<!-- <h3 class="text-center">WQ Input Test</h3> -->
	<div class="unit-type">
		<WqInput
			name="tan"
			id="tan"
			title="TA-N"
			inputData={ammoniaData}
			onChange={onChangeTan}
			bind:value={$tanObj.input}
			bind:units={$tanObj.selected}
		/>
		<!-- {@html critUianTitle} -->
		<WqInput
			name="uian-crit"
			id="uian-crit"
			title="crit UIA-N"
			inputData={uiaData}
			onChange={onChangeUianCrit}
			bind:value={$uianObj.input}
			bind:units={$uianObj.selected}
		/>
	</div>
</section>

<style>
	.unit-type {
		display: flex;
		/* gap: 0.25rem; */
		flex-direction: column;
		/* justify-content: center;
    align-items: center; */
		font-size: 1.1rem;
		color: rgb(86, 85, 85);
		/* width: 100%; */
	}
</style>
