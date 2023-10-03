import type { EntryExitAnimationFunction, AnimationFunction, LayoutAnimationFunction } from './commonTypes';
export declare class BaseAnimationBuilder {
    durationV?: number;
    delayV?: number;
    randomizeDelay: boolean;
    callbackV?: (finished: boolean) => void;
    static createInstance: <T extends typeof BaseAnimationBuilder>(this: T) => InstanceType<T>;
    build: () => EntryExitAnimationFunction | LayoutAnimationFunction;
    static duration<T extends typeof BaseAnimationBuilder>(this: T, durationMs: number): InstanceType<T>;
    duration(durationMs: number): this;
    static delay<T extends typeof BaseAnimationBuilder>(this: T, delayMs: number): InstanceType<T>;
    delay(delayMs: number): this;
    static withCallback<T extends typeof BaseAnimationBuilder>(this: T, callback: (finished: boolean) => void): InstanceType<T>;
    withCallback(callback: (finsihed: boolean) => void): this;
    static getDuration(): number;
    getDuration(): number;
    static randomDelay<T extends typeof BaseAnimationBuilder>(this: T): InstanceType<T>;
    randomDelay(): this;
    getDelay(): number;
    getDelayFunction(): AnimationFunction;
    static build<T extends typeof BaseAnimationBuilder>(this: T): EntryExitAnimationFunction | LayoutAnimationFunction;
}
