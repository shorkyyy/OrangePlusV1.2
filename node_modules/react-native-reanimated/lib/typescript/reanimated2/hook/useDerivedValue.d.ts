import type { BasicWorkletFunction, SharedValue } from '../commonTypes';
import type { DependencyList } from './commonTypes';
export type DerivedValue<T> = Readonly<SharedValue<T>>;
export declare function useDerivedValue<T>(processor: BasicWorkletFunction<T>, dependencies?: DependencyList): DerivedValue<T>;
