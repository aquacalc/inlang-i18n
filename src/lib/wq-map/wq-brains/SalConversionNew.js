// see: https://stackoverflow.com/questions/33178843/es6-export-default-with-multiple-functions-referring-to-each-other

// import jerzy from 'jerzy';  // for numerical analysis -- here, the SECANT method

// import round from './Round';
// import TempSalData from '../conversionData/tempSalData';

import { formatResultsLiteral, formatResultsForConductivity } from './FormatResultsLiteral';

// see: http://www.jacklmoore.com/notes/rounding-in-javascript/
export const round = (value, decimals) => {
	// return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
	// return Number(Math.round(value+'e'+decimals)+'e-'+decimals).toFixed(decimals);
	return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
};

// ****** TEMP & SAL Conversions ****** //

// IC temperature units are KELVIN
export const tempToIcUnits = (temp, tempUnits) => {
	if (tempUnits === 'Celsius') {
		return temp + 273.15;
	} else if (tempUnits === 'Fahrenheit') {
		return (5 * (temp - 32)) / 9 + 273.15;
	} else {
		return temp;
	}
};

// Return temp in requested units
export const convertTemp = (temp, fromUnits, toUnits) => {
	// console.log(`${temp} ${fromUnits} -> ${toUnits}`);
	// first convert to I.C. units (K), if necessary
	const myTempInKelvin = tempToIcUnits(temp, fromUnits);

	// next, convert from K to toUnits
	if (toUnits === 'Celsius') {
		return myTempInKelvin - 273.15;
	} else if (toUnits === 'Fahrenheit') {
		return 32 + (9 * (myTempInKelvin - 273.15)) / 5;
	} else {
		return myTempInKelvin;
	}
};

// Reducer to re-order (inconveniently orders) salinity units
// '‰'=1,'μS/cm'=3,'S/m'=5, 'S/cm'=6, ('mS/cm'=4,'dS/m'=4)
export const reduceSalIndex = (units) => {
	switch (units) {
		case '‰':
			return 1;
		case 'μS(μmho)/cm':
			return 2;
		case 'mS/cm (dS/m)':
			return 5;
		case 'S/m':
			return 3;
		case 'S/cm':
			return 4;
		default:
			return 1;
	}
};

// # ---- density calcs ----

// # ** NB: TEMP IS IN CELCIUS, ** NOT ** KELVIN
// # ** NB: SMOW --Standard Mean Ocean Water
function calcRhoFW(t) {
	// # **  input temp, dT, in KELVIN
	// # ** define a local temp in CELCIUS

	const tempInCelcius = t - 273.15;

	let rhoFw = 999.842594 + 0.06793952 * tempInCelcius;
	rhoFw = rhoFw + -0.00909529 * tempInCelcius * tempInCelcius;

	rhoFw = rhoFw + 0.0001001685 * Math.pow(tempInCelcius, 3);
	rhoFw = rhoFw + -0.000001120083 * Math.pow(tempInCelcius, 4);
	rhoFw = rhoFw + 0.000000006536332 * Math.pow(tempInCelcius, 5);

	return rhoFw;
}

// # ** NB: TEMP IS IN CELCIUS, ** NOT ** KELVIN
// # ***** SW rho(T, S)
// # return: kg/m3 (g/l)
export function calcRho(t, sal) {
	// # ** input temp, dT, in KELVIN
	// # ** define a local temp in CELCIUS

	const tempInCelcius = t - 273.15;

	let A = 0.824493 - 0.0040899 * tempInCelcius;
	A = A + 0.000076438 * tempInCelcius * tempInCelcius;
	A = A + -0.00000082467 * Math.pow(tempInCelcius, 3);
	A = A + 0.0000000053875 * Math.pow(tempInCelcius, 4);

	let B = -0.00572466 + 0.00010227 * tempInCelcius;
	B = B + -0.0000016546 * tempInCelcius * tempInCelcius;

	let C = 0.00048314;

	// # ** NB: SEND calcRhoFW temp in **KELVIN**, it will change to C
	// # **     Why? In case need to call calcRhoFW from another
	// # **     method that send temp in KELVIN
	let myRhoSW = calcRhoFW(t) + A * sal;
	myRhoSW = myRhoSW + B * Math.pow(sal, 1.5);
	myRhoSW = myRhoSW + C * sal * sal;

	return myRhoSW;
}
// http://www.code10.info/index.php?option=com_content&view=article&id=65:conversion-between-conductivity-and-pss-78-salinity&catid=54:cat_coding_algorithms_seawater&Itemid=79
// #...valid within the temperature range between –2°C and +35°C,
// # pressure range between 0 and 10000 decibars and a practical salinity range between 2 and 42
// # or the respective electrical conductivity and conductivity ratio.
// # Although practical salinity values < 2 are not defined, the equations deliver valid non-zero results
// # down to thresholds of conductivity ratios > 0.0005 and salinities > 0.02.
// # Values in these outer limits are estimates congruent with the Fortran algorithms (UNESCO 1983).
// # Below these thresholds functions return 0 (UNESCO 1983).

