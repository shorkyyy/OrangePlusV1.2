import type { AnimationCallback, AnimatableValue } from '../commonTypes';
type withRepeatType = <T extends AnimatableValue>(animation: T, numberOfReps?: number, reverse?: boolean, callback?: AnimationCallback) => T;
export declare const withRepeat: withRepeatType;
export {};
