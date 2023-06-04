<script>
	import { tempObjFn, salObjFn } from '../../wq-stores/WqMapStateStoreScrolly';
	import { targetWpFn, initWpFn } from '../../wq-stores/WaypointStoreScrolly';

	const tempObj = tempObjFn();
	const salObj = salObjFn();
	const targetWp = targetWpFn();
	const initWp = initWpFn();

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
		phFreeToPhNbs
	} from '../wq-brains/CarbCalcFunctions';

	import { round } from '../wq-brains/FormatResultsLiteral';

	// $: myTargetPh = calcPhForAlkDic(
	//   0.0031131,
	//   $targetWp.dic / 1000,
	//   $tempObj.icInput,
	//   $salObj.icInput
	// );
	$: myTargetPh = findPhFromAlkDic(
		$targetWp.alk / 1000,
		$targetWp.dic / 1000,
		$tempObj.icInput,
		$salObj.icInput
	);

	// let dummyDic = 0.00360
	// let dummyDic = 0.003456;
	// let dummyDic = 0.0031694;
	$: dummyDic = $targetWp.dic / 1000;

	// let dummyPh = 6.80286; // Init (FREE)
	// let dummyPh = 6.943041; // Mid
	// let dummyPh = 7.441097; // Final
	$: dummyPh = myTargetPh;

	$: rho = calcRho($tempObj.icInput, $salObj.icInput);
	$: myCo2 = calcCo2OfDic(dummyDic, $tempObj.icInput, $salObj.icInput, dummyPh);
	$: myHco3 = calcHCO3(dummyDic, $tempObj.icInput, $salObj.icInput, dummyPh) * 1000;
	$: myCo3 = calcCO3(dummyDic, $tempObj.icInput, $salObj.icInput, dummyPh) * 1000;
	$: myBorate = calcBorate(dummyPh, $tempObj.icInput, $salObj.icInput) * 1000;
	$: myHydroxide = calcHydroxide(dummyPh, $tempObj.icInput, $salObj.icInput) * 1000;
	$: myHydronium = calcHydronium(dummyPh) * 1000;
</script>

<h2>Info</h2>
<h4>
	Temp: {$tempObj.input}{$tempObj.selectedShort} -- Salinity: {$salObj.input}{$salObj.selectedShort}
</h4>

<!-- <h5>
  pH {dummyPh} (pH {calcPhForAlkDic(
    0.0031131,
    0.0036,
    $tempObj.icInput,
    $salObj.icInput
  )})
</h5>
<h5>
  pH {dummyPh} (pH {calcPhForAlkDic(
    0.0031131,
    0.003456,
    $tempObj.icInput,
    $salObj.icInput
  )})
</h5>
<h5>
  pH {dummyPh} (pH {calcPhForAlkDic(
    0.0031131,
    0.0031694,
    $tempObj.icInput,
    $salObj.icInput
  )})
</h5> -->
<h5>
	pH {dummyPh} (pH {calcPhForAlkDic(
		0.003, // Alk
		0.003, // DIC
		$tempObj.icInput,
		$salObj.icInput
	)})
</h5>
<h3>
	TARGET: pH {dummyPh} (pH {phFreeToPhNbs(myTargetPh, $salObj.icInput, $tempObj.icInput, 0)}) ({myTargetPh})
</h3>
<h3>
	INIT: pH {$initWp.ph.phNbs} (alk: {$initWp.alk.alk} & dic: {$initWp.dic})
</h3>

<h4>
	CO<sub>2</sub>: {round(myCo2, 2)} mg/kg (CO<sub>2</sub>: {round((myCo2 * rho) / 1000, 2)} mg/L)
</h4>

<h4>CO<sub>2</sub>: {round((myCo2 * 1000) / 44009.6, 4)} mmol/kg</h4>

<h4>HCO<sub>3</sub>: {round(myHco3, 4)} mmol/kg</h4>
<h4>CO<sub>3</sub>: {round(myCo3, 4)} mmol/kg</h4>
<h4>B(OH)<sub>3</sub>: {round(myBorate, 6)} mmol/kg</h4>
<h4>OH<sub>3</sub>: {round(myHydroxide, 6)} mmol/kg</h4>
<h4>H<sup>+</sup>: {round(myHydronium, 6)} mmol/kg</h4>

<h4>
	Alk: {round(myHco3 + 2 * myCo3 + myBorate + myHydroxide - myHydronium, 4)} meq/kg
</h4>
<h4>
	DIC: {round((myCo2 * 1000) / 44009.6 + myHco3 + myCo3, 4)} ({round($targetWp.dic, 2)}) mmol/kg
</h4>

<style>
	/*  */
</style>
