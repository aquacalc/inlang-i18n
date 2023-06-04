<script>
	import { phObj, alkObj } from '../../../stores/PhAlkStore';
	import { initWp, targetWp } from '../../wq-stores/WaypointStoreScrolly';

	import WqInput from '../wq-input/WqInput.svelte';
	import { phData, alkData } from '../wq-input/WqInputData';

	import { phNbsToPhFree } from '../../wq-brains/CarbCalcFunctions';

	import {
		// calcRho,
		alkToIcUnits,
		ammoniaToTargetUnits,
		percentNh3ForTemp,
		critPhFreeForTanMillero
	} from '../../wq-brains/CarbCalcFunctions';

	const onChangePhNbsToFree = (data) => {
		console.log(`pH data; `, data);
		// [NB] IFF entered temp is valid, then calc new IC temp and update store
		if (data.isValid) {
			$phObj = data;

			// $phObj.phFree =

			$initWp.phNbs = data.input;

			// Need to set explicitly??
			$phObj.isValid = true;
		} else {
			$phObj.isValid = false;
		}
	};

	const onChangeAlk = (data) => {
		if (data.isValid) {
			$alkObj = data;

			$initWp.alk = data.input;

			$alkObj.isValid = true;
		} else {
			$alkObj.isValid = false;
		}
	};
</script>

<section>
	<!-- <h3 class="text-center">WQ Input Test</h3> -->
	<div class="unit-type">
		<WqInput
			name="ph_nbs"
			id="ph_nbs"
			title="pH (NBS)"
			inputData={phData}
			onChange={onChangePhNbsToFree}
			bind:value={$phObj.input}
			bind:units={$phObj.selected}
		/>

		<WqInput
			name="alk_init"
			id="alk_init"
			title="Initial Alkalinity"
			inputData={alkData}
			onChange={onChangeAlk}
			bind:value={$alkObj.input}
			bind:units={$alkObj.selected}
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