// # t in C and p in dbar
// NB: last @param, tc, here is HARD-CODED to false -- no temp correction for hydrometry
function calcSwSalinityFromConductivity(c, t, p = 0, tc = 0) {
	// console.log(`in SalConversion.js/calcSwSalinityFromConductivity...`);
	// console.log(`c: ${c}, t: ${t}, p: ${p}, tc: ${tc}`);

	// if (t < 4) {
	// 	console.log(`${t} < 4 C => RETURN`);
	// 	return;
	// }

	// #            double sal = 0.0;
	// # ** NB: Must add myPressure and convert myConductivity to S/m for this calc
	// #            double t = myTemp;     // ** C
	// #            double p = myPressure; // ** dbar

	// # NB: With this algorithm, MUST CHANGE INPUT temp from KELVIN --> CELCIUS
	// #     Unlike WQ Tech 0.95 in Xcode, this conversion performed in salToIcUnits()

	// # ** @param c = C(S,t,p) is the measured electrical conductivity
	// # ** myConductivity = C(35,15,0) = electrical conductivity of standard SW,
	// # ** which is 4.2914 S/m
	// # ** e.g.: http://www.code10.info/index.php?option=com_content&view=article&id=65:conversion-between-conductivity-and-pss-78-salinity&catid=54:cat_coding_algorithms_seawater&Itemid=79

	// # cat('*** calcSwSalinityFromConductivity ... c: ', c, '\n')

	// # ** S/m (or 42914 μS/cm)
	const myConductivity = 4.2914;

	// # ** 1. calculate conductivity ratio R
	const myR = c / myConductivity;

	// console.log(`myR: ${myR}`);

	// # ** 2. calculate rsubt -- function of temperature
	const c0 = 0.6766097;
	const c1 = 0.0200564;
	const c2 = 0.0001104259;
	const c3 = -0.00000069698;
	const c4 = 0.0000000010031;

	const rSubT = c0 + c1 * t + c2 * t * t + c3 * t * t * t + c4 * t * t * t * t;

	// # ** 3. calculate Rsubp -- function of pressure
	const e0 = 0.0000207;
	const e1 = -0.000000000637;
	const e2 = 0.000000000000003989;
	const d1 = 0.03426;
	const d2 = 0.0004464;
	const d3 = 0.4215;
	const d4 = -0.003107;

	// # cat('*** AAAAA calcSwSalinityFromConductivity \n')
	const RsubP = 1 + (p * (e0 + e1 * p + e2 * p * p)) / (1 + d1 * t + d2 * t * t + (d3 + d4) * myR);
	// # cat('*** BBBBB calcSwSalinityFromConductivity \n')

	// # ** 4. calclate RsubT
	const RsubT = myR / (rSubT * RsubP);

	// # ** 5. calculate S'
	const k = 0.0162;
	const b0 = 0.0005;
	const b1 = -0.0056;
	const b2 = -0.0066;
	const b3 = -0.0375;
	const b4 = 0.0636;
	const b5 = -0.0144;

	let Sprime = (t - 15) / (1 + k * (t - 15));

	// console.log(`0. Sprime: ${Sprime}`);

	// # cat('*** calcSwSalinityFromConductivity ... RsubT: ', RsubT, '\n')

	Sprime =
		Sprime *
		(b0 +
			b1 * Math.sqrt(RsubT) +
			b2 * RsubT +
			b3 * Math.pow(RsubT, 1.5) +
			b4 * RsubT * RsubT +
			b5 * Math.pow(RsubT, 2.5));
	// # cat('bbbbbbbbbbb??')
	// # cat('*** calcSwSalinityFromConductivity ... Sprime: ', Sprime, '\n')

	// console.log(`1. Sprime: ${Sprime}`);

	// # ** 6. finish it off to calc salinity
	const a0 = 0.008;
	const a1 = -0.1692;
	const a2 = 25.385;
	const a3 = 14.0941;
	const a4 = -7.0261;
	const a5 = 2.7081;

	const mySal =
		a0 +
		a1 * Math.sqrt(RsubT) +
		a2 * RsubT +
		a3 * Math.pow(RsubT, 1.5) +
		a4 * RsubT * RsubT +
		a5 * Math.pow(RsubT, 2.5) +
		Sprime;

	// console.log(`mySal = ${mySal}`);

	return mySal;
}

// # [TEST]
// # given salinity and temperature for a hydrometer calibration temperature,
// # calculate the TRUE spgr, the "gupta" correction, and the UNcorrected hydrometer reading

// # tc (boolean) flags if entered spgr_in is un-corrected (tc = 0) or corrected (tc = 1)
function test_spgr_calcs(spgr_in, tRead, tCal, tc) {
	// # spgr_TRUE = calcRho(tRead + 273.15, sal) / calcRhoFW(tCal + 273.15)
	// #
	// # gupta = gupta_correction(sal, tRead, tCal)
	// #
	// # cat('\n===================\n')
	// # cat('spgr_TRUE: ', spgr_TRUE, '\n')
	// # cat('    gupta: ', gupta, '\n')
	// # cat(' spgr_RAW: ', spgr_TRUE - gupta, '\n')
	// # cat('===================\n\n')

	let low = 0;
	let high = 50;
	let my_sal = (low + high) / 2;

	let spgr_TRUE = calcRho(tRead + 273.15, my_sal) / calcRhoFW(tCal + 273.15);
	// # gupta = gupta_correction(my_sal, tRead, tCal)
	let gupta = tc ? 0 : calc_gupta_correction(tRead, tCal);
	// let gupta = ifelse(tc, 0, gupta_correction(my_sal, tRead, tCal));

	// # spgr_target = 1.0220
	// console.log(`0. gupta: ${gupta}`);

	while (Math.abs(spgr_in - (spgr_TRUE - gupta)) >= 0.0000001) {
		if (spgr_in > spgr_TRUE - gupta) low = my_sal;
		else high = my_sal;

		my_sal = (low + high) / 2;

		spgr_TRUE = calcRho(tRead + 273.15, my_sal) / calcRhoFW(tCal + 273.15);
		// # gupta = gupta_correction(my_sal, tRead, tCal)
		gupta = tc ? 0 : calc_gupta_correction(tRead, tCal);

		// console.log(`1. gupta: ${gupta}`);
		// gupta = ifelse(tc, 0, gupta_correction(my_sal, tRead, tCal));
	}

	// console.log(`in SalConversion/test_spgr_calcs, tc; ${tc}, gupta: ${gupta}, sal: ${my_sal}`);

	// # cat('\n===================\n')
	// # cat('spgr_TRUE: ', spgr_TRUE, ' (', round(spgr_TRUE, 4), ')\n')
	// # cat('    gupta: ', gupta, '\n')
	// # cat(' spgr_RAW: ', spgr_TRUE - gupta, ' (', round(spgr_TRUE - gupta, 4), ')\n')
	// # cat('   my_sal: ', my_sal, ' (', round(my_sal, 2), ')\n')
	// # cat('    CHECK: ', calcRho(tRead + 273.15, my_sal) / calcRhoFW(tCal + 273.15), '\n')
	// # cat('===================\n')

	return my_sal;
}

// With KNOWN ACTUAL salinity and ACTUAL temperature, calculate the ACTUAL density of the sample
// and the ACTUAL density of pure water at the **STANDARD** temperature
// The former divided by the latter is the UN-CORRECTEDt specific gravity measurement
// To get the TRUE measurement, must add the "gupta" temperature corrrection factor
function givenSalAndTempCalcUncorrectedHydrometerReading(sal, tSample, tStandard, tc) {
	// ** CORRECTED ** spgr: (sample density at STANDARD temp() / (denisty of pure water at STANDARD temp)
	const spgr = calcRho(tStandard + 273.15, sal) / calcRhoFW(tStandard + 273.15);
	// const spgr = calcRho(tSample + 273.15, sal) / calcRhoFW(tStandard + 273.15);

	// console.log(` `);
	// console.log(`in givenSalAndTemp...,   rho(${tStandard} + 273.15, ${sal}) = ${calcRho(tStandard + 273.15, sal)})`);
	// console.log(`in givenSalAndTemp..., rhoFW(${tStandard} + 273.15}) = ${calcRhoFW(tStandard + 273.15)})`);
	// console.log(`spgr** = ${calcRho(tStandard + 273.15, sal) / calcRhoFW(tStandard + 273.15)}`);

	// NB: If tc === 1, return the CORRECTED spgr; else, apply the correction to get OBSERVED spgr
	const gupta = tc ? 0 : calc_gupta_correction(tSample, tStandard);
	// const gupta = tc ? calc_gupta_correction(tSample, tStandard) : 0;
	// console.log(`in SalConversion.js/givenSalAndTempCalcUncorrectedHydrometerReading...`);
	// console.log(`   ${sal} ppt, ${tSample} C, & ${tStandard} --> TRUE spgr = ${spgr}`);
	// console.log(`   gupta_correction        = ${gupta}`);
	// console.log(`   spgr * gupta_correction = ${spgr * gupta}`);
	// console.log(`   spgr + gupta            = ${spgr + gupta} (${tc})`);
	// console.log(`   spgr / (1 + gupta) = ${spgr} / (1 + ${gupta}) = ${spgr / (1 + gupta)} (isCorrected = ${tc})`);
	// console.log(` `);

	return spgr / (1 + gupta);
	// return(spgr + spgr * gupta);
	// return(spgr - gupta);
}

