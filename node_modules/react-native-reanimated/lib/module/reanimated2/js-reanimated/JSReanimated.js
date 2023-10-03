function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
import { isChromeDebugger, isJest, isWeb } from '../PlatformChecker';
import { SensorType } from '../commonTypes';
export default class JSReanimated {
  constructor() {
    _defineProperty(this, "native", false);
    _defineProperty(this, "nextSensorId", 0);
    _defineProperty(this, "sensors", new Map());
    _defineProperty(this, "platform", undefined);
  }
  makeShareableClone() {
    throw new Error('[Reanimated] makeShareableClone should never be called in JSReanimated.');
  }
  installCoreFunctions(_callGuard, _valueUnpacker) {
    // noop
  }
  scheduleOnUI(worklet) {
    // @ts-ignore web implementation has still not been updated after the rewrite, this will be addressed once the web implementation updates are ready
    requestAnimationFrame(worklet);
  }
  registerEventHandler(_eventHash, _eventHandler) {
    // noop
    return -1;
  }
  unregisterEventHandler(_) {
    // noop
  }
  enableLayoutAnimations() {
    if (isWeb()) {
      console.warn('[Reanimated] Layout Animations are not supported on web yet.');
    } else if (isChromeDebugger()) {
      console.warn('[Reanimated] Layout Animations are no-ops when using Chrome Debugger.');
    } else if (isJest()) {
      console.warn('[Reanimated] Layout Animations are no-ops when using Jest.');
    } else {
      console.warn('[Reanimated] Layout Animations are not supported on this configuration.');
    }
  }
  configureLayoutAnimation() {
    // no-op
  }
  registerSensor(sensorType, interval, _iosReferenceFrame, eventHandler) {
    if (this.platform === undefined) {
      this.detectPlatform();
    }
    if (!(this.getSensorName(sensorType) in window)) {
      // https://w3c.github.io/sensors/#secure-context
      console.warn('[Reanimated] Sensor is not available.' + (isWeb() && location.protocol !== 'https:' ? ' Make sure you use secure origin with `npx expo start --web --https`.' : '') + (this.platform === Platform.WEB_IOS ? ' For iOS web, you will also have to also grant permission in the browser: https://dev.to/li/how-to-requestpermission-for-devicemotion-and-deviceorientation-events-in-ios-13-46g2.' : ''));
      return -1;
    }
    if (this.platform === undefined) {
      this.detectPlatform();
    }
    const sensor = this.initializeSensor(sensorType, interval);
    let callback;
    if (sensorType === SensorType.ROTATION) {
      callback = () => {
        let [qw, qx, qy, qz] = sensor.quaternion;

        // Android sensors have a different coordinate system than iOS
        if (this.platform === Platform.WEB_ANDROID) {
          [qy, qz] = [qz, -qy];
        }

        // reference: https://stackoverflow.com/questions/5782658/extracting-yaw-from-a-quaternion
        const yaw = Math.atan2(2.0 * (qy * qz + qw * qx), qw * qw - qx * qx - qy * qy + qz * qz);
        const pitch = Math.sin(-2.0 * (qx * qz - qw * qy));
        const roll = Math.atan2(2.0 * (qx * qy + qw * qz), qw * qw + qx * qx - qy * qy - qz * qz);
        // TODO TYPESCRIPT on web ShareableRef is the value itself so we call it directly
        eventHandler({
          qw,
          qx,
          qy,
          qz,
          yaw,
          pitch,
          roll,
          interfaceOrientation: 0
        });
      };
    } else {
      callback = () => {
        let {
          x,
          y,
          z
        } = sensor;
        [x, y, z] = this.platform === Platform.WEB_ANDROID ? [-x, -y, -z] : [x, y, z];
        // TODO TYPESCRIPT on web ShareableRef is the value itself so we call it directly
        eventHandler({
          x,
          y,
          z,
          interfaceOrientation: 0
        });
      };
    }
    sensor.addEventListener('reading', callback);
    sensor.start();
    this.sensors.set(this.nextSensorId, sensor);
    return this.nextSensorId++;
  }
  unregisterSensor(id) {
    const sensor = this.sensors.get(id);
    if (sensor !== undefined) {
      sensor.stop();
      this.sensors.delete(id);
    }
  }
  subscribeForKeyboardEvents(_) {
    if (isWeb()) {
      console.warn('[Reanimated] useAnimatedKeyboard is not available on web yet.');
    } else if (isChromeDebugger()) {
      console.warn('[Reanimated] useAnimatedKeyboard is not available when using Chrome Debugger.');
    } else if (isJest()) {
      console.warn('[Reanimated] useAnimatedKeyboard is not available when using Jest.');
    } else {
      console.warn('[Reanimated] useAnimatedKeyboard is not available on this configuration.');
    }
    return -1;
  }
  unsubscribeFromKeyboardEvents(_) {
    // noop
  }
  initializeSensor(sensorType, interval) {
    const config = interval <= 0 ? {
      referenceFrame: 'device'
    } : {
      frequency: 1000 / interval
    };
    switch (sensorType) {
      case SensorType.ACCELEROMETER:
        return new window.Accelerometer(config);
      case SensorType.GYROSCOPE:
        return new window.Gyroscope(config);
      case SensorType.GRAVITY:
        return new window.GravitySensor(config);
      case SensorType.MAGNETIC_FIELD:
        return new window.Magnetometer(config);
      case SensorType.ROTATION:
        return new window.AbsoluteOrientationSensor(config);
    }
  }
  getSensorName(sensorType) {
    switch (sensorType) {
      case SensorType.ACCELEROMETER:
        return 'Accelerometer';
      case SensorType.GRAVITY:
        return 'GravitySensor';
      case SensorType.GYROSCOPE:
        return 'Gyroscope';
      case SensorType.MAGNETIC_FIELD:
        return 'Magnetometer';
      case SensorType.ROTATION:
        return 'AbsoluteOrientationSensor';
    }
  }
  detectPlatform() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if (userAgent === undefined) {
      this.platform = Platform.UNKNOWN;
    } else if (/iPad|iPhone|iPod/.test(userAgent)) {
      this.platform = Platform.WEB_IOS;
    } else if (/android/i.test(userAgent)) {
      this.platform = Platform.WEB_ANDROID;
    } else {
      this.platform = Platform.WEB;
    }
  }
  makeSynchronizedDataHolder(_valueRef) {
    throw new Error('[Reanimated] makeSynchronizedDataHolder is not available in JSReanimated.');
  }
  getDataSynchronously(_ref) {
    throw new Error('[Reanimated] getDataSynchronously is not available in JSReanimated.');
  }
  getViewProp(_viewTag, _propName, _callback) {
    throw new Error('[Reanimated] getViewProp is not available in JSReanimated.');
  }
  configureProps() {
    throw new Error('[Reanimated] configureProps is not available in JSReanimated.');
  }
}
var Platform = /*#__PURE__*/function (Platform) {
  Platform["WEB_IOS"] = "web iOS";
  Platform["WEB_ANDROID"] = "web Android";
  Platform["WEB"] = "web";
  Platform["UNKNOWN"] = "unknown";
  return Platform;
}(Platform || {});
//# sourceMappingURL=JSReanimated.js.map