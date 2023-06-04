import { writable } from 'svelte/store';
// import LZString from "lz-string";

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

export const initWpFn = () =>
	ourStore(
		'initWp',
		{
			x: '1.0',
			y: '1.5',
			// y: "3.11309",
			// f(temp & sal)
			ph: {
				phNbs: '7.5', // NBS
				phFree: '6.0', // pH (FREE)
				phTot: '6.0', // pH (TOTAL)
				phSws: '6.0', // pH (SEAWATER)
				phSelected: 'NBS Scale',
				phSelectedShort: ' NBS'
			},
			alk: {
				alk: '1.5',
				// alk: "3.11309",
				alkSelected: 'meq/kg',
				alkSelectedShort: ' meq/kg'
			},
			dic: '1.0',
			uian: '0.0',
			co2: '0.0'
		},
		[JSON.stringify],
		[JSON.parse]
	);

export const targetWpFn = () =>
	ourStore(
		'targetWp',
		{
			x: '2.89',
			y: '3.0',
			ph: '7.5', // NBS
			dic: '3.0',
			alk: '3.0'
		},
		[JSON.stringify],
		[JSON.parse]
	);

// export const targetWp = ourStore(
//   "targetWp",
//   {
//     x: "2.89",
//     y: "3.0",
//     ph: {
//       phNbs: "7.5", // NBS
//       phFree: "6.0", // pH (FREE)
//       phTot: "6.0", // pH (TOTAL)
//       phSws: "6.0", // pH (SEAWATER)
//       phSelected: "NBS Scale",
//       phSelectedShort: " NBS",
//     },
//     alk: {
//       alk: "1.5",
//       alkSelected: "meq/kg",
//       alkSelectedShort: " meq/kg",
//     },
//     dic: "3.0",
//     uian: "0.0",
//     co2: "0.0",
//   },
//   [JSON.stringify],
//   [JSON.parse]
// );

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