// // # Gupta correction for hydrometer
// // NB: for full temperature correction, result must be multiplied by specific gravity
// function gupta_correction(sal, tSample, tStandard) {
//   // # Gupta correction
//   const gamma = 0.000030;    // # hydrometer coefficient of expansion (C^-1)
//
//   const gupta_correction_factor = (calcRho(tStandard + 273.15, sal) /
//                                   (calcRho(tSample + 273.15, sal) * (1 + gamma * (tSample - tStandard))) - 1);
//
//   // let gupta_correction_2 = spgr_reading * (
//   //                               calcRho(t_standard + 273.15, corrected_sal) / (calcRho(t_sample + 273.15, corrected_sal) *
//   //                               (1 + gamma * (t_sample - t_standard))) - 1);
//
//   return gupta_correction_factor;
// }

// # Gupta temperature correction for hydrometer
// @tSample   - sample temperature [C]
// @tStandard - standard temperature of hydrometer [C]
function calc_gupta_correction(tSample, tStandard) {
	// hydrometer material's coefficient of expansion (C^-1)
	// Hydrometers are made from a variety of glasses, including borosilicate
	// glass and soda-lime glass.
	// The volumetric thermal expansion coefficient of these glasses varies
	// from 9 × 10-6 K-1 to 26 × 10-6 K-1.
	// see: https://ws680.nist.gov/publication/get_pdf.cfm?pub_id=830999 (p. 7)
	const gamma = 0.00003;

	// general correction as derived in Gupta
	const gupta_correction_factor =
		calcRhoFW(tStandard + 273.15) /
			(calcRhoFW(tSample + 273.15) * (1 + gamma * (tSample - tStandard))) -
		1;

	return gupta_correction_factor;
}

// # use divide-and-conquer
// # return S/m
function calcConductivityFromSalinity(sal, temp, p) {
	// # cat('0: calcConductivityFromSalinity ... passed in: ', sal, ' -- temp: ', temp, '\n')
	// let tol = 0.00001; // ORIGINAL
	let tol = 0.001;

	let low = 0;
	let high = 12; // # NB: NB: NB: 'high' must be >(=) highest expected/computed value

	let c = (low + high) / 2;

	// console.log(`[calcConductivityFromSalinity] FIRST c: ${c}`);

	let guess_sal = calcSwSalinityFromConductivity(c, temp, p);

	while (Math.abs(sal - guess_sal) >= tol) {
		// # cat(' IN guess_sal: ', guess_sal,'\n')
		if (sal > guess_sal) low = c;
		else high = c;

		c = (low + high) / 2;

		// # cat('B: (', low, ' + ', high, ') / 2 = ', (low + high) / 2, '\n')
		guess_sal = calcSwSalinityFromConductivity(c, temp, p);
		// # cat('OUT guess_sal: ', guess_sal,'\n\n')
		// # cat('D: ', (sal - guess_sal),'\n\n')
	}

	// # cat('\n******************************************\n')
	// # cat('Conductivity ', round(c, 3),' S/m\n')
	// # cat('******************************************\n')

	return c;
}

// # *****-------------------------------------------*****

// ---- Convert SALINITY (for export) ----

// # output -- ic salinity units -- are PARTS PER THOUSAND
// #  '‰'=1,'μS/cm'=2,'S/m'=3, 'S/cm'=4, 'mS/cm'=5,'dS/m'=6,
// #   NB: (reference temp) / (standard temp)
// #  20C/20C'=7,'60F/60F'=8,'77F/77F'=9

// salToIcUnits: function(sal, salUnitsIndex, temp, tc) {
export const salToIcUnits = (sal, salUnitsIndex, temp, tc = 0) => {
	// export function salToIcUnits(sal, salUnitsIndex, temp, tc = 0) {
	// console.log(`in salToIcUnits, sal = ${sal}, temp = ${temp}`);

	// # *** convert temp in K to temp in C for methonds below
	temp = temp - 273.15;

	if (1 === salUnitsIndex) {
		return sal;
	} else if (2 === salUnitsIndex) {
		// # ** NB: first convert to S/m
		// console.log(`OLD${sal} S/m, ${temp}, tc = ${tc}`);
		// console.log(calcSwSalinityFromConductivity(sal * 0.0001, temp, 0, tc));
		// # cat('\n\nPASSED IN...μS/cm...sal: ', sal, ' --> ', sal * 0.0001, ' & temp: ', temp, '\n\n')
		return calcSwSalinityFromConductivity(sal * 0.0001, temp, 0, tc);
	} else if (3 === salUnitsIndex) {
		// # cat('\n\nPASSED IN...S/m...sal: ', sal, ' --> ', sal * 1, ' & temp: ', temp, '\n\n')
		return calcSwSalinityFromConductivity(sal, temp, 0, tc);
	} else if (4 === salUnitsIndex) {
		return calcSwSalinityFromConductivity(sal * 100.0, temp, 0, tc);
	} else if (5 === salUnitsIndex) {
		return calcSwSalinityFromConductivity(sal * 0.1, temp, 0, tc);
	}

	// # [KLUDGE] -- CHANGE TO '7'
	else if (7 === salUnitsIndex) {
		// pass tc (boolean) - '0' => un-corrected datum entered
		return test_spgr_calcs(sal, temp, 20.0, tc);
	} else if (6 === salUnitsIndex) {
		return test_spgr_calcs(sal, temp, 15.5556, tc); // 60 F
	} else {
		// ** 77F/77F
		return test_spgr_calcs(sal, temp, 25.0, tc);
	}
};

// # spgr_reading (uncorrected); temps in C; tc (formerly boolean temp correction, now glass/plastic hydrometer)
// # see: http://www.waldonell.com/me/reef-aquarium-water-parameters-salinity-density-and-specific-gravity
// ** NB: changed name TO calcSalFromSpGr FROM calcSalFromUncorrectedSpGr()

