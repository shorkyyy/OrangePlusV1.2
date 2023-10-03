import type { AnimatableValue } from '../commonTypes';
type withDelayType = <T extends AnimatableValue>(delayMs: number, delayedAnimation: T) => T;
export declare const withDelay: withDelayType;
export {};
