<script>
	import {
		calcCo2OfDic,
		calcPhForAlkDic,
		findPhFromAlkDic, // Better method
		calcHCO3,
		calcCO3,
		calcBorate,
		calcHydroxide,
		calcHydronium,
		calcRho,
		phNbsToPhFree,
		calcDicOfAlkPh
	} from '../wq-brains/CarbCalcFunctions';

	import { initWpFn } from '../../wq-stores/WaypointStoreScrolly';
	import { tempObjFn, salObjFn } from '../../wq-stores/WqMapStateStoreScrolly';

	const initWp = initWpFn();
	const tempObj = tempObjFn();
	const salObj = salObjFn();

	import WqInput from '../wqmap-controls/wq-input/WqInput.svelte';
	import { phData, alkData } from '../wqmap-controls/wq-input/WqInputData';

	// see: https://www.npmjs.com/package/svelte-collapsible
	import { CollapsibleCard } from 'svelte-collapsible';

	// METHODS: INITIAL WP
	const onChangePhNbsToFree = (data) => {
		console.log(`pH data; `, data);
		// [NB] IFF entered temp is valid, then calc new IC temp and update store
		if (data.isValid) {
			// Re-set initWp's phNbs
			$initWp.ph.phNbs = data.input;

			// Calc new phFree & set to store
			$initWp.ph.phFree = phNbsToPhFree(+data.input, $salObj.icInput, $tempObj.icInput, 0);

			// Update DIC with new phFree & new alk
			$initWp.dic =
				calcDicOfAlkPh(
					$initWp.alk.alk / 1000,
					$initWp.ph.phFree,
					$tempObj.icInput,
					$salObj.icInput
				) * 1000;

			// console.log(typeof $initWp.ph.phFree);
			// console.log(`0. DIC ${$initWp.dic} mmol/kg`);
			// console.log(`pH ${data.input} ${$initWp.ph.phNbs} NBS`);
			// console.log(`pH ${$initWp.ph.phFree} FREE`);
			// console.log(`pH ${$tempObj.icInput} K`);

			console.log(`1. DIC ${$initWp.dic} mmol/kg`);

			// Need to set explicitly??
			$initWp.isValid = true;
		} else {
			$initWp.isValid = false;
		}
	};

	const onChangeAlk = (data) => {
		console.log(`ALK: `, data);
		if (data.isValid) {
			$initWp.alk.alk = data.input;
			$initWp.alk.alkSelected = data.selected;

			$initWp.isValid = true;
		} else {
			$initWp.isValid = false;
		}
	};

	// // METHODS: TARGET WP
	// const onChangePhNbsToFree_Target = (data) => {
	//   console.log(`pH data; `, data);
	//   // [NB] IFF entered temp is valid, then calc new IC temp and update store
	//   if (data.isValid) {
	//     $targetWp.ph.phNbs = data.input;

	//     // Need to set explicitly??
	//     $targetWp.isValid = true;
	//   } else {
	//     $targetWp.isValid = false;
	//   }
	// };

	// const onChangeAlk_Target = (data) => {
	//   console.log(`ALK: `, data);
	//   if (data.isValid) {
	//     $targetWp.alk.alk = data.input;
	//     $targetWp.alk.alkSelected = data.selected;

	//     $targetWp.isValid = true;
	//   } else {
	//     $targetWp.isValid = false;
	//   }
	// };
</script>

<h4 style="margin: 0">Waypoints WQ</h4>

<div class="container" style="display: flex; justify-content: space-between;">
	<div class="drawer-input">
		<div class="cards">
			<CollapsibleCard>
				<h5 slot="header" class="header">
					Initial:
					{$initWp.ph.phNbs}{$initWp.ph.phSelectedShort} | {$initWp.alk.alk}{$initWp.alk
						.alkSelectedShort}
				</h5>
				<div slot="body" class="body">
					<div class="unit-type">
						<WqInput
							name="ph_nbs"
							id="ph_nbs"
							title="pH (NBS)"
							inputData={phData}
							onChange={onChangePhNbsToFree}
							bind:value={$initWp.ph.phNbs}
							bind:units={$initWp.ph.phSelected}
						/>
						<hr class="hr-divider" />

						<WqInput
							name="alk_init"
							id="alk_init"
							title="Initial Alkalinity"
							inputData={alkData}
							onChange={onChangeAlk}
							bind:value={$initWp.alk.alk}
							bind:units={$initWp.alk.alkSelected}
						/>
					</div>
				</div>
			</CollapsibleCard>

			<!-- <CollapsibleCard>
        <h5 slot="header" class="header">
          Target:
          {$targetWp.ph.phNbs}{$targetWp.ph.phSelectedShort} | {$targetWp.alk
            .alk}{$targetWp.alk.alkSelectedShort}
        </h5>
        <div slot="body" class="body">
          <div class="unit-type">
            <WqInput
              name="ph_nbs_target"
              id="ph_nbs_target"
              title="pH (NBS)"
              inputData={phData}
              onChange={onChangePhNbsToFree_Target}
              bind:value={$targetWp.ph.phNbs}
              bind:units={$targetWp.ph.phSelected}
            />
            <hr class="hr-divider" />

            <WqInput
              name="alk_init_Target"
              id="alk_init_Target"
              title="Initial Alkalinity"
              inputData={alkData}
              onChange={onChangeAlk_Target}
              bind:value={$targetWp.alk.alk}
              bind:units={$targetWp.alk.alkSelected}
            />
          </div>
        </div>
      </CollapsibleCard> -->
		</div>
	</div>
</div>

<style>
	/* -- Collapsible -- */
	.drawer-input {
		margin: 0 auto;
	}

	.cards {
		width: 100%;
		max-width: 550px;
		/* [NB] CENTER Collabsible card */
		margin: 0 auto;
	}

	:global(.card) {
		margin-top: 1em;
		overflow: hidden;
		font-family: Arial, Helvetica, sans-serif;
	}

	.header {
		margin: 0;
		padding: 0.5em;
		border: 1px solid rgb(100, 120, 140);
		border-radius: 5px;
		/* background: rgb(124, 149, 224); */
		background-image: linear-gradient(rgb(21, 85, 146), rgb(28, 126, 214));
		transition: border-radius 0.5s step-end;
		font-weight: 100;
		color: #efefef;
	}

	:global(.card.open) .header {
		border-bottom-left-radius: 0;
		border-bottom-right-radius: 0;
		transition: border-radius 0.5s step-start;
	}

	.body {
		padding: 0.5em;
		border: 1px solid rgb(100, 120, 100);
		margin-top: 0.25em;
		/* background: rgba(117, 115, 117, 0.511); */
		background: rgba(245, 245, 245, 0.95);
		display: flex;
		justify-content: center;
		border-radius: 5px;
		border-top-left-radius: 0;
		border-top-right-radius: 0;
	}

	.hr-divider {
		background-color: rgb(28, 126, 214);
		margin: 0.75rem auto;
		width: 60%;
		height: 0.75px;
	}
</style>
