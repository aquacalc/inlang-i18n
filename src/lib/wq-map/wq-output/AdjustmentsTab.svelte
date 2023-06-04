<script>
	import {
		showHideGreenZoneFn,
		showHideCo2ZoneFn,
		showHideUianZoneFn
		// resetTargetWaypoint
	} from '../../wq-stores/ShowHideStore';

	const showHideGreenZone = showHideGreenZoneFn();
	const showHideCo2Zone = showHideCo2ZoneFn();
	const showHideUianZone = showHideUianZoneFn();

	import { subTwo } from '../wqmap-controls/wq-input/WqInputData';

	let showHideGz = $showHideGreenZone;
	let showHideCo2 = $showHideCo2Zone;
	let showHideUian = $showHideUianZone;

	// let resetTargetWp = $resetTargetWaypoint;

	// Reset Target Waypoint on WQ Map
	let resetTarget = false;

	const toggleCo2Display = () => {
		$showHideCo2Zone = showHideCo2;
	};

	const toggleGzDisplay = () => {
		$showHideGreenZone = showHideGz;
	};

	const toggleUianDisplay = () => {
		$showHideUianZone = showHideUian;
	};

	// const resetTargetWpAction = () => {
	//   $resetTargetWaypoint = true;
	// }
</script>

<div class="adjustment-body">
	<label for="green-zone"
		>{showHideGz ? 'Hide ' : 'Show '}Green Zone
		<input
			type="checkbox"
			name="green-zone"
			id="green-zone"
			bind:checked={showHideGz}
			on:change={toggleGzDisplay}
		/></label
	>

	<label for="uian-zone"
		>{showHideUian ? 'Hide ' : 'Show '}UIA-N Zone
		<input
			type="checkbox"
			name="uian-zone"
			id="uian-zone"
			bind:checked={showHideUian}
			on:change={toggleUianDisplay}
		/></label
	>

	<label for="co2-zone"
		>{showHideCo2 ? 'Hide ' : 'Show '}{`CO${subTwo} Zone`}
		<input
			type="checkbox"
			name="co2-zone"
			id="co2-zone"
			bind:checked={showHideCo2}
			on:change={toggleCo2Display}
		/></label
	>

	<!-- <button id='reset-target-btn' on:click={resetTargetWpAction} >Reset Target</button> -->
</div>

<style>
	.adjustment-body {
		height: 435px;
		width: 50%;
		color: rgb(5, 39, 79);
		text-align: right;
	}

	#reset-target-btn {
		border-radius: 0.25rem;
		cursor: pointer;
		font-weight: 400;
		background-color: rebeccapurple;
		color: #efefef;
		box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
		max-width: 250px;
		opacity: 0.75;
	}
	#reset-target-btn:hover {
		/* background-color: #efefef;
    color: rebeccapurple; */
		opacity: 1;
		box-shadow: 0 0px 0px 0 rgba(0, 0, 0, 0.1), 0 0px 0px 0 rgba(0, 0, 0, 0.06);
	}
</style>
