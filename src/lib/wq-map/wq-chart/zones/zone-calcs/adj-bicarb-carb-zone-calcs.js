export const adjBicarbCarbZoneCoords = () => {
	// [
	//   { x: dic_init, y: icAlk_init * 1000 },
	//   { x: 10, y: icAlk_init * 1000 + 1 * (10 - dic_init) },
	//   { x: 10, y: icAlk_init * 1000 + 2 * (10 - dic_init) },
	// ]

	// [NB] Without re-checking, adjusted DIC for fill
	// const myDic = 2.727751505388579;
	const myDic = 2.66;

	// // BIcarb-Hydroxide
	// return [
	// 	{ x: myDic, y: 2.2 },
	// 	{ x: 10, y: 2.2 + 1 * (10 - myDic) },
	// 	{ x: 10, y: 2.2 + 2 * (10 - myDic) }
	// ];

	// // CARB-Hydroxide
	// return [
	// 	{ x: myDic, y: 2.2 },
	// 	{ x: 10, y: 2.2 + 2 * (10 - myDic) },
	// 	{ x: 10, y: 2.2 + 2 * (10 - myDic) }
	// ];

	// // BIcarb-Carb
	// return [
	// 	{ x: 10, y: 2.2 + 1 * (10 - myDic) },
	// 	{ x: myDic, y: 2.2 },
	// 	{ x: 10, y: 2.2 + 2 * (10 - myDic) }
	// ];

	// Return all combinations
	return {
		bicarbCarb: [
			{ x: 10, y: 2.2 + 1 * (10 - myDic) },
			{ x: myDic, y: 2.2 },
			{ x: 10, y: 2.2 + 2 * (10 - myDic) }
		],
		bicarbHydroxide: [
			{ x: myDic, y: 2.2 },
			{ x: 10, y: 2.2 + 1 * (10 - myDic) }
		],
		carbHydroxide: [
			{ x: myDic, y: 2.2 },
			{ x: 10, y: 2.2 + 2 * (10 - myDic) }
		],
		// ...with AERATION...
		bicarbAeration: [
			{ x: 0, y: 2.2 },
			{ x: myDic, y: 2.2 },
			{ x: 10, y: 2.2 + 1 * (10 - myDic) }
		],
		carbAeration: [
			{ x: 0, y: 2.2 },
			{ x: myDic, y: 2.2 },
			{ x: 10, y: 2.2 + 2 * (10 - myDic) }
		],
		hydroxideAeration: [
			{ x: myDic, y: 2.2 },
			{ x: 0, y: 2.2 }
		]
	};
};