// // +++++++++++++++++++++++++++++++++++++++++++++++++
//
//   function calcSalFromSpGr(spgr_reading, t_sample, t_standard, t_reference, tc) {
//
//     // # get uncorrected (ball-park) salinity -- NB: SHOULDN'T reading be CORRECTED first??,
//     // SO-O-O...shouldn't only send CORRECTED specific gravity to make this 'estimation'???
//     // const rSal = calcSalFromSpGravity(spgr_reading, t_sample, t_standard);
//
//     // # for Gupta correction
//     // const gamma = 0.000030;    // # hydrometer coefficient of expansion (C^-1)
//
//     let gupta_correction = spgr_reading * calc_gupta_correction(t_sample, t_standard);
//
//     // console.log(`0. gupta_correction = ${gupta_correction}`);
//
//   // ------------------------------------------------------------
//   // # [CHANGE?] if tc == 0, then apply correction; else, no...
//   // [ADDED] seems to work for tc = 0, => use gupta_correction
//   //         now CONDITIONALLY apply correction: if tc = 1, => NO gupta_correction
//
//     gupta_correction = tc === 1 ? 0 : gupta_correction;
//
//     // console.log(`With tc = ${tc}, gupta_correction = ${gupta_correction}`);
//   // ------------------------------------------------------------
//
//     // const rhf_corrected    = spgr_reading * calcRho(t_standard + 273.15, rSal) / calcRho(t_sample + 273.15, rSal);
//     // const rhf_corrected_35 = spgr_reading * calcRho(t_standard + 273.15, 35) / calcRho(t_sample + 273.15, 35);
//     //
//     // console.log(`    rhf_corrected = ${rhf_corrected}`);
//     // console.log(` rhf_corrected_35 = ${rhf_corrected_35}`);
//     // console.log(` `);
//
//     const round_to_dec = 5;
//     const corrected_sal = parseFloat(calcSalFromSpGravity(spgr_reading + gupta_correction, t_sample, t_standard)).toFixed(round_to_dec);
//
//     // const corrected_sal_rhf = parseFloat(calcSalFromSpGravity(rhf_corrected, t_sample, t_standard)).toFixed(round_to_dec);
//     // const corrected_sal_35 = parseFloat(calcSalFromSpGravity(rhf_corrected_35, t_sample, t_standard)).toFixed(round_to_dec);
//
//     // console.log(`   corrected_sal  = ${corrected_sal}`);
//     // console.log(`corrected_sal_rhf = ${corrected_sal_rhf}`);
//     // console.log(`corrected_sal_35  = ${corrected_sal_35}`);
//     // console.log(` `);
//
//     // console.log(`spgr + gupta_correction   = ${spgr_reading + gupta_correction_4}`);
//
//     return(corrected_sal);
//   }
//
// // +++++++++++++++++++++++++++++++++++++++++++++++++

// # ** NB: NB: NB: Temp sent in CELCIUS, *BUT* when send to calcRhoFW:,
// # **             now must send in KELVIN (unlike implementation in WqCalc project)
//
// # *******
// # ******* NB: 09-IX-2016, [CHANGED] tempCal TO tempRef
// # *******

function calcSalFromSpGravity(spGrav, tempRead, tempRef) {
	let A = 0.824493 - 0.0040899 * tempRead;
	A = A + 0.000076438 * tempRead * tempRead;
	A = A + -0.00000082467 * Math.pow(tempRead, 3);
	A = A + 0.0000000053875 * Math.pow(tempRead, 4);

	let B = -0.00572466 + 0.00010227 * tempRead;
	B = B + -0.0000016546 * tempRead * tempRead;

	let C = 0.00048314;

	let mySal = calcSecantMethod(
		C,
		B,
		A,
		0.0,
		calcRhoFW(tempRead + 273.15) - calcRhoFW(tempRef + 273.15) * spGrav
	);

	mySal = mySal * mySal;

	return mySal;
}

// ******************************************

// -- from R -- //

function fOfx(x, a, b, c, d, e) {
	return a * x * x * x * x + b * x * x * x + c * x * x + d * x + e;
}

// # ** code the secant method to solve 2nd-, 3rd-, & 4th-degree polynomials
function calcSecantMethod(q4, q3, q2, q1, q0) {
	// # ***************************************
	// # Method to carry out the secant search
	// # ***************************************

	// # ** define the number of iterations
	const n = 500;
	const del = Math.pow(10, -10);
	const a = 0;
	const b = 40;

	// # ** define the interval, dx, and ...
	let dx = (b - a) / 10;
	let x = (a + b) / 2;
	// # ***************************************

	let k = 0;

	// # ** increment the interval
	let x1 = x + dx;

	// # ** while the increment is greater than the tolerance
	// # ** and the iterations are less than the max number thereof
	// # ** NB ** for iOS, MUST USE ---> fabs() <----, not abs() !!
	while (Math.abs(dx) >= del && k <= n) {
		let d = fOfx(x1, q4, q3, q2, q1, q0) - fOfx(x, q4, q3, q2, q1, q0);
		let x2 = x1 - (fOfx(x1, q4, q3, q2, q1, q0) * (x1 - x)) / d;

		x = x1;
		x1 = x2;

		dx = x1 - x;

		k = k + 1;
	}

	// #  if(k === n) NSLog(@"Convergence not found after %d iterations",n)

	return x1;
}

// ******************************************

// # ---- Convert SAL to ALL Units ----
// # convert to all units
// # @param h_input_val, entered hydrometry value
// # @param h_input_idx, entered hydrometry units index
// # @param sal in IC units (ppt)
// # @param temp in IC units (K)
// # @param tc, hydrometry temp correction, boolean
// # Answers the Q: What is the hydrometer reading for sal in K?
// # salToAllUnits = function(h_input_val, h_input_idx, sal, temp, tc) {

