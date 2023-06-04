import { writable } from 'svelte/store';

// "Implement svelte store contract to make own store..."
const ourStore = (name, initialValue, toStorage = [], fromStorage = []) => {
	if (window?.localStorage) {
		const storedValue = window.localStorage.getItem(name);

		if (storedValue) {
			initialValue = fromStorage.reduce((acc, fn) => fn(acc), storedValue);
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

export const showHideGreenZoneFn = () =>
	ourStore('showHideGreenZone', false, [JSON.stringify], [JSON.parse]);

export const showHideCo2ZoneFn = () =>
	ourStore('showHideCo2Zone', false, [JSON.stringify], [JSON.parse]);

export const showHideUianZoneFn = () =>
	ourStore('showHideUianZone', false, [JSON.stringify], [JSON.parse]);

export const resetTargetWaypointFn = () =>
	ourStore('resetTargetWaypoint', false, [JSON.stringify], [JSON.parse]);
