import type { ComplexWorkletFunction } from './commonTypes';
export declare function setupMicrotasks(): void;
declare function callMicrotasksOnUIThread(): void;
export declare const callMicrotasks: typeof callMicrotasksOnUIThread;
/**
 * Schedule a worklet to execute on the UI runtime. This method does not schedule the work immediately but instead
 * waits for other worklets to be scheduled within the same JS loop. It uses queueMicrotask to schedule all the worklets
 * at once making sure they will run within the same frame boundaries on the UI thread.
 */
export declare function runOnUI<A extends any[], R>(worklet: ComplexWorkletFunction<A, R>): (...args: A) => void;
/**
 * Schedule a worklet to execute on the UI runtime skipping batching mechanism.
 */
export declare function runOnUIImmediately<A extends any[], R>(worklet: ComplexWorkletFunction<A, R>): (...args: A) => void;
export declare function runOnJS<A extends any[], R>(fun: ComplexWorkletFunction<A, R>): (...args: A) => void;
export {};