export function salToAllUnits(sal, temp) {
	// console.log(`*** SalConversion.js/salToAllUnits...${sal} ppt, ${temp} K`);
	// console.log(
	//   `*** SalConversion.js/salToAllUnits...${typeof sal} ppt, ${typeof temp} K`
	// );

	const t = temp - 273.15;

	// see: https://stackoverflow.com/questions/11832914/round-to-at-most-2-decimal-places-only-if-necessary
	// answer by "Adam A."
	// parseFloat(Math.round(x * Math.pow(10, n)) / Math.pow(10, n)).toFixed(n)
	const h_15_0 = round(givenSalAndTempCalcUncorrectedHydrometerReading(sal, t, 15.556, 0), 5);
	const h_15_1 = round(givenSalAndTempCalcUncorrectedHydrometerReading(sal, t, 15.556, 1), 5);
	const h_20_0 = round(givenSalAndTempCalcUncorrectedHydrometerReading(sal, t, 20.0, 0), 5);
	const h_20_1 = round(givenSalAndTempCalcUncorrectedHydrometerReading(sal, t, 20.0, 1), 5);
	const h_25_0 = round(givenSalAndTempCalcUncorrectedHydrometerReading(sal, t, 25.0, 0), 5);
	const h_25_1 = round(givenSalAndTempCalcUncorrectedHydrometerReading(sal, t, 25.0, 1), 5);

	// # cat('2: salTo--All--Units ... passed in: ', sal, ' -- h_25_1: ', h_25_1, '\n')

	// # c in S/m
	// # NB: Salinity Trap !!
	// # see: Fofonoff & ...
	// see: http://www.code10.info/index.php?option=com_content&view=article&id=65:conversion-between-conductivity-and-pss-78-salinity&catid=54:cat_coding_algorithms_seawater&Itemid=79
	// Equations are valid within the temperature range between –2°C and +35°C, pressure range between 0 and 10000 decibars and a practical salinity range between 2 and 42 or the respective electrical conductivity and conductivity ratio.
	// Although practical salinity values <2 are not defined, the equations deliver valid non-zero results down to thresholds of conductivity ratios >0.0005 and salinities >0.02. Values in these outer limits are estimates congruent with the Fortran algorithms (UNESCO 1983). Below these thresholds functions return 0 (UNESCO 1983).

	// see: Salinity - Conductivity converter at http://salinometry.com/stp-conductivity-calculator/

	let c_Sm = 0.0;
	if (sal >= 0.02) {
		c_Sm = calcConductivityFromSalinity(sal, t, 0);
	} else {
		c_Sm = 0.0;
	}

	let c_microScm = c_Sm * 10000;
	let c_Scm = c_Sm / 100;
	let c_dSmm = c_Sm * 10;
	let c_mScm = c_dSmm;

	// console.log(`c_mScm = ${c_mScm}`);

	// # cat('3: salTo--All--Units ... passed in: ', sal, ' -- c_Sm: ', c_Sm, '\n')

	c_Sm = round(c_Sm, 3);
	c_microScm = round(c_microScm, 0);
	c_Scm = round(c_Scm, 4);
	c_mScm = c_dSmm = round(c_dSmm, 2);

	sal = round(sal, 2);
	// sal = formatC(sal, format='f', digits=2);

	const salVals = [
		sal,
		c_microScm,
		c_Sm,
		c_Scm,
		c_mScm,
		h_15_0,
		h_15_1,
		h_20_0,
		h_20_1,
		h_25_0,
		h_25_1
	];

	return salVals;
}

export const salToConductivityUnits = (sal, temp) => {
	// console.log(`*** SalConversion.js/salToAllUnits...${sal} ppt, ${temp} K`);
	// console.log(
	//   `*** SalConversion.js/salToAllUnits...${typeof sal} ppt, ${typeof temp} K`
	// );

	const t = temp - 273.15;

	// see: https://stackoverflow.com/questions/11832914/round-to-at-most-2-decimal-places-only-if-necessary
	// answer by "Adam A."
	// parseFloat(Math.round(x * Math.pow(10, n)) / Math.pow(10, n)).toFixed(n)
	// const h_15_0 = round(givenSalAndTempCalcUncorrectedHydrometerReading(sal, t, 15.556, 0), 5);
	// const h_15_1 = round(givenSalAndTempCalcUncorrectedHydrometerReading(sal, t, 15.556, 1), 5);
	// const h_20_0 = round(givenSalAndTempCalcUncorrectedHydrometerReading(sal, t, 20.0, 0), 5);
	// const h_20_1 = round(givenSalAndTempCalcUncorrectedHydrometerReading(sal, t, 20.0, 1), 5);
	// const h_25_0 = round(givenSalAndTempCalcUncorrectedHydrometerReading(sal, t, 25.0, 0), 5);
	// const h_25_1 = round(givenSalAndTempCalcUncorrectedHydrometerReading(sal, t, 25.0, 1), 5);

	// # cat('2: salTo--All--Units ... passed in: ', sal, ' -- h_25_1: ', h_25_1, '\n')

	// # c in S/m
	// # NB: Salinity Trap !!
	// # see: Fofonoff & ...
	// see: http://www.code10.info/index.php?option=com_content&view=article&id=65:conversion-between-conductivity-and-pss-78-salinity&catid=54:cat_coding_algorithms_seawater&Itemid=79
	// Equations are valid within the temperature range between –2°C and +35°C, pressure range between 0 and 10000 decibars and a practical salinity range between 2 and 42 or the respective electrical conductivity and conductivity ratio.
	// Although practical salinity values <2 are not defined, the equations deliver valid non-zero results down to thresholds of conductivity ratios >0.0005 and salinities >0.02. Values in these outer limits are estimates congruent with the Fortran algorithms (UNESCO 1983). Below these thresholds functions return 0 (UNESCO 1983).

	// see: Salinity - Conductivity converter at http://salinometry.com/stp-conductivity-calculator/

	let c_Sm = 0.0;

	if (sal >= 0.02) {
		c_Sm = calcConductivityFromSalinity(sal, t, 0);
	} else {
		c_Sm = 0.0;
	}

	let c_microScm = c_Sm * 10000;
	let c_Scm = c_Sm / 100;
	let c_dSmm = c_Sm * 10;
	let c_mScm = c_dSmm;

	// console.log(`c_mScm = ${c_mScm}`);

	// # cat('3: salTo--All--Units ... passed in: ', sal, ' -- c_Sm: ', c_Sm, '\n')

	if (sal === 0.02) {
		// console.log(`CALC MIN CONDUCTIVITY`);
		c_Sm = round(c_Sm, 4);
		c_microScm = round(c_microScm, 1);
		c_Scm = round(c_Scm, 5);
		c_mScm = c_dSmm = round(c_dSmm, 3);
	} else {
		c_Sm = round(c_Sm, 3);
		c_microScm = round(c_microScm, 0);
		c_Scm = round(c_Scm, 4);
		c_mScm = c_dSmm = round(c_dSmm, 2);
	}

	// console.log(`${sal}‰ ...`);
	// console.log(`c_microScm = ${c_microScm} µS/m`);
	// console.log(`      c_Sm = ${c_Sm} S/m`);
	// console.log(`     c_Scm = ${c_Scm} S/cm`);
	// console.log(`    c_mScm = ${c_mScm} mS/cm`);

	sal = round(sal, 2);

	// sal = formatC(sal, format='f', digits=2);

	// const salVals = [
	// 	sal,
	// 	c_microScm,
	// 	c_Sm,
	// 	c_Scm,
	// 	c_mScm
	// 	// h_15_0,
	// 	// h_15_1,
	// 	// h_20_0,
	// 	// h_20_1,
	// 	// h_25_0,
	// 	// h_25_1
	// ];

	const salVals = {
		ppt: sal,
		μS_cm: c_microScm,
		S_m: c_Sm,
		S_cm: c_Scm,
		mS_cm: c_mScm
	};

	return salVals;
};

