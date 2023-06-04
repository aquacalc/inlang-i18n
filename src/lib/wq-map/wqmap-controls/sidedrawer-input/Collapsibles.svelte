<script>
	// see: https://www.npmjs.com/package/svelte-collapsible
	import { CollapsibleCard } from 'svelte-collapsible';

	import TempSalInput from '../temp-sal/TempSalInput.svelte';
	import TanUianInput from '../tan-uian/TanUianInput.svelte';
	import Co2Input from '../co2/Co2Input.svelte';

	// WQ Store
	import {
		tempObjFn,
		salObjFn,
		tanObjFn,
		uianObjFn,
		co2CritObjFn
		// anObject,
		// aCompressedObject,
	} from '../../../wq-stores/WqMapStateStoreScrolly';

	const tempObj = tempObjFn();
	const salObj = salObjFn();
	const tanObj = tanObjFn();
	const uianObj = uianObjFn();
	const co2CritObj = co2CritObjFn();
</script>

<div class="cards">
	<CollapsibleCard>
		<h5 slot="header" class="header">
			WQ Topography: {$tempObj.input}{$tempObj.selectedShort} | {$salObj.input}{$salObj.selectedShort}
		</h5>
		<div slot="body" class="body">
			<TempSalInput />
		</div>
	</CollapsibleCard>

	<CollapsibleCard>
		<h5 slot="header" class="header">Green Zone</h5>
		<div slot="body" class="body">
			<div class="green-zone-body" style="display: flex; flex-direction: column;">
				<TanUianInput uian_crit={{ value: 12.5, units: 'µg/L' }} phFree_init={7} />
				<hr class="hr-divider" />
				<Co2Input />
				<hr class="hr-divider" />
			</div>
		</div>
	</CollapsibleCard>
</div>

<style>
	.hr-divider {
		background-color: rgb(28, 126, 214);
		margin: 0.75rem auto;
		width: 60%;
		height: 0.75px;
	}

	.cards {
		width: 100%;
		max-width: 550px;
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

	/* img {
    display: block;
    width: 200px;
    height: 200px;
    border-radius: 5px;
  }

  .text {
    margin-left: 1em;
  }

  .body p {
    color: rgb(40, 40, 40);
    display: block;
    padding: 0;
    margin: 0;
  }

  .body p + p {
    margin-top: 1em;
  } */
</style>
