"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = _interopRequireWildcard(require("react"));
var _native = require("@react-navigation/native");
var _MaterialBottomTabView = _interopRequireDefault(require("../views/MaterialBottomTabView"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
/**
 * A material-design themed tab bar on the bottom of the screen that lets you switch between different routes with animation. Routes are lazily initialized - their screen components are not mounted until they are first focused.
 *
 * This is a convenient wrapper which provides prebuilt [React Navigation's Bottom Tabs Navigator](https://reactnavigation.org/docs/bottom-tab-navigator/) integration so users can easily import it and use and don’t want to deal with setting up a custom tab bar.
 * :::info
 * To use `createMaterialBottomTabNavigator` ensure that you have installed [`@react-navigation/native` and its dependencies (follow this guide)](https://reactnavigation.org/docs/getting-started),
 * :::
 *
 *  <div class="screenshots">
 *   <img class="medium" src="screenshots/material-bottom-tabs.gif" />
 *  </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { createMaterialBottomTabNavigator } from 'react-native-paper/react-navigation';
 *
 * const Tab = createMaterialBottomTabNavigator();
 *
 * function MyTabs() {
 *   return (
 *     <Tab.Navigator>
 *       <Tab.Screen name="Home" component={HomeScreen} />
 *       <Tab.Screen name="Settings" component={SettingsScreen} />
 *     </Tab.Navigator>
 *   );
 * }
 * export default MyTabs;
 *
 * ```
 */
function MaterialBottomTabNavigator(_ref) {
  let {
    id,
    initialRouteName,
    backBehavior,
    children,
    screenListeners,
    screenOptions,
    ...rest
  } = _ref;
  const {
    state,
    descriptors,
    navigation,
    NavigationContent
  } = (0, _native.useNavigationBuilder)(_native.TabRouter, {
    id,
    initialRouteName,
    backBehavior,
    children,
    screenListeners,
    screenOptions
  });
  return /*#__PURE__*/React.createElement(NavigationContent, null, /*#__PURE__*/React.createElement(_MaterialBottomTabView.default, _extends({}, rest, {
    state: state,
    navigation: navigation,
    descriptors: descriptors
  })));
}
MaterialBottomTabNavigator.displayName = 'createMaterialBottomTabNavigator';
var _default = (0, _native.createNavigatorFactory)(MaterialBottomTabNavigator);
exports.default = _default;
//# sourceMappingURL=createMaterialBottomTabNavigator.js.map