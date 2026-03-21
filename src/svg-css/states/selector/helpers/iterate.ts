type Order = 'before' | 'merge' | 'after';
interface MergeOrder {
	order: Order;
	// Index refers to index of item in list1
	index: number;
}

type Callback<T> = (item1: T, item2: T) => T | null;

// Get merge orders
function getMergeOrders(total: number): MergeOrder[] {
	const orders: MergeOrder[] = [
		{
			order: 'before',
			index: 0,
		},
	];
	for (let index = 0; index < total; index++) {
		orders.push({
			order: 'merge',
			index,
		});
		orders.push({
			order: 'after',
			index,
		});
	}
	return orders;
}

/**
 * Merge arrays of items
 */
export function mergeArrays<T>(
	list1: T[],
	list2: T[],
	merge: Callback<T>
): T[][] {
	// Sanity check: make sure there is something to merge
	if (!list1.length) {
		return [list2];
	}
	if (!list2.length) {
		return [list1];
	}

	function appendRemaining(queue: MergeOrder[]): T[] {
		return queue
			.filter((o) => o.order === 'merge')
			.map((o) => list1[o.index]);
	}

	// Function to recursively merge items
	function next(before: T[], list2: T[], queue: MergeOrder[]): T[][] {
		const prev = [...before];
		const results: T[][] = [];

		// Get next item to merge
		const currentItem = list2[0];
		const nextItems = list2.slice(1);

		// Loop queue
		for (let i = 0; i < queue.length; i++) {
			// Index of item in list1 to merge with
			const orderItem = queue[i];

			switch (orderItem.order) {
				case 'after':
					// Add item to 'prev' list, unless added before
					if (i > 0) {
						prev.push(list1[orderItem.index]);
					}

				case 'before': {
					// Add current item before index
					const newPrev = [...prev, currentItem];
					if (!nextItems.length) {
						results.push([
							...newPrev,
							...appendRemaining(queue.slice(i + 1)),
						]);
					} else {
						results.push(
							...next(newPrev, nextItems, queue.slice(i))
						);
					}
					break;
				}

				case 'merge': {
					// Attempt to merge items
					const merged = merge(list1[orderItem.index], currentItem);
					if (merged) {
						const newPrev = [...prev, merged];
						if (!nextItems.length) {
							results.push([
								...newPrev,
								...appendRemaining(queue.slice(i + 1)),
							]);
						} else {
							results.push(
								...next(newPrev, nextItems, queue.slice(i + 1))
							);
						}
					}
				}
			}
		}

		return results;
	}

	return next([], list2, getMergeOrders(list1.length));
}

/**
 * Merge multiple arrays
 */
export function mergeMultipleArrays<T>(
	lists: T[][],
	merge: Callback<T>
): T[][] {
	if (!lists.length) {
		return [];
	}

	// Iterate all lists
	let prevLists = [lists[0]];
	for (let i = 1; i < lists.length; i++) {
		const mergeWith = lists[i];

		// Merge prevLists with mergeWith
		const newLists: T[][] = [];
		for (const prevList of prevLists) {
			newLists.push(...mergeArrays(prevList, mergeWith, merge));
		}
		prevLists = newLists;
	}

	return prevLists;
}
