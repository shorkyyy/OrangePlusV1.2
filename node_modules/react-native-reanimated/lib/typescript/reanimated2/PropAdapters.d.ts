import type { AdapterWorkletFunction } from './commonTypes';
import type { AnimatedPropsAdapterFunction } from './helperTypes';
export type createAnimatedPropAdapterType = (adapter: AnimatedPropsAdapterFunction, nativeProps?: string[]) => AnimatedPropsAdapterFunction;
export declare const createAnimatedPropAdapter: createAnimatedPropAdapterType;
export declare const SVGAdapter: AdapterWorkletFunction;
export declare const TextInputAdapter: AnimatedPropsAdapterFunction;
