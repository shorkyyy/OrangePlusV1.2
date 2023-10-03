import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import type { Context, NativeEvent, WorkletFunction } from '../commonTypes';
import type { DependencyList } from './commonTypes';
export interface ScrollHandler<TContext extends Context> extends WorkletFunction {
    (event: NativeScrollEvent, context?: TContext): void;
}
export interface ScrollEvent extends NativeScrollEvent, NativeEvent<ScrollEvent> {
    eventName: string;
}
export interface ScrollHandlers<TContext extends Context> {
    [key: string]: ScrollHandler<TContext> | undefined;
    onScroll?: ScrollHandler<TContext>;
    onBeginDrag?: ScrollHandler<TContext>;
    onEndDrag?: ScrollHandler<TContext>;
    onMomentumBegin?: ScrollHandler<TContext>;
    onMomentumEnd?: ScrollHandler<TContext>;
}
type OnScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
export type useAnimatedScrollHandler = <TContext extends Context = Record<string, never>>(handlers: ScrollHandlers<TContext> | ScrollHandler<TContext>, deps?: DependencyList) => OnScroll;
export declare const useAnimatedScrollHandler: useAnimatedScrollHandler;
export {};
