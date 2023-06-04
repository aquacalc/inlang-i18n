<script>
	import { co2CritObjFn, tempObjFn, salObjFn } from '../../../wq-stores/WqMapStateStoreScrolly';

	// [TEST] input -> store -> convert -> store
	// import { wqMapState } from "../../../stores/WqMapStore";

	import WqInput from '../wq-input/WqInput.svelte';
	import { co2CritData, subTwo } from '../wq-input/WqInputData';

	import {
		// calcRho,
		alkToIcUnits,
		ammoniaToTargetUnits,
		percentNh3ForTemp,
		critPhFreeForTanMillero
	} from '../../wq-brains/CarbCalcFunctions';

	const co2CritObj = co2CritObjFn();
	const tempObj = tempObjFn();
	const salObj = salObjFn();

	// export let phFree_init;
	// export let uian_crit;

	// --------------- TA-N & UIA-N* ----------------
	// [NB] convert TA-N & UIA-N* in compatible units
	// $: rho = calcRho($tempObj.icInput, $salObj.icInput);

	// $: inputTanInMgPerL = ammoniaToTargetUnits(
	//   $co2CritObj.input,
	//   $co2CritObj.selected,
	//   "mg/L",
	//   rho,
	//   percentUian
	// );

	// $: console.log(`$uianObj: `, $uianObj);
	// $: console.log(`rho: ${rho} g/L`);
	// $: console.log(`percentUian: ${percentUian}%`);
	// $: console.log(`inputTanInMgPerL: ${inputTanInMgPerL} mg/L`);

	const onChangeCo2Crit = (data) => {
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
			// let inputTanInMgPerL = ammoniaToTargetUnits(
			//   +data.input,
			//   data.selected,
			//   "mg/L",
			//   rho,
			//   percentUian
			// );

			// console.log(`percentUian: ${percentUian}%`);
			// console.log(`inputTanInMgPerL: ${inputTanInMgPerL} mg/L`);

			// Convert input crit UIA-N to insure it's in μg/L
			// const critUianInMicrogramsPerLiter = ammoniaToTargetUnits(
			//   +uian_crit.value,
			//   uian_crit.units,
			//   "μg/L",
			//   rho,
			//   percentUian
			// );

			// let critPh = critPhFreeForTanMillero(
			//   +inputTanInMgPerL * 1000, // [TEST] measured TA-N in μg/L
			//   +critUianInMicrogramsPerLiter, // [NB] The CRITICAL UIA-N in μg/L
			//   // +uian_crit.value, // [NB] The CRITICAL UIA-N in same units as inputTanInTargetUnits
			//   +$tempObj.icInput,
			//   +$salObj.icInput
			// );

			// ^^^^^^^^^^^^^^^^^^^^^^^^^^ //

			$co2CritObj = data;
			$co2CritObj.icInput = data.input;

			// [TEST] Persist input CO2 to WqMapState store
			// $wqMapState.co2 = data.input;

			// $co2CritObj.selectedShort =
			//   co2CritData.unitsShort[co2CritData.unitsLong.indexOf(data.selected)];

			// Need to set explicitly??
			$co2CritObj.isValid = true;
		} else {
			$co2CritObj.isValid = false;
		}
	};
</script>

<section>
	<!-- <h3 class="text-center">WQ Input Test</h3> -->
	<div class="unit-type">
		<WqInput
			name="co2_crit"
			id="co2_crit"
			title={`crit ${'CO' + subTwo}`}
			inputData={co2CritData}
			onChange={onChangeCo2Crit}
			bind:value={$co2CritObj.input}
			bind:units={$co2CritObj.selected}
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
