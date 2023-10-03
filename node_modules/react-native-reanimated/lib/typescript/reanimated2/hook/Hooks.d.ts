import type { DependencyList } from './commonTypes';
import type { useAnimatedPropsType } from '../helperTypes';
export declare const useAnimatedProps: useAnimatedPropsType;
export declare function useWorkletCallback<A extends unknown[], R>(fun: (...args: A) => R, deps?: DependencyList): (...args: Parameters<typeof fun>) => R;
export { useEvent, useHandler } from './utils';
