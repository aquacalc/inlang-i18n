// see: http://www.jacklmoore.com/notes/rounding-in-javascript/
export const round = (value, decimals) =>
	Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);

// on-the-fly for conductivity in sveltekit 'spreadsheet-like'
// temp & salinity converter
export const formatResultsForConductivity = (value) => {
	// console.log(`value = ${value} (${typeof value})`);
	if (value === 0) {
		return value;
	} else if (value <= 0.001) {
		// console.log(`0. ${value} -> ${round(value, 6)}`);
		return round(value, 5);
	} else if (value <= 0.01) {
		// console.log(`1. ${value} -> ${round(value, 5)}`);
		return round(value, 5);
	} else if (value < 1 && value > 0.01) {
		// console.log(`2. ${value} -> ${round(value, 4)}`);
		return round(value, 4);
	} else if (value >= 1 && value < 10) {
		// console.log(`3. ${value} -> ${round(value, 3)}`);
		return round(value, 3);
	} else if (value >= 10 && value < 1000) {
		// console.log(`4. ${value} -> ${round(value, 2)}`);
		return round(value, 2);
	} else if (value >= 1000 && value < 1000000) {
		// console.log(`5. ${value} --> ${round(value, 0)}`);
		return round(value, 0);
	} else {
		// console.log(`*6. ${value}`);
		return round(value, 4);
	}
};

// some practical formatting for inconveniently large and small results
// formating function: from '2.642e+6 gallons (US)' to '2.642 million gallons (US)'
//                     from '1.000e+4 cubic meters (m³)' to '2.642 million gallons (US)'
export const formatResultsLiteral = (value) => {
	// console.log(`value = ${value} (${typeof value})`);
	if (value === 0) {
		return value;
	} else if (value <= 0.001 && value > 0.0009) {
		const myValue = round(value.toFixed(20) * 1000, 3);
		return myValue + (myValue === 1 ? ' thousandth' : ' thousandths');
	} else if (value <= 0.0009 && value > 0.000001) {
		return round(value.toFixed(20) * 1000000, 1) + ' millionths';
	} else if (value.toFixed(20) <= 0.000001 && value.toFixed(20) > 0.000000001) {
		return round(value * 1000000000, 1) + ' billionths';
	} else if (value.toFixed(20) <= 0.000000001 && value.toFixed(20) > 0.0000000000001) {
		return round(value * 1000000000000, 1) + ' trillionths';
	} else if (value.toFixed(20) <= 0.0000000000001) {
		return value;
	} else if (value >= 1 && value < 10) {
		return round(value, 2);
	} else if (value >= 10 && value < 1000) {
		return round(value, 1);
	} else if (value >= 1000 && value < 1000000) {
		return round(value, 0).toLocaleString('en');
		// return round(value / 1000, 2) + " thousand";
	} else if (value >= 1000000 && value < 1000000000) {
		return round(value / 1000000, 2) + ' million';
	} else if (value >= 1000000000 && value < 1000000000000) {
		return round(value / 1000000000, 2) + ' billion';
	} else {
		// if (value >= 100) {
		//   return round(value, 2);
		// } else if (value >= 1000) {
		//   return round(value, 1);
		// } else {
		return round(value, 4);
		// }
	}
};
