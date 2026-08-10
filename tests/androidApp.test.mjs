import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [appSource, zhEntry, enEntry, androidCss, gradleBuild, manifest, activity] = await Promise.all([
  readFile("web/app.mjs", "utf8"),
  readFile("android/app/src/main/web/index.html", "utf8"),
  readFile("android/app/src/main/web/en/index.html", "utf8"),
  readFile("android/app/src/main/web/android/android.css", "utf8"),
  readFile("android/app/build.gradle.kts", "utf8"),
  readFile("android/app/src/main/AndroidManifest.xml", "utf8"),
  readFile("android/app/src/main/java/tw/runstrategy/app/MainActivity.java", "utf8")
]);

for (const entry of [zhEntry, enEntry]) {
  assert.match(entry, /window\.__RUNSTRATEGY_ANDROID__\s*=\s*true/);
  assert.doesNotMatch(entry, /leaflet|\.gpx/i);
  assert.doesNotMatch(entry, /fonts\.googleapis\.com/);
}

assert.match(appSource, /if \(!isAndroidApp\) \{\s*items\.push\(\{\s*value: "gpx"/s);
assert.match(
  appSource,
  /state\.toolMode === "gpxCatalog" \|\| \(isAndroidApp && state\.toolMode === "gpx"\)/
);
assert.match(appSource, /\.\/en\/index\.html/);
assert.match(appSource, /\.\.\/index\.html/);
assert.match(appSource, /enableAutoWeather: "使用目前位置天氣"/);
assert.match(appSource, /\$\{renderAutoWeatherControl\(t\)\}/);
assert.match(appSource, /class="plan-day-label"/);
assert.match(appSource, /shouldResetAndroidScroll/);
assert.match(appSource, /function renderAndroidApp\(model, t\)/);
assert.match(appSource, /function playAndroidLaunchAnimation\(\)/);
assert.match(appSource, /hasPlayedAndroidLaunchAnimation/);
assert.match(appSource, /playAndroidLaunchAnimation\(\);/);
assert.match(appSource, /function renderAndroidEquivalentPage\(model, t\)/);
assert.match(appSource, /function renderAndroidPlanPage\(model, t\)/);
assert.match(appSource, /TrainingMethod\.HANSONS/);
assert.match(appSource, /HANSONS_PLAN_LENGTHS/);
assert.match(appSource, /hansonsTargetRaceOptions/);
assert.match(appSource, /Hansons 漢森/);
assert.doesNotMatch(appSource, /Couch Potato to 10K/);
assert.match(appSource, /class="android-workspace android-direct-layout"/);
assert.match(appSource, /class="android-control-card"/);
assert.match(appSource, /class="android-best-result"/);
const androidAppRenderer = appSource.slice(
  appSource.indexOf("function renderAndroidApp"),
  appSource.indexOf("function renderAndroidBottomNav")
);
assert.doesNotMatch(androidAppRenderer, /renderAndroidSettingsSheet/);
assert.match(appSource, /data-plan-grid/);
assert.match(appSource, /class="android-drag-handle"/);
assert.match(appSource, /swapPlanWithTarget\(target, clientX, clientY\)/);
assert.match(appSource, /isAndroidApp[\s\S]*clientY - targetRect\.top/);
assert.match(appSource, /abilityMode: isAndroidApp \? "race" : "vdot"/);
assert.match(appSource, /converterType: isAndroidApp \? "race" : "pace"/);
assert.match(appSource, /renderAndroidWeatherControl\(t\)/);

assert.match(androidCss, /@font-face/);
assert.match(androidCss, /NotoSansTC-VF\.ttf/);
assert.match(androidCss, /position:\s*fixed;[\s\S]*grid-template-columns:\s*repeat\(3,/);
assert.match(androidCss, /\.environment-input-grid\s*\{[\s\S]*grid-template-columns:\s*repeat\(2,/);
assert.match(androidCss, /--android-app-bar-height:\s*72px/);
assert.match(androidCss, /\.android-workspace\s*\{/);
assert.match(androidCss, /\.android-bottom-nav\s*\{/);
assert.match(androidCss, /\.android-workspace\.android-app-enter/);
assert.match(androidCss, /@keyframes android-app-launch-fade/);
assert.match(androidCss, /\.android-plan-day\.is-dragging\s*\{/);
assert.match(androidCss, /v1\.4: direct controls return to each page/);
assert.match(androidCss, /\.android-direct-layout \.android-page-head h1\s*\{/);

assert.match(gradleBuild, /include\("web\/\*\*"\)/);
assert.match(gradleBuild, /include\("src\/\*\*"\)/);
assert.match(gradleBuild, /versionName = "1\.4\.0"/);
assert.doesNotMatch(gradleBuild, /include\("Gpx\/\*\*"\)/);
assert.doesNotMatch(gradleBuild, /race-gpx-builder/);

assert.match(manifest, /android\.permission\.INTERNET/);
assert.match(manifest, /android\.permission\.ACCESS_COARSE_LOCATION/);
assert.match(manifest, /android:usesCleartextTraffic="false"/);
assert.match(activity, /https:\/\/" \+ APP_HOST \+ "\/assets\//);
assert.match(activity, /setAllowFileAccess\(false\)/);
assert.match(activity, /onGeolocationPermissionsShowPrompt/);
assert.match(activity, /setOnApplyWindowInsetsListener/);
assert.match(activity, /getSystemWindowInsetTop\(\)/);
assert.match(activity, /params\.setMargins\(left, top, right, bottom\)/);

console.log("Android packaging checks passed.");
