import type { ShareableRef, ShareableSyncDataHolderRef, Value3D, ValueRotation } from '../commonTypes';
import { SensorType } from '../commonTypes';
import type { WebSensor } from './WebSensor';
export default class JSReanimated {
    native: boolean;
    nextSensorId: number;
    sensors: Map<number, WebSensor>;
    platform?: Platform;
    makeShareableClone<T>(): ShareableRef<T>;
    installCoreFunctions(_callGuard: <T extends Array<unknown>, U>(fn: (...args: T) => U, ...args: T) => void, _valueUnpacker: <T>(value: T) => T): void;
    scheduleOnUI<T>(worklet: ShareableRef<T>): void;
    registerEventHandler<T>(_eventHash: string, _eventHandler: ShareableRef<T>): number;
    unregisterEventHandler(_: number): void;
    enableLayoutAnimations(): void;
    configureLayoutAnimation(): void;
    registerSensor(sensorType: SensorType, interval: number, _iosReferenceFrame: number, eventHandler: ShareableRef<(data: Value3D | ValueRotation) => void>): number;
    unregisterSensor(id: number): void;
    subscribeForKeyboardEvents(_: ShareableRef<number>): number;
    unsubscribeFromKeyboardEvents(_: number): void;
    initializeSensor(sensorType: SensorType, interval: number): WebSensor;
    getSensorName(sensorType: SensorType): string;
    detectPlatform(): void;
    makeSynchronizedDataHolder<T>(_valueRef: ShareableRef<T>): ShareableSyncDataHolderRef<T>;
    getDataSynchronously<T>(_ref: ShareableSyncDataHolderRef<T>): T;
    getViewProp<T>(_viewTag: string, _propName: string, _callback?: (result: T) => void): Promise<T>;
    configureProps(): void;
}
declare enum Platform {
    WEB_IOS = "web iOS",
    WEB_ANDROID = "web Android",
    WEB = "web",
    UNKNOWN = "unknown"
}
declare global {
    interface Navigator {
        userAgent?: string;
        vendor?: string;
    }
}
export {};
