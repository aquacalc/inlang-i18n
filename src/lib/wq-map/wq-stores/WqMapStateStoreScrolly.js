import { writable } from 'svelte/store';
// import LZString from "lz-string";

// import { browser } from '$app/environment'

// console.log(`browser = `, browser)

// "Implement svelte store contract to make own store..."
const ourStore = (name, initialValue, toStorage = [], fromStorage = []) => {
	if (window?.localStorage) {
		const storedValue = window.localStorage.getItem(name);

		if (storedValue) {
			initialValue = fromStorage.reduce((acc, fn) => fn(acc), storedValue);
			// initialValue = storedValue;
		}
	}

	// "Custom store must adhere to the store contract..."
	// "...and supply the subscribe method and optionally..."
	const { subscribe, set } = writable(initialValue);

	// console.log(`NAME ${name}`);

	return {
		subscribe,

		set: (x) => {
			if (window?.localStorage) {
				window.localStorage.setItem(
					name,
					toStorage.reduce((acc, fn) => fn(acc), x)
				);
			}
			set(x);
		}

		// set: (x) => {
		//   set(x);
		// },
	};
};

// export const myStoredVariable = ourStore("wqStoredVal", "Initial Text");
// export const myStoredUnits = ourStore("wqStoredUnits", "Initial Units");

// ** Used for Scrolly "Visual Aquaculture Water Quality" ** //

export const tempObjTest = ourStore(
	'tempObjTest',
	{
		input: 15,
		isValid: true,
		name: 'temp',
		selected: 'Celsius',
		selectedShort: '° C',
		icInput: 288.15
	},
	[JSON.stringify],
	[JSON.parse]
);

export const salObjTest = ourStore(
	'salObjTest',
	{
		input: 34.5,
		isValid: true,
		name: 'sal',
		selected: '‰',
		selectedShort: '‰',
		icInput: 34.5
	},
	[JSON.stringify],
	[JSON.parse]
);

export const phObjTest = ourStore(
	'phObjTest',
	{
		input: 7.0,
		isValid: true,
		name: 'ph',
		selected: 'NBS',
		selectedShort: 'NBS',
		icInput: 7.0
	},
	[JSON.stringify],
	[JSON.parse]
);

export const alkObjTest = ourStore(
	'alkObjTest',
	{
		input: 2.0,
		isValid: true,
		name: 'alk',
		selected: 'meq/kg',
		selectedShort: 'meq/kg',
		icInput: 2.0
	},
	[JSON.stringify],
	[JSON.parse]
);

export const tanObjTest = ourStore(
	'tanObjTest',
	{
		input: 0.15,
		isValid: true,
		name: 'tan',
		selected: 'mg/L',
		selectedShort: ' mg/L',
		icInput: 0.15
	},
	[JSON.stringify],
	[JSON.parse]
);

// UIA-N for init WP
export const uianObjTest = ourStore(
	'uianObjTest',
	{
		input: 12.5,
		isValid: true,
		name: 'uian-crit',
		selected: 'μg/L',
		selectedShort: ' μg/L',
		// [NB] following "µ" (from option+m) throws error??!
		// selected: "µg/L",
		// selectedShort: " µg/L",
		icInput: 12.5
	},
	[JSON.stringify],
	[JSON.parse]
);

// Critical pH NBS for UIA-N Danger Zone
export const pHCritForUianObjTest = ourStore(
	'pHCritForUianObjTest',
	{
		input: 8.72,
		isValid: true,
		name: 'ph-crit-uian',
		selected: 'μg/L',
		selectedShort: ' μg/L',
		icInput: 8.72
	},
	[JSON.stringify],
	[JSON.parse]
);

// Critical CO2 (mg/L) for CO2 Danger Zone
export const co2CritObjTest = ourStore(
	'co2CritObjTest',
	{
		input: 10.0,
		isValid: true,
		name: 'co2-crit',
		selected: 'mg/L',
		selectedShort: ' mg/L',
		icInput: 10.0
	},
	[JSON.stringify],
	[JSON.parse]
);

// Show/Hide pH topography
export const showHidePhTopo = ourStore('showHidePhTopo', false, [JSON.stringify], [JSON.parse]);