export const conductivityToAllUnits = (salinity, salPosition, icTemp) => {
	// change icTemp to Celcius
	const tempInCelcius = icTemp - 273.15;

	// define an array with factors to convert to S/m
	const factorToSm = [0.0001, 1, 100, 0.1];

	// calc IC conductivity (S/m)
	let icConductivity;
	if (1 === salPosition) {
		// # ** NB: first convert to S/m
		icConductivity = factorToSm[salPosition - 1] * salinity;
		// console.log(`${salinity} μS/cm (μmho/cm) --> ${icConductivity} S/m`);
	} else if (2 === salPosition) {
		icConductivity = factorToSm[salPosition - 1] * salinity;
		// console.log(`${salinity} S/m --> ${icConductivity} S/m`);
	} else if (3 === salPosition) {
		icConductivity = factorToSm[salPosition - 1] * salinity;
		// console.log(`${salinity} S/cm --> ${icConductivity} S/m`);
	} else if (4 === salPosition) {
		icConductivity = factorToSm[salPosition - 1] * salinity;
		// console.log(`${salinity} mS/cm (dS/m) --> ${icConductivity} S/m`);
	}

	// convert all conductivity Units
	let convertedSals = factorToSm.map((f, idx) => icConductivity / f);
	// console.log(convertedSals);

	// calc salinity in ppt from IC conductivity
	const salFromConductivity = calcSwSalinityFromConductivity(icConductivity, tempInCelcius, 0, 0);
	// console.log(`salFromConductivity = ${salFromConductivity}`);

	// add salinity in ppt as first element in convertedSals array
	// convertedSals = [salFromConductivity, ...convertedSals];

	// console.log(convertedSals);

	// convert to hydrometer units from salinity in ppt
	const h_15_0 = givenSalAndTempCalcUncorrectedHydrometerReading(
		salFromConductivity,
		tempInCelcius,
		15.556,
		0
	);
	const h_15_1 = givenSalAndTempCalcUncorrectedHydrometerReading(
		salFromConductivity,
		tempInCelcius,
		15.556,
		1
	);
	const h_20_0 = givenSalAndTempCalcUncorrectedHydrometerReading(
		salFromConductivity,
		tempInCelcius,
		20.0,
		0
	);
	const h_20_1 = givenSalAndTempCalcUncorrectedHydrometerReading(
		salFromConductivity,
		tempInCelcius,
		20.0,
		1
	);
	const h_25_0 = givenSalAndTempCalcUncorrectedHydrometerReading(
		salFromConductivity,
		tempInCelcius,
		25.0,
		0
	);
	const h_25_1 = givenSalAndTempCalcUncorrectedHydrometerReading(
		salFromConductivity,
		tempInCelcius,
		25.0,
		1
	);

	const hydrometerArray = [h_15_0, h_15_1, h_20_0, h_20_1, h_25_0, h_25_1];

	// pack these at the end convertedSals
	convertedSals = [...convertedSals, ...hydrometerArray];

	return convertedSals;
};

// One conductivity to all other conductivities & ppt,
// but NOT to bothersome hydrometer units
// @param salPositions
// 	1: c_microScm,
// 	2: c_Sm,
// 	3: c_Scm,
// 	4: c_mScm
export const conductivityToSalUnits = (salinity, salPosition, icTemp) => {
	// change icTemp to Celcius
	const tempInCelcius = icTemp - 273.15;

	// if (tempInCelcius < 4) {
	// 	console.log(`${tempInCelcius} < 4 => RETURN`);
	// 	return;
	// }

	// define an array with factors to convert to S/m
	const factorToSm = [0.0001, 1, 100, 0.1];

	// console.log(`** salinity: ${salinity}`);
	// console.log(`** salPosition: ${salPosition}`);
	// console.log(`** icTemp: ${icTemp}`);

	// calc IC conductivity (S/m)
	let icConductivity;

	if (1 === salPosition) {
		// # ** NB: first convert to S/m
		icConductivity = factorToSm[salPosition - 1] * salinity;
		// console.log(`${salinity} μS/cm (μmho/cm) --> ${icConductivity} S/m`);
	} else if (2 === salPosition) {
		icConductivity = factorToSm[salPosition - 1] * salinity;
		// console.log(`${salinity} S/m --> ${icConductivity} S/m`);
	} else if (3 === salPosition) {
		icConductivity = factorToSm[salPosition - 1] * salinity;
		// console.log(`${salinity} S/cm --> ${icConductivity} S/m`);
	} else if (4 === salPosition) {
		icConductivity = factorToSm[salPosition - 1] * salinity;
		// console.log(`${salinity} mS/cm (dS/m) --> ${icConductivity} S/m`);
	}

	// console.log(`icConductivity: `, icConductivity);

	// convert all conductivity Units
	let convertedSals = factorToSm.map((f, idx) => icConductivity / f);
	// console.log(`11. convertedSals: `, convertedSals);

	// console.log(` `);
	// console.log(`0. convertedSals`, convertedSals);
	// see: https://bobbyhadz.com/blog/javascript-parse-string-with-comma-to-number
	// (sloppy hack to first cast to string, but it works)
	// XXX if (formatResultsLiteral(value) === typeof string) {
	// 	return parseFloat(formatResultsLiteral(value).replace(/,/g, ''));
	// }
	convertedSals = convertedSals.map((value) => {
		return formatResultsForConductivity(value);
	});

	// console.log(`22. convertedSals: `, convertedSals);
	// console.log(`1. convertedSals`, convertedSals);
	// console.log(` `);

	// calc salinity in ppt from IC conductivity
	const salFromConductivity = calcSwSalinityFromConductivity(icConductivity, tempInCelcius, 0, 0);
	// console.log(`salFromConductivity = ${salFromConductivity}`);

	// add salinity in ppt as first element in convertedSals array
	convertedSals = [salFromConductivity.toFixed(2), ...convertedSals];

	// console.log(`33. convertedSals: `, convertedSals);

	// convert to hydrometer units from salinity in ppt
	// const h_15_0 = givenSalAndTempCalcUncorrectedHydrometerReading(
	// 	salFromConductivity,
	// 	tempInCelcius,
	// 	15.556,
	// 	0
	// );
	// const h_15_1 = givenSalAndTempCalcUncorrectedHydrometerReading(
	// 	salFromConductivity,
	// 	tempInCelcius,
	// 	15.556,
	// 	1
	// );
	// const h_20_0 = givenSalAndTempCalcUncorrectedHydrometerReading(
	// 	salFromConductivity,
	// 	tempInCelcius,
	// 	20.0,
	// 	0
	// );
	// const h_20_1 = givenSalAndTempCalcUncorrectedHydrometerReading(
	// 	salFromConductivity,
	// 	tempInCelcius,
	// 	20.0,
	// 	1
	// );
	// const h_25_0 = givenSalAndTempCalcUncorrectedHydrometerReading(
	// 	salFromConductivity,
	// 	tempInCelcius,
	// 	25.0,
	// 	0
	// );
	// const h_25_1 = givenSalAndTempCalcUncorrectedHydrometerReading(
	// 	salFromConductivity,
	// 	tempInCelcius,
	// 	25.0,
	// 	1
	// );

	// const hydrometerArray = [h_15_0, h_15_1, h_20_0, h_20_1, h_25_0, h_25_1];

	// pack these at the end convertedSals
	// convertedSals = [...convertedSals, ...hydrometerArray];

	return convertedSals;
};

