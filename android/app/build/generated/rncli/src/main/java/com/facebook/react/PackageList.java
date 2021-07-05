
package com.facebook.react;

import android.app.Application;
import android.content.Context;
import android.content.res.Resources;

import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainPackageConfig;
import com.facebook.react.shell.MainReactPackage;
import java.util.Arrays;
import java.util.ArrayList;

// @payhere/payhere-mobilesdk-reactnative
import lk.payhere.PayhereOfficialPackage;
// @react-native-community/async-storage
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
// @react-native-community/geolocation
import com.reactnativecommunity.geolocation.GeolocationPackage;
// @react-native-community/picker
import com.reactnativecommunity.picker.RNCPickerPackage;
// @sentry/react-native
import io.sentry.react.RNSentryPackage;
// @terrylinla/react-native-sketch-canvas
import com.terrylinla.rnsketchcanvas.SketchCanvasPackage;
// react-native-camera
import org.reactnative.camera.RNCameraPackage;
// react-native-fast-image
import com.dylanvann.fastimage.FastImageViewPackage;
// react-native-gesture-handler
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
// react-native-image-picker
import com.imagepicker.ImagePickerPackage;
// react-native-linear-gradient
import com.BV.LinearGradient.LinearGradientPackage;
// react-native-localize
import com.zoontek.rnlocalize.RNLocalizePackage;
// react-native-permissions
import com.zoontek.rnpermissions.RNPermissionsPackage;
// react-native-prompt-android
import im.shimo.react.prompt.RNPromptPackage;
// react-native-reanimated
import com.swmansion.reanimated.ReanimatedPackage;
// react-native-safe-area-context
import com.th3rdwave.safeareacontext.SafeAreaContextPackage;
// react-native-screens
import com.swmansion.rnscreens.RNScreensPackage;
// react-native-spinkit
import com.react.rnspinkit.RNSpinkitPackage;
// react-native-svg
import com.horcrux.svg.SvgPackage;
// react-native-vector-icons
import com.oblador.vectoricons.VectorIconsPackage;
// react-native-webview
import com.reactnativecommunity.webview.RNCWebViewPackage;
// react-native-youtube
import com.inprogress.reactnativeyoutube.ReactNativeYouTube;

public class PackageList {
  private Application application;
  private ReactNativeHost reactNativeHost;
  private MainPackageConfig mConfig;

  public PackageList(ReactNativeHost reactNativeHost) {
    this(reactNativeHost, null);
  }

  public PackageList(Application application) {
    this(application, null);
  }

  public PackageList(ReactNativeHost reactNativeHost, MainPackageConfig config) {
    this.reactNativeHost = reactNativeHost;
    mConfig = config;
  }

  public PackageList(Application application, MainPackageConfig config) {
    this.reactNativeHost = null;
    this.application = application;
    mConfig = config;
  }

  private ReactNativeHost getReactNativeHost() {
    return this.reactNativeHost;
  }

  private Resources getResources() {
    return this.getApplication().getResources();
  }

  private Application getApplication() {
    if (this.reactNativeHost == null) return this.application;
    return this.reactNativeHost.getApplication();
  }

  private Context getApplicationContext() {
    return this.getApplication().getApplicationContext();
  }

  public ArrayList<ReactPackage> getPackages() {
    return new ArrayList<>(Arrays.<ReactPackage>asList(
      new MainReactPackage(mConfig),
      new PayhereOfficialPackage(),
      new AsyncStoragePackage(),
      new GeolocationPackage(),
      new RNCPickerPackage(),
      new RNSentryPackage(),
      new SketchCanvasPackage(),
      new RNCameraPackage(),
      new FastImageViewPackage(),
      new RNGestureHandlerPackage(),
      new ImagePickerPackage(),
      new LinearGradientPackage(),
      new RNLocalizePackage(),
      new RNPermissionsPackage(),
      new RNPromptPackage(),
      new ReanimatedPackage(),
      new SafeAreaContextPackage(),
      new RNScreensPackage(),
      new RNSpinkitPackage(),
      new SvgPackage(),
      new VectorIconsPackage(),
      new RNCWebViewPackage(),
      new ReactNativeYouTube()
    ));
  }
}
