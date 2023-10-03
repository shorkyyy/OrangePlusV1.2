import type { ShareableRef, ShareableSyncDataHolderRef, Value3D, ValueRotation } from '../commonTypes';
import type { LayoutAnimationFunction, LayoutAnimationType } from '../layoutReanimation';
export interface NativeReanimatedModule {
    installCoreFunctions(callGuard: <T extends Array<unknown>, U>(fn: (...args: T) => U, ...args: T) => void, valueUnpacker: <T>(value: T) => T): void;
    makeShareableClone<T>(value: T, shouldPersistRemote: boolean): ShareableRef<T>;
    makeSynchronizedDataHolder<T>(valueRef: ShareableRef<T>): ShareableSyncDataHolderRef<T>;
    getDataSynchronously<T>(ref: ShareableSyncDataHolderRef<T>): T;
    scheduleOnUI<T>(shareable: ShareableRef<T>): void;
    registerEventHandler<T>(eventHash: string, eventHandler: ShareableRef<T>): number;
    unregisterEventHandler(id: number): void;
    getViewProp<T>(viewTag: string, propName: string, callback?: (result: T) => void): Promise<T>;
    enableLayoutAnimations(flag: boolean): void;
    registerSensor(sensorType: number, interval: number, iosReferenceFrame: number, handler: ShareableRef<(data: Value3D | ValueRotation) => void>): number;
    unregisterSensor(sensorId: number): void;
    configureProps(uiProps: string[], nativeProps: string[]): void;
    subscribeForKeyboardEvents(handler: ShareableRef<number>, isStatusBarTranslucent: boolean): number;
    unsubscribeFromKeyboardEvents(listenerId: number): void;
    configureLayoutAnimation(viewTag: number, type: LayoutAnimationType, sharedTransitionTag: string, config: ShareableRef<Keyframe | LayoutAnimationFunction>): void;
}
export declare class NativeReanimated {
    native: boolean;
    private InnerNativeModule;
    constructor();
    installCoreFunctions(callGuard: <T extends Array<unknown>, U>(fn: (...args: T) => U, ...args: T) => void, valueUnpacker: <T>(value: T) => T): void;
    makeShareableClone<T>(value: T, shouldPersistRemote: boolean): ShareableRef<T>;
    makeSynchronizedDataHolder<T>(valueRef: ShareableRef<T>): ShareableSyncDataHolderRef<T>;
    getDataSynchronously<T>(ref: ShareableSyncDataHolderRef<T>): T;
    scheduleOnUI<T>(shareable: ShareableRef<T>): void;
    registerSensor(sensorType: number, interval: number, iosReferenceFrame: number, handler: ShareableRef<(data: Value3D | ValueRotation) => void>): number;
    unregisterSensor(sensorId: number): void;
    registerEventHandler<T>(eventHash: string, eventHandler: ShareableRef<T>): number;
    unregisterEventHandler(id: number): void;
    getViewProp<T>(viewTag: string, propName: string, callback?: (result: T) => void): Promise<T>;
    configureLayoutAnimation(viewTag: number, type: LayoutAnimationType, sharedTransitionTag: string, config: ShareableRef<Keyframe | LayoutAnimationFunction>): void;
    enableLayoutAnimations(flag: boolean): void;
    configureProps(uiProps: string[], nativeProps: string[]): void;
    subscribeForKeyboardEvents(handler: ShareableRef<number>, isStatusBarTranslucent: boolean): number;
    unsubscribeFromKeyboardEvents(listenerId: number): void;
}