function hydrometerToAllUnits(spgr_reading, t_sample, t_standard, tc) {
	// console.log(` `);
	// console.log(`hydrometeryToAllUnits...`);

	t_sample = t_sample - 273.15;

	const hydrometerTempStandards = [15.556, 20, 25];

	// which idx --> which t_standard? 5, 6; 7, 8; 9, 10;
	// NB: this becomes the IC unit to calc the other 5 hydrometry conversions
	if (t_standard === 5 || t_standard === 6) {
		t_standard = hydrometerTempStandards[0];
	}
	if (t_standard === 7 || t_standard === 8) {
		t_standard = hydrometerTempStandards[1];
	}
	if (t_standard === 9 || t_standard === 10) {
		t_standard = hydrometerTempStandards[2];
	}

	// const t_reference = t_standard;

	// First, calc 'companion' spgr of *entered* spgr (either raw or T-corrected)
	// (TRUE sample density / denisty of pure water at standard TEMPERATURE)
	// if tc === 0, raw entered, so ADD gupta to spgr
	// if tc === 1, T-corrected entered, so SUBTRACT gupta from spgr

	let salFromHydrometery, spgr_true_entered, spgr_raw_entered, nameOfEnteredSpgr, keyOfEnteredSpgr; // used to return the user's input without calculation 'error'

	// calc gupta_correction
	const gupta = calc_gupta_correction(t_sample, t_standard);

	// console.log(` gupta(${10}, ${20}) = ${calc_gupta_correction(10, 20)}`);
	// console.log(` gupta(${20}, ${20}) = ${calc_gupta_correction(20, 20)}`);
	// console.log(` gupta(${27}, ${20}) = ${calc_gupta_correction(27, 20)}`);
	// console.log(`*gupta(${t_sample}, ${t_standard}) = ${calc_gupta_correction(t_sample, t_standard)}`);

	// const gupta_correction_factor_no_gamma = (calcRhoFW(t_standard + 273.15) /
	//     (calcRhoFW(t_sample + 273.15) * (1 + 0 * (t_sample - t_standard))) - 1);
	//
	// console.log(`gupta_correction_factor_no_gamma = ${gupta_correction_factor_no_gamma}`);
	//
	// console.log(` `);

	if (tc === 0) {
		spgr_raw_entered = spgr_reading;

		// apply gupta_correction to entered UNCORRECTED spgr
		spgr_true_entered = spgr_raw_entered * (1 + gupta);

		// const spgr_true_entered_no_gamma = spgr_raw_entered * ( 1 + gupta_correction_factor_no_gamma);
		//
		// console.log(`----------------`);
		// console.log(`with GUPTA good = ${spgr_true_entered} vs. bad = ${spgr_true_entered_no_gamma}`);
		// console.log(`----------------`);

		// console.log(` `);
		// console.log(`==========================================`);
		// console.log(`ENTERED UNCORRECTED SPGR at ${t_sample} C...`);
		// console.log(` Raw:        ${spgr_raw_entered} ${t_standard} C / ${t_reference} C`);
		// console.log(` CORRECTED*: ${spgr_true_entered}`);

		// Next, calc salinity in ppt from entered spgr (but is it TRUE spgr...?)
		// if tc === 0, then it's the RAW spgr, so must add temperature correction
		// salFromHydrometery = calcSalFromSpGr(spgr_true_entered, t_sample, t_standard, t_reference, tc);
		// salFromHydrometery           = calcSalFromSpGravity(spgr_true_entered, t_sample, t_standard)

		// NB: after temperature correction is applied, the corrected reading is the 'actual' spgr
		//     at the standard temperature
		salFromHydrometery = calcSalFromSpGravity(spgr_true_entered, t_standard, t_standard);

		// let t = t_standard, s = salFromHydrometery;
		// console.log(`Rho(${t}, ${s})   = ${calcRho(t + 273.15, s)}`);
		// console.log(`RhoFW(${t})       = ${calcRhoFW(t + 273.15)}`);
		// console.log(`SpGr(${t}, ${s})  = ${calcRho(t + 273.15, s) / calcRhoFW(t + 273.15)} ... `);
		// console.log(` ... vs. ${spgr_true_entered}`);

		// console.log(`Salinity:    ${salFromHydrometery}) ppt (from t_standard)`);

		nameOfEnteredSpgr = `h_` + Math.floor(t_standard) + `_` + tc;
		// console.log(`NAME of user-entered spgr is ${nameOfEnteredSpgr}`);

		keyOfEnteredSpgr = Math.floor(t_standard) + tc;
		// console.log(`Index of user-entered spgr is ${keyOfEnteredSpgr}`);

		// const x = 273.15;
		// console.log(`SpGr(20) = ${calcRho(3.98 + x, 35) / calcRhoFW(3.98 + x)}`);
		// console.log(`SpGr(20) = ${calcRho(20 + x, 35) / calcRhoFW(20 + x)}`);
		// console.log(`SpGr(25) = ${calcRho(25 + x, 35) / calcRhoFW(25 + x)}`);

		// after temperature correction is applied, the corrected reading is the 'actual' spgr at
		//       the standard temperature
		// const check_reading_sample   = givenSalAndTempCalcUncorrectedHydrometerReading(salFromHydrometery, t_sample, t_standard, tc);
		// // ********* NB ********* THIMK!
		// const check_reading_standard = givenSalAndTempCalcUncorrectedHydrometerReading(salFromHydrometery, t_standard, t_standard, tc);
		// console.log(`check_reading_1 (${tc}) from sal & temp --> ${check_reading_sample} vs. ${spgr_true_entered}`);
		// console.log(`check_reading_2 (${tc}) from sal & temp --> ${check_reading_standard} vs. ${spgr_true_entered}`);
		// console.log(`---------`);
		// const check_reading_standard_20 = givenSalAndTempCalcUncorrectedHydrometerReading(salFromHydrometery, 20, 20, tc);
		// console.log(`check_reading_20 (${tc}) from sal & temp --> ${check_reading_standard_20} vs. ${spgr_true_entered}`);
		// console.log(` `);
	} else {
		spgr_true_entered = spgr_reading;

		// subtract gupta_correction from entered un-corrected spgr
		// spgr_raw_entered = spgr_true_entered * ( 1 - gupta);
		spgr_raw_entered = spgr_true_entered / (1 + gupta);
		// ...OR...
		// spgr_raw_entered_2 = spgr_true_entered / ( 1 + gupta);

		// console.log(`RAW...spgr_true_entered * ( 1 - gupta) = ${spgr_raw_entered} vs. spgr_true_entered / ( 1 + gupta) ${spgr_true_entered / ( 1 + gupta)}`);

		// console.log(` `);
		// console.log(`==========================================`);
		// console.log(`ENTERED TRUE SPGR at ${spgr_reading}...`);
		// console.log(` Raw*:      ${spgr_raw_entered} ${t_standard} C / ${t_reference} C`);
		// console.log(` CORRECTED: ${spgr_true_entered}`);

		salFromHydrometery = calcSalFromSpGravity(spgr_true_entered, t_standard, t_standard);

		// salFromHydrometery = calcSalFromSpGr(spgr_true_entered, t_sample, t_standard, t_reference, tc);
		// console.log(`RAW* ${spgr_raw_entered} ${t_standard}/${t_reference} at ${t_sample} C --> ${salFromHydrometery} ppt`);

		nameOfEnteredSpgr = `h_` + Math.floor(t_standard) + `_` + tc;
		// console.log(`NAME of user-entered spgr is ${nameOfEnteredSpgr}`);

		keyOfEnteredSpgr = Math.floor(t_standard) + tc;
		// console.log(`Index of user-entered spgr is ${keyOfEnteredSpgr}`);

		// const check_reading = givenSalAndTempCalcUncorrectedHydrometerReading(salFromHydrometery, t_sample, t_standard, tc);
		// console.log(`check_reading (${tc}) from sal & temp --> ${check_reading} vs. ${spgr_raw_entered}`);
		// console.log(` `);
	}

	// ------- AFTER USE ENTERED spgr to calc salinity, calc all spgr conversions from salinity -------- //

	// Convert all of the others through the estimated salinity
	// const h_15_0 = givenSalAndTempCalcUncorrectedHydrometerReading(salFromHydrometery, t_sample, 15.556, 0);
	// const h_15_1 = givenSalAndTempCalcUncorrectedHydrometerReading(salFromHydrometery, t_sample, 15.556, 1);
	// const h_20_0 = givenSalAndTempCalcUncorrectedHydrometerReading(salFromHydrometery, t_sample, 20.0, 0);
	// const h_20_1 = givenSalAndTempCalcUncorrectedHydrometerReading(salFromHydrometery, t_sample, 20.0, 1);
	// const h_25_0 = givenSalAndTempCalcUncorrectedHydrometerReading(salFromHydrometery, t_sample, 25.0, 0);
	// const h_25_1 = givenSalAndTempCalcUncorrectedHydrometerReading(salFromHydrometery, t_sample, 25.0, 1);

	const h_15_0 = givenSalAndTempCalcUncorrectedHydrometerReading(
		salFromHydrometery,
		t_sample,
		15.556,
		0
	);
	const h_15_1 = givenSalAndTempCalcUncorrectedHydrometerReading(
		salFromHydrometery,
		t_sample,
		15.556,
		1
	);
	const h_20_0 = givenSalAndTempCalcUncorrectedHydrometerReading(
		salFromHydrometery,
		t_sample,
		20.0,
		0
	);
	const h_20_1 = givenSalAndTempCalcUncorrectedHydrometerReading(
		salFromHydrometery,
		t_sample,
		20.0,
		1
	);
	const h_25_0 = givenSalAndTempCalcUncorrectedHydrometerReading(
		salFromHydrometery,
		t_sample,
		25.0,
		0
	);
	const h_25_1 = givenSalAndTempCalcUncorrectedHydrometerReading(
		salFromHydrometery,
		t_sample,
		25.0,
		1
	);

	const arrayToIdIndex = [15, 16, 20, 21, 25, 26];
	const hydrometerArray = [h_15_0, h_15_1, h_20_0, h_20_1, h_25_0, h_25_1];

	// NB: NOW...replace the ENTERED spgr for the calculated spgr at the correct position
	const indexToReplace = arrayToIdIndex.indexOf(keyOfEnteredSpgr);

	// console.log(`nameOfEnteredSpgr = ${nameOfEnteredSpgr} is at ${indexToReplace}`);
	// console.log(`0. hydrometerArray[${indexToReplace}] = ${hydrometerArray[indexToReplace]}`);
	// console.log(hydrometerArray);

	hydrometerArray[indexToReplace] = spgr_reading;

	// console.log(`1. hydrometerArray[${indexToReplace}] = ${hydrometerArray[indexToReplace]} (${spgr_reading})`);
	// console.log(hydrometerArray);
	// console.log(` `);
	// console.log(`=============================`);
	// console.log(` `);

	// const h = givenSalAndTempCalcUncorrectedHydrometerReading(salFromHydrometery, t_sample, t_standard, tc);
	// console.log(`Entered: ${spgr_reading} vs. Calculated: ${h} vs. ${spgr} (${t_standard}/${t_standard})`);
	// console.log(`Other: ${spgr_reading + spgr * gupta}`);

	// ** NB: Calc CONDuCTIVITY from the estimated salinity
	let c_Sm = 0.0;
	if (salFromHydrometery >= 0.02) {
		c_Sm = calcConductivityFromSalinity(salFromHydrometery, t_sample, 0);
	} else {
		c_Sm = 0.0;
	}

	let c_microScm = c_Sm * 10000;
	let c_Scm = c_Sm / 100;
	let c_dSmm = c_Sm * 10;
	let c_mScm = c_dSmm;

	const conductivityValues = [c_microScm, c_Sm, c_Scm, c_mScm];

	// console.log([+salFromHydrometery, ...conductivityValues, ...hydrometerArray]);

	return [+salFromHydrometery, ...conductivityValues, ...hydrometerArray];
}

// ******************************************

// module.exports = {
// 	calcRho,
// 	tempToIcUnits,
// 	reduceSalIndex,
// 	salToIcUnits,
// 	salToAllUnits,
// 	conductivityToAllUnits,
// 	hydrometerToAllUnits
// };
