import {
	// calcRho,
	// percentNh3ForTemp,
	// ammoniaToTargetUnits,
	// alkToIcUnits,
	// critPhFreeForTanMillero,
	// calcDicOfAlkPh,
	// calcDicForAlkCo2,
	// calcPhForAlkDic,
	// phFreeToPhNbs,
	// ----- //
	calcPhTotForOmegaAr,
	ahFreeToTotFactor,
	phFreeToPhNbs,
	calcAlkOfDic
} from '../../../wq-brains/CarbCalcFunctions';

// ...OMEGA_AR_TEST_INPUT...
// 298.15 K, 34.5 ppt
// pH 7.17347266900028 FREE

let omegaArData = [
	{ x: 0, y: 0 },
	{ x: 0, y: 0 }
];

export const omegaArZoneCoords = (icTemp, icSal, omegaArValue, calciumInMolPerKg) => {
	// console.log(`${icTemp}, ${icSal}, ${omegaArValue}, ${calciumInMolPerKg}`);

	omegaArData = Array(900)
		.fill()
		.map((dic, i) => {
			const myDic = (i + 1) / 100000;
			// Calculate TOTAL pH from Ω = 1, DIC, [Ca++], icTemp, & icSal
			const phTot = calcPhTotForOmegaAr(
				omegaArValue,
				// 1.0,
				myDic,
				calciumInMolPerKg,
				icTemp,
				icSal,
				0
			);

			const phFree = phTot + Math.log10(ahFreeToTotFactor(icSal, icTemp, 0));

			// if (myDic <= 0.00002) console.log(`myDic = ${myDic} (${phFree})`);

			if (!isNaN(phFree) || myDic === 0.00001) {
				const phNbs = phFreeToPhNbs(phFree, icSal, icTemp, 0);

				const alk = calcAlkOfDic(myDic, phTot, icTemp, icSal);

				if (!isNaN(alk)) {
					return {
						x: myDic * 1000,
						y: alk * 1000,
						phTot,
						phFree,
						phNbs
					};
				}
			} else {
				// console.log(`x: ${myDic * 1000}, y: ${12}`);
				return {
					x: myDic * 1000,
					y: 12,
					phTot: 12,
					phFree: 12,
					phNbs: 12
				};
			}
		})
		.filter((datum) => datum !== undefined);

	// Added to each Omega array of objects to satisfy D3 plotting
	omegaArData = [
		{ x: 0.0025, y: 12 },
		{ x: 0.005, y: 11.5 },
		{ x: 0.0075, y: 11.5 },
		{ x: 0.01, y: 12 },
		...omegaArData,
		{ x: 8, y: 12 }
	];

	return omegaArData;
};
