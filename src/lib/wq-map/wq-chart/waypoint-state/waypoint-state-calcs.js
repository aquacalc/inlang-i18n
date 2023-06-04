// ********************************* //
//  collect all input needed to...
//    (1) calc WQ Map coords
//    (2) define current WQ state
//    (3) style, based on position
//  of Initial & Target WPs
// ********************************* //

// To calc coords: T, S, pH, [Alk]
// For WQ state: all of above + TA-N, Ca++, CO2
// For styling: GZ-show-hide, crit CO2, crit UIA-N

// Import stores
// see: https://stackoverflow.com/questions/59126405/is-it-possible-to-access-svelte-store-from-external-js-files
// import { tempObj, salObj } from "../../wq-stores/WqMapStateStoreScrolly";
// import { initWp, targetWp } from "../../wq-stores/WaypointStoreScrolly"; // for each WP's current pH & [Alk]
// import {} from '../../../stores/phAlkStore' // ??

import { calcDicOfAlk, phNbsToPhFree, percentNh3ForTemp } from '../../wq-brains/CarbCalcFunctions';

export const wpCoords = (icTemp, icSal, phNbs, icAlk) => {
	// console.log(`Evo WP coords... ${icAlk} mmol/kg (pH ${phNbs})`);

	let initWpDic =
		calcDicOfAlk(icAlk / 1000, phNbsToPhFree(phNbs, icSal, icTemp, 0), icTemp, icSal) * 1000;

	// Calculate UIA-N in μg/L
	// const uian =
	//   (1000 * currentTanMgL * percentNh3ForTemp(icTemp, icSal, phFree)) / 100;

	return initWpDic;
};
