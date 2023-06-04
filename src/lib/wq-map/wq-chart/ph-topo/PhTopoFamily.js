// The WQ Map's pH "topography"
// ** ----- MODIFIED ----- ** //
// ** to fit Svelte's declarative approach ** //

import {
	phNbsToPhFree,
	phFreeToPhNbs,
	phLineIntercept,
	phLineSlope
} from '../../wq-brains/CarbCalcFunctions';

import myFormats from '../../wq-brains/utils/format-billions';

export const wqTopoData = (icTemp, icSal) => {
	let wqTopoData = [];

	// ** --------- Build WQ pH Topography -------- ** //
	// see: https://stackoverflow.com/questions/3751520/how-to-generate-sequence-of-numbers-chars-in-javascript
	//      (note from "Matt": "This can be extended to a sequence...")
	// NB: return array of ph_intercept & ph_slope to avoid recalc steps in phLines array
	const p = 0;

	const phFamily = Array(36)
		.fill()
		.map((v, i) => {
			let free = phNbsToPhFree(5 + 0.25 * i, icSal, icTemp, p);
			const intercept = 1000 * phLineIntercept(icTemp, icSal, free);
			const slope = phLineSlope(icTemp, icSal, free);
			return {
				free,
				intercept,
				slope
			};
		})
		.filter((phDatum) => phDatum.intercept <= 120); // to get up to 12.75 (2 C, 0 ppt)

	const dic_max = 8;
	const alk_max = 8;

	// dic at alk_max: dic* = [ (alk_max - p.intercept) / p.slope ]
	// If dic* < dic_max, phTerm [dic*, alk_max]
	// Else use [dic_max, dic_max * p.slope + p.intercept]

	// [NB] After move to Svelte, added slope & intercept
	//      to wqTopoData to calc positions of pH line text
	//      in PhLine.svelte after zooming & panning
	if (phFamily) {
		wqTopoData = phFamily.map((p) => ({
			ph_free: p.free,
			ph_nbs: myFormats.round(phFreeToPhNbs(p.free, icSal, icTemp, 0), 2),
			intercept: p.intercept,
			slope: p.slope,
			data: [
				{
					x: 0,
					y: p.intercept
				},
				{
					x:
						(alk_max - p.intercept) / p.slope <= dic_max
							? (alk_max - p.intercept) / p.slope
							: dic_max,
					y:
						(alk_max - p.intercept) / p.slope <= dic_max ? alk_max : dic_max * p.slope + p.intercept
				}
			]
		}));
		// .filter((d) => d.phTerm.dic >= 0); // so no stray upper-left pH isopleths
	}

	return wqTopoData;
};