// Show/Hide Green Zone
export const showHideGreenZone = ourStore(
	'showHideGreenZone',
	false,
	[JSON.stringify],
	[JSON.parse]
);

// Show/Hide Sodium bicarbonate vector
export const showHideBicarb = ourStore(
	'showHideBicarb',
	false,
	[JSON.stringify],
	[JSON.parse]
);

// Show/Hide Sodium carbonate vector
export const showHideCarb = ourStore(
	'showHideCarb',
	false,
	[JSON.stringify],
	[JSON.parse]
);

// Show/Hide Sodium carbonate vector
export const showHideCaOh2 = ourStore(
	'showHideCaOh2',
	false,
	[JSON.stringify],
	[JSON.parse]
);

// Show/Hide Aeration vector
export const showHideAeration = ourStore(
	'showHideAeration',
	false,
	[JSON.stringify],
	[JSON.parse]
);

// Show/Hide Sodium carbonate vector
export const showHideOmegaArZone = ourStore(
	'showHideOmegaArZone',
	false,
	[JSON.stringify],
	[JSON.parse]
);

// Omega-ar slider
export const omegaArValue = ourStore('omegaArValue', 3.0, [JSON.stringify], [JSON.parse]);

// ** ^^^^^^^^^^^^^^^^^^^^^^^^^^^ ** //

export const tempObjFn = () =>
	ourStore(
		'tempObj',
		{
			input: '25',
			isValid: true,
			name: 'temp',
			selected: 'Celsius',
			selectedShort: '° C',
			icInput: '298.15'
		},
		[JSON.stringify],
		[JSON.parse]
	);

export const salObjFn = () =>
	ourStore(
		'salObj',
		{
			input: '34.5',
			isValid: true,
			name: 'sal',
			selected: '‰',
			selectedShort: '‰',
			icInput: '34.5'
		},
		[JSON.stringify],
		[JSON.parse]
	);

export const tanObjFn = () =>
	ourStore(
		'tanObj',
		{
			input: '0.15',
			isValid: true,
			name: 'tan',
			selected: 'mg/L',
			selectedShort: ' mg/L',
			icInput: '0.15'
		},
		[JSON.stringify],
		[JSON.parse]
	);

export const uianObjFn = () =>
	ourStore(
		'uianObj',
		{
			input: '12.5',
			isValid: true,
			name: 'uian-crit',
			selected: 'μg/L',
			selectedShort: ' μg/L',
			// [NB] following "µ" (from option+m) throws error??!
			// selected: "µg/L",
			// selectedShort: " µg/L",
			icInput: '12.5'
		},
		[JSON.stringify],
		[JSON.parse]
	);

export const co2CritObjFn = () =>
	ourStore(
		'co2CritObj',
		{
			input: '10',
			isValid: true,
			name: 'co2_crit',
			selected: 'mg/L',
			selectedShort: ' mg/L',
			// [NB] following "µ" (from option+m) throws error??!
			// selected: "µg/L",
			// selectedShort: " µg/L",
			icInput: '10'
		},
		[JSON.stringify],
		[JSON.parse]
	);

// persist last WQ Map transform state
// Initial transform to apply
// Good place to start?
// k: 4.1182510161098795
// x: -262.2313178449341
// y: -963.3251381728401
export const wqMapTransformStateFn = () =>
	ourStore(
		'wqMapTransformState',
		{
			k: 1,
			x: 0,
			y: 0
			// k: 4.1182510161098795,
			// x: -262.2313178449341,
			// y: -963.3251381728401
		},
		[JSON.stringify],
		[JSON.parse]
	);

// export const anObject = ourStore(
//   "anObject",
//   {
//     a: 12345,
//     b: true,
//     c: "a string",
//   },
//   [JSON.stringify],
//   [JSON.parse]
// );

// export const aCompressedObject = ourStore(
//   "aCompressedObject",
//   {
//     a: 12345,
//     b: true,
//     c: "a string",
//   },
//   [JSON.stringify, LZString.compress],
//   [LZString.decompress, JSON.parse]
// );
