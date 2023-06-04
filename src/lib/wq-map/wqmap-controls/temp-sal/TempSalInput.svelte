<script>
	import { tempObjFn, salObjFn } from '../../../wq-stores/WqMapStateStoreScrolly';

	import WqInput from '../wq-input/WqInput.svelte';
	import { tempData, salData } from '../wq-input/WqInputData';

	import {
		tempToIcUnits,
		reduceSalIndex,
		salToIcUnits
		// round,
	} from '../../wq-brains/SalConversionNew';

	const tempObj = tempObjFn();
	const salObj = salObjFn();

	$: myIcTemp = tempToIcUnits(+$tempObj.input, $tempObj.selected);
	// $: console.log(`I.C. Temp: ${myIcTemp} K`);

	const onChangeTemp = (data) => {
		// console.log(`TEMP ${data.input}`);

		// [NB] IFF entered temp is valid, then calc new IC temp and update store
		if (data.isValid) {
			let myIcTemp = tempToIcUnits(+data.input, data.selected);

			$tempObj = data;
			$tempObj.icInput = myIcTemp;

			$tempObj.selectedShort = tempData.unitsShort[tempData.unitsLong.indexOf(data.selected)];

			// Need to set explicitly??
			$tempObj.isValid = true;
		} else {
			$tempObj.isValid = false;
		}
	};

	const onChangeSal = (data) => {
		// console.log(`SAL ${data.input}`);

		if (data.isValid && data.input !== '') {
			let salUnitsIndex = reduceSalIndex(data.selected);

			let icSal = salToIcUnits(+data.input, salUnitsIndex, +$tempObj.icInput, 0);

			console.log(`icSal at ${$tempObj.icInput}° K = ${icSal}`);

			$salObj = data;
			$salObj.icInput = icSal;

			$salObj.selectedShort = salData.unitsShort[salData.unitsLong.indexOf(data.selected)];

			// Need to set explicitly??
			$salObj.isValid = true;
		} else {
			$salObj.isValid = false;
		}
	};
</script>

<section>
	<!-- <h3 class="text-center">WQ Input Test</h3> -->
	<div class="unit-type">
		<WqInput
			name="temp"
			id="temp"
			title="Temperature"
			inputData={tempData}
			onChange={onChangeTemp}
			bind:value={$tempObj.input}
			bind:units={$tempObj.selected}
		/>

		<WqInput
			name="sal"
			id="sal"
			title="Salinity"
			inputData={salData}
			onChange={onChangeSal}
			bind:value={$salObj.input}
			bind:units={$salObj.selected}
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
