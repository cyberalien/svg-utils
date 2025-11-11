import { uniquePromise } from '../../src/helpers/misc/promises.js';

describe('Testing unique promises', () => {
	it('Simple loader', async () => {
		const key = 'simple-loader';
		const data1 = await uniquePromise(key, () => {
			return new Promise((resolve) => {
				setTimeout(() => {
					resolve(100);
				}, 10);
			});
		});
		expect(data1).toEqual(100);

		// Another run with the same key: should return a different result because the first Promise already finished
		const data2 = await uniquePromise(key, () => {
			return new Promise((resolve) => {
				setTimeout(() => {
					resolve(101);
				}, 10);
			});
		});
		expect(data2).toEqual(101);
	});

	it('Exception', async () => {
		const key = 'bad-loader';
		let failed = false;
		try {
			await uniquePromise(key, () => {
				return new Promise((resolve, reject) => {
					setTimeout(() => {
						reject(new Error('Fail'));
					}, 10);
				});
			});
		} catch (err) {
			failed = true;
			expect((err as Error).message).toBe('Fail');
		}
		expect(failed).toBeTruthy();
	});

	it('Multiple concurrent runs', async () => {
		const key = 'concurrent-test';
		const key2 = 'concurrent-test2';
		return new Promise((resolve, reject) => {
			let loader1Ran = false;
			let result1 = 0;
			let loader2Ran = false;
			let result2 = 0;
			let loader3Ran = false;
			let result3 = 0;

			function finishTest() {
				if (result1 && result2 && result3) {
					try {
						expect(loader1Ran).toBeTruthy();
						expect(loader2Ran).toBeTruthy();
						expect(loader3Ran).toBeFalsy();
						expect(result1).toEqual(123);
						expect(result2).toEqual(234);
						expect(result3).toEqual(123);
					} catch (err) {
						reject(err);
						return;
					}
					resolve(true);
				}
			}

			// Loader 1
			uniquePromise<number>(key, () => {
				return new Promise((resolve) => {
					setTimeout(() => {
						loader1Ran = true;
						resolve(123);
					}, 10);
				});
			})
				.then((data) => {
					result1 = data;
					finishTest();
				})
				.catch(reject);

			// Loader with a different key
			uniquePromise<number>(key2, () => {
				return new Promise((resolve) => {
					setTimeout(() => {
						loader2Ran = true;
						resolve(234);
					}, 10);
				});
			})
				.then((data) => {
					result2 = data;
					finishTest();
				})
				.catch(reject);

			// Loader 3: should not be called
			uniquePromise<number>(key, () => {
				return new Promise((resolve) => {
					setTimeout(() => {
						loader3Ran = true;
						resolve(345);
					}, 10);
				});
			})
				.then((data) => {
					result3 = data;
					finishTest();
				})
				.catch(reject);
		});
	});

	it('Synchronous function', async () => {
		const data = await uniquePromise('sync-loader', () => {
			return 200;
		});
		expect(data).toEqual(200);
	});

	it('Void result', async () => {
		const data = await uniquePromise('sync-loader-void', () => {
			return;
		});
		expect(data).toBeUndefined();
	});
});
