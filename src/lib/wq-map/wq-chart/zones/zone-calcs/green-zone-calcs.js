import {
	calcRho,
	percentNh3ForTemp,
	ammoniaToTargetUnits,
	alkToIcUnits,
	critPhFreeForTanMillero,
	calcDicOfAlkPh,
	calcDicForAlkCo2,
	calcPhForAlkDic,
	phFreeToPhNbs
} from '../../../wq-brains/CarbCalcFunctions';

// -- INPUT TEST -- //
// icTemp, icSal,
// phFree_init, tanVal, tanUnits,
// uianCritVal uianCritUnits,
// co2CritValMgL
// alkLowValue, alkLowUnits,alkHighValue, alkHighUnits

// ...GREEN_ZONE_TEST_INPUT...
// 298.15 K, 34.5 ppt
// pH 7.17347266900028 FREE
// 0.15 mg/L TAN
// 12.5 μg/L UIAN crit
// 10 mg/L CO2 crit
// 0: {x: 0.7584920272771822, y: 1}
// 1: {x: 1.220901471853316, y: 1}
// 2: {x: 3.189231599304877, y: 3}
// 3: {x: 2.5046152489275295, y: 3}

export const greenZoneCoords = (
	icTemp,
	icSal,
	phFree,
	tanVal,
	tanUnits,
	uianCritVal,
	uianCritUnits,
	co2CritValMgL,
	alkLowValue,
	alkLowUnits,
	alkHighValue,
	alkHighUnits
) => {
	// console.log(`...CHANGE_GREEN_ZONE_INPUT...`);

	const rho = calcRho(icTemp, icSal);
	// console.log(
	//   `calcRho(${icTemp}, ${icSal}) = ${calcRho(icTemp, icSal)} kg/m3`
	// );

	// [NB] --- MAJOR ∆ for CRIT CO2 Calculation --- [NB] //
	// [HACK] ** change co2CritValMgL to mg/kg ** [HACK] //
	// co2CritValMgL = +co2CritValMgL / (rho / 1000);
	// console.log(`GZ CO2: ${+co2CritValMgL} mg/L`);
	// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ //

	// --------------- TA-N & UIA-N* ----------------
	// [NB] convert TA-N & UIA-N* in compatible units
	const percentUian = percentNh3ForTemp(icTemp, icSal, +phFree);

	// **** -- RE-VISIT -- this choice **** //
	// [NB] NOT in IC units, mg/kg (ppm), because force MICRO-gram/L
	//      in critPh calculation (below)
	const inputTanInMgPerL = ammoniaToTargetUnits(+tanVal, tanUnits, 'mg/L', rho, percentUian);

	// -----Convert [Alk] to meq/kg------ //
	const icAlk_low = alkToIcUnits(+alkLowValue, alkLowUnits, rho);
	const icAlk_high = alkToIcUnits(+alkHighValue, alkHighUnits, rho);

	// console.log(`${alkHighValue} ${alkHighUnits} ${icAlk_high}`);

	// Convert input crit UIA-N to insure it's in μg/L
	const critUianInMicrogramsPerLiter = ammoniaToTargetUnits(
		+uianCritVal,
		uianCritUnits,
		'μg/L',
		rho,
		percentUian
	);

	let critPh = critPhFreeForTanMillero(
		+inputTanInMgPerL * 1000, // [TEST] measured TA-N in μg/L
		+critUianInMicrogramsPerLiter, // [NB] The CRITICAL UIA-N in μg/L
		// +uianCritVal // [NB] The CRITICAL UIA-N in same units as inputTanInTargetUnits
		+icTemp,
		+icSal
	);

	// [HACK] Like in UiaContent.js, critPh can NaN or +/-Inf
	//        if TA-N is too low to produce the critical UIA-N
	critPh = isNaN(critPh) ? 12.0 : critPh;
	critPh = critPh === Infinity ? 12.0 : critPh;
	critPh = critPh === -Infinity ? 5.0 : critPh;

	// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

	// ---------------------------
	const critCo2_mgL = +co2CritValMgL; // [NB] "* (0.001 * rho)" converts to mg/L
	const x = +uianCritVal; // [NB] The CRITICAL UIA-N in same units as inputTanInTargetUnits
	// console.log(` crit_co2 = ${critCo2_mgL} ${co2_crit.units} (want mg/L)`);
	// console.log(
	//   `crit_uian: ${uianCritVal} ${uianCritUnits} -> ${critUianInMicrogramsPerLiter} μg/L`
	// );
	// ---------------------------

	// Calculate DIC values for Green Zone's UIA-N* border
	const gz_dic_1 = 1000 * calcDicOfAlkPh(icAlk_low / 1000, critPh, icTemp, icSal);
	const gz_dic_4 = 1000 * calcDicOfAlkPh(icAlk_high / 1000, critPh, icTemp, icSal);

	// Calculate DIC values for Green Zone's CO2* border
	// [NB - NB - NB] co2CritValMg> / rho for mg/kg ???
	const gz_dic_2 = calcDicForAlkCo2(icAlk_low / 1000, +co2CritValMgL / (0.001 * rho) / 44009.6, icTemp, icSal);
	const gz_dic_3 = calcDicForAlkCo2(icAlk_high / 1000, +co2CritValMgL / (0.001 * rho) / 44009.6, icTemp, icSal);

	// console.log(`rho = ${rho} g/L`);
	// console.log(`rho = ${rho * 0.001} kg/L`);
	// console.log(`1 / rho = ${1.0 / (rho * 0.001)} L/kg`);

	// [NB] CO2* --not-- a straight line, so add points at low Alk for better fit
	const numPts = 5 * Math.abs(+icAlk_high - +icAlk_low) + 5;
	// console.log(`NUM_PTS = ${numPts}`);
	let dangerCo2Line_forGreenZone = Array(numPts <= 2 ? 3 : Math.round(numPts)) // condition guards fractional array lengths
		.fill()
		.map((dic, idx) => {
			const alk = (+icAlk_low + 0.2 * idx) / 1000;
			dic = calcDicForAlkCo2(
				alk,
				+co2CritValMgL / (0.001 * rho) / 44009.6, // [NB] "* (0.001 * rho)" converts co2CritValMgL in mg/L to mg/kg
				icTemp,
				icSal
			);
			return {
				x: dic,
				y: alk * 1000
			};
		})
		.filter((data) => data.y <= +icAlk_high);

	// [HACK] If dangerCo2Line_forGreenZone's max Alk < icAlk_high,
	//        must "top it off" or top GZ border will not have the same Alk-value
	const topOffGreenZoneArray = {
		x: calcDicForAlkCo2(icAlk_high / 1000, +co2CritValMgL / (0.001 * rho) / 44009.6, icTemp, icSal),
		y: icAlk_high
	};

	// console.log(`topOffGreenZoneArray: `, topOffGreenZoneArray);

	// console.log(`${gz_dic_1} -> ${gz_dic_4}`);
	// console.log(`${gz_dic_2} -> ${gz_dic_3}`);
	// console.log(`x: ${gz_dic_4}, y: ${icAlk_high} (${+icAlk_high})`);

	dangerCo2Line_forGreenZone = [
		{ x: gz_dic_1, y: icAlk_low },
		...dangerCo2Line_forGreenZone,
		topOffGreenZoneArray,
		{ x: gz_dic_4, y: icAlk_high }
	];

	// console.log(`dangerCo2Line_forGreenZone: `, dangerCo2Line_forGreenZone);

	// Calculate slope & intercept of CO2* and UIA-N* lines
	// If the slope of the CO2* line > slope of UIA-N* line, find intersection
	// -- UIA-N* border line
	const slope_uian_line = (+icAlk_high - +icAlk_low) / (gz_dic_4 - gz_dic_1);
	const intercept_uian_line = +icAlk_low - slope_uian_line * gz_dic_1;

	// -- CO2* border line
	const slope_co2_line = (+icAlk_high - +icAlk_low) / (gz_dic_3 - gz_dic_2);
	const intercept_co2_line = +icAlk_low - slope_co2_line * gz_dic_2;

	// console.log(
	//   `UIA-N* line: f(dic) = ${slope_uian_line} * DIC + ${intercept_uian_line} (${intercept_uian_line_check})`
	// );
	// console.log(
	//   `CO2* line: f(dic) = ${slope_co2_line} * DIC + ${intercept_co2_line} (${intercept_co2_line_check})`
	// );

	// [Custom Validation] Is alkLowValue > alkHighValue ?
	// [NB] MUST be in same alk units

	let greenZoneCoords = [
		{ x: 0, y: 0 },
		{ x: 0, y: 0 },
		{ x: 0, y: 0 },
		{ x: 0, y: 0 }
	];

	// Is slope CO2* > slope UIA-N* ?
	//  -- If so, there is an intersection.
	// If there is an intersection, is it > alk_high?
	//  -- If so, ignore it
	//  -- If not, it < alk_low?
	//
	// console.log(` `);
	// console.log(`  ~~~~  `);

	// if (wqMapDecorations && wqMapDecorations.showHideGreenZone) {
	if (+alkHighValue > +alkLowValue) {
		// console.log(
		//   `VALID Alk pair: alk_high ${alkHighValue} > alk_low ${alkLowValue}`
		// );
		if (slope_co2_line > slope_uian_line) {
			// console.log(`${slope_co2_line} > ${slope_uian_line} => INTERSECTION`);

			// Compute intersection
			const dic_star =
				(intercept_uian_line - intercept_co2_line) / (slope_co2_line - slope_uian_line);
			const alk_star = slope_co2_line * dic_star + intercept_co2_line;
			const alk_star_check = slope_uian_line * dic_star + intercept_uian_line;

			const phFree_at_intersection = calcPhForAlkDic(
				alk_star / 1000,
				dic_star / 1000,
				icTemp,
				icSal
			);

			const phNbs_at_intersection = phFreeToPhNbs(phFree_at_intersection, icSal, icTemp, 0);

			// console.log(
			//   `INTERSECTION = (${dic_star}, ${alk_star}), pH = ${phNbs_at_intersection}`
			// );

			// Is alk_star > alkHighValue ?
			// if (alk_star > alkHighValue) {
			if (alk_star > +icAlk_high) {
				// console.log(
				//   `${alk_star} > ${alkHighValue} => 4-POINT Green Zone`
				// );
				// greenZoneCoords = [
				//   { x: gz_dic_1, y: +icAlk_low },
				//   { x: gz_dic_2, y: +icAlk_low },
				//   { x: gz_dic_3, y: +icAlk_high },
				//   { x: gz_dic_4, y: +icAlk_high },
				// ];

				// console.log(`0. greenZoneCoords: `, greenZoneCoords);

				// greenZoneCoords = dangerCo2Line_forGreenZone;

				// -- [NB] [NB] [NB] [NB] [NB] [NB] [NB] [NB] [NB] [NB] -- //

				// Changed from 'dangerCo2Line_forGreenZone' to four-point GZ
				// because of ~0.4 mmol/kg DIC gap between GZ & CO2-crit at TA-N (!!) > 0.85

				// greenZoneCoords = dangerCo2Line_forGreenZone;

				greenZoneCoords = [
					{ x: gz_dic_1, y: +icAlk_low },
					{ x: gz_dic_2, y: +icAlk_low },
					{ x: gz_dic_3, y: +icAlk_high },
					{ x: gz_dic_4, y: +icAlk_high }
				];

				// -- ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ -- //

				// console.log(`1. greenZoneCoords: `, greenZoneCoords);

				// } else if (alk_star > alkLowValue) {
			} else if (alk_star > icAlk_low) {
				// console.log(
				//   `${alk_star} > ${alkLowValue} && <= ${alkHighValue} => 3-POINT Green Zone`
				// );
				// console.log(`dic_star: ${dic_star} (${typeof dic_star})`);
				greenZoneCoords = [
					{ x: gz_dic_1, y: +icAlk_low },
					{ x: gz_dic_2, y: +icAlk_low },
					{ x: dic_star, y: alk_star },
					{ x: dic_star, y: alk_star }
				];

				// --------------------------------

				// [NB] CO2* --not-- a straight line, so add points at low Alk for better fit
				const numPts = 5 * Math.abs(+alk_star - +icAlk_low) + 5;
				// console.log(`NUM_PTS = ${numPts}`);
				let dangerCo2Line_forGreenZone = Array(numPts <= 2 ? 3 : Math.round(numPts)) // condition guards fractional array lengths
					.fill()
					.map((dic, idx) => {
						const alk = (+icAlk_low + 0.2 * idx) / 1000;
						dic = calcDicForAlkCo2(alk, +co2CritValMgL / (0.001 * rho) / 44009.6, icTemp, icSal);
						return {
							x: dic,
							y: alk * 1000
						};
					})
					.filter((data) => data.y <= +alk_star);

				// [HACK] If dangerCo2Line_forGreenZone's max Alk < icAlk_high,
				//        must "top it off" or to top GZ border will not have the same Alk-value
				const topOffGreenZoneArray = {
					x: calcDicForAlkCo2(alk_star / 1000, +co2CritValMgL / (0.001 * rho) / 44009.6, icTemp, icSal),
					y: alk_star
				};

				greenZoneCoords = [
					{ x: gz_dic_1, y: +icAlk_low },
					...dangerCo2Line_forGreenZone,
					topOffGreenZoneArray,
					{ x: dic_star, y: alk_star }
				];

				// console.log(`topOffGreenZoneArray: `, topOffGreenZoneArray);
				// console.log(`x_new: `, x_new);

				// console.log(`${gz_dic_1} -> ${gz_dic_4}`);
				// console.log(`${gz_dic_2} -> ${gz_dic_3}`);
				// console.log(`x: ${gz_dic_4}, y: ${icAlk_high} (${+icAlk_high})`);

				// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

				// console.log(`1. greenZoneCoords: `, greenZoneCoords);

				// [NB] Why does following 3-pt array blow up, complaining "cannot read property 'x' of undefined"
				// greenZoneCoords = [
				//   { x: gz_dic_1, y: +alkLowValue },
				//   { x: gz_dic_4, y: +alkHighValue },
				//   { x: dic_star, y: alk_star }
				// ];
			} else {
				// console.log(`${alk_star} <= ${alkLowValue} => GREEN ZONE NEMA!`);
				// console.log(`Show information with explanation?`);
				greenZoneCoords = [
					{ x: 0, y: 0 },
					{ x: 0, y: 0 },
					{ x: 0, y: 0 },
					{ x: 0, y: 0 }
				];
			}
		} else {
			// console.log(
			//   `${slope_co2_line} < (but === ?) ${slope_uian_line} => 4-POINT Green Zone`
			// );

			// [NB] For now, going with simpler 4-pt rectangle because
			//      upper-right corner of GZ slightly mismatched with dangerCo2Line_forGreenZone coords
			greenZoneCoords = [
				{ x: gz_dic_1, y: +icAlk_low },
				{ x: gz_dic_2, y: +icAlk_low },
				{ x: gz_dic_3, y: +icAlk_high },
				{ x: gz_dic_4, y: +icAlk_high }
			];

			// greenZoneCoords = dangerCo2Line_forGreenZone;

			// console.log(greenZoneCoords);
		}
	} else {
		// console.log(
		//   `IN-VALID Alk pair: alk_high ${alkHighValue} < alk_low ${alkLowValue}`
		// );
		greenZoneCoords = [
			{ x: 0, y: 0 },
			{ x: 0, y: 0 },
			{ x: 0, y: 0 },
			{ x: 0, y: 0 }
		];
	}
	// }

	return greenZoneCoords;

	// WqMapContext -- GREEN ZONE ACTION --
	// Only fire action when form is valid
	// console.log(`BEFORE changeGreenZone, form isValid? ${formState.isValid}`);
	// if (formState.isValid) {
	//   changeGreenZone(greenZoneCoords);
	// }
};
