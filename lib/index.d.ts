export declare function Queue<C, T, R>(predicate: (a: T, b: T) => boolean): (target: C, key: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
