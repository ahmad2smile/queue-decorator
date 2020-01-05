interface StoredEntity<T, R> {
	entity: T;
	resolve: (payload: R) => void;
	reject: (payload: Error) => void;
}

export function Queue<C, T, R>(predicate: (a: T, b: T) => boolean) {
	return (target: C, key: string, descriptor: PropertyDescriptor) => {
		const original = descriptor.value;

		let context: C;
		const queued: Array<StoredEntity<T, R>> = [];
		let inProgress: Array<StoredEntity<T, R>> = [];

		const caller = async (
			entity: T,
			resolve: (payload: R) => void,
			reject: (error: Error) => void,
		) => {
			if (inProgress.some(a => predicate(a.entity, entity))) {
				queued.push({
					entity,
					resolve,
					reject,
				});
			} else {
				inProgress.unshift({
					entity,
					resolve,
					reject,
				});

				try {
					const result = await original.apply(context, [
						entity,
						resolve,
						reject,
					]);

					resolve(result);

					inProgress = inProgress.filter(
						a => !predicate(a.entity, entity),
					);

					const firstQueued = queued.pop();

					if (firstQueued) {
						caller(
							firstQueued.entity,
							firstQueued.resolve,
							firstQueued.reject,
						);
					}
				} catch (error) {
					reject(error);
				}
			}
		};

		descriptor.value = function(entity: T) {
			if (!context) {
				// @ts-ignore
				context = this;
			}

			return new Promise((resolve, reject) => {
				caller(entity, resolve, reject);
			});
		};

		return descriptor;
	};
}
