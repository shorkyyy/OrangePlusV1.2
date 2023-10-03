import type { AnimatableValue } from '../commonTypes';
type withSequenceType = <T extends AnimatableValue>(...animations: T[]) => T;
export declare const withSequence: withSequenceType;
export {};
