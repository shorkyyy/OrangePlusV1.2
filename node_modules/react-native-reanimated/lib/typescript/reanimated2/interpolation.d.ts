export declare enum Extrapolation {
    IDENTITY = "identity",
    CLAMP = "clamp",
    EXTEND = "extend"
}
export interface ExtrapolationConfig {
    extrapolateLeft?: Extrapolation | string;
    extrapolateRight?: Extrapolation | string;
}
export type ExtrapolationType = ExtrapolationConfig | Extrapolation | string | undefined;
export declare function interpolate(x: number, input: readonly number[], output: readonly number[], type?: ExtrapolationType): number;
