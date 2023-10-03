import * as React from 'react';
import { DefaultNavigatorOptions, ParamListBase, TabNavigationState, TabRouterOptions } from '@react-navigation/native';
import type { MaterialBottomTabNavigationConfig, MaterialBottomTabNavigationEventMap, MaterialBottomTabNavigationOptions } from '../types';
export declare type MaterialBottomTabNavigatorProps = DefaultNavigatorOptions<ParamListBase, TabNavigationState<ParamListBase>, MaterialBottomTabNavigationOptions, MaterialBottomTabNavigationEventMap> & TabRouterOptions & MaterialBottomTabNavigationConfig;
export declare type Props = {
    /**
     * Event which fires on tapping on the tab in the tab bar.
     */
    tabPress: {
        data: undefined;
        canPreventDefault: true;
    };
    /**
     * Event which fires on long pressing on the tab in the tab bar.
     */
    onTabLongPress: {
        data: undefined;
        canPreventDefault: true;
    };
    /**
     * Title text for the screen.
     */
    title?: string;
    /**
     * Color of the tab bar when this tab is active. Only used when `shifting` is `true`.
     */
    tabBarColor?: string;
    /**
     * Label text of the tab displayed in the navigation bar. When undefined, scene title is used.
     */
    tabBarLabel?: string;
    /**
     * String referring to an icon in the `MaterialCommunityIcons` set, or a
     * function that given { focused: boolean, color: string } returns a React.Node to display in the navigation bar.
     */
    tabBarIcon?: string | ((props: {
        focused: boolean;
        color: string;
    }) => React.ReactNode);
    /**
     * Badge to show on the tab icon, can be `true` to show a dot, `string` or `number` to show text.
     */
    tabBarBadge?: boolean | number | string;
    /**
     * Accessibility label for the tab button. This is read by the screen reader when the user taps the tab.
     */
    tabBarAccessibilityLabel?: string;
    /**
     * ID to locate this tab button in tests.
     */
    tabBarButtonTestID?: string;
} & MaterialBottomTabNavigatorProps;
declare const _default: <ParamList extends ParamListBase>() => import("@react-navigation/native").TypedNavigator<ParamList, TabNavigationState<ParamListBase>, MaterialBottomTabNavigationOptions, MaterialBottomTabNavigationEventMap, React.ComponentType<MaterialBottomTabNavigatorProps>>;
export default _default;
//# sourceMappingURL=createMaterialBottomTabNavigator.d.ts.map