# runstrategy Android

這個專案把既有網站內建到 Android WebView，保留：

- VDOT 配速與比賽成績換算
- 熱環境配速／成績換算
- 每週訓練課表與課表互動
- 自動定位天氣、手動溫濕度
- 中文／英文、明亮／深色主題
- 與網頁版一致的 Noto Sans TC、深藍黑／灰白／青綠品牌視覺
- 手機固定底部導覽與垂直週間課表

Android 版不顯示 GPX 功能，也不會把根目錄的 `Gpx/` 路線檔或 `race-gpx-builder/` 打包進 APK。一般網站版仍保留原本的 GPX 功能。

## 用 Android Studio 測試

1. 安裝最新版穩定版 Android Studio。
2. 第一次開啟時，在 SDK Manager 安裝 Android SDK Platform 36；Gradle JDK 選 Android Studio 內建的 JDK 17。
3. 在 Android Studio 選 `Open`，開啟本資料夾，也就是 `VDOT/android`，不要開到整個 `VDOT` 根目錄。
4. 等待 Gradle Sync 完成。首次同步會下載 Gradle 與 Android Gradle Plugin。
5. 在 Device Manager 建立 API 35 或 API 36 的手機模擬器，或接上已開啟「USB 偵錯」的 Android 實機。
6. 上方執行目標選 `app`，按 Run。

每次建置前，Gradle 都會把根目錄最新的 `web/` 與 `src/` 同步進 APK，所以修改網站計算或畫面後不用手動複製檔案。

## 用命令列測試

先安裝 Android Studio／Android SDK，並讓專案有正確的 `local.properties`。Android Studio 完成一次 Gradle Sync 後通常會自動建立。

在 Windows PowerShell 執行：

```powershell
cd C:\project\VDOT\android
.\gradlew.bat assembleDebug
```

Debug APK 會產生在：

```text
C:\project\VDOT\android\app\build\outputs\apk\debug\app-debug.apk
```

若 `adb` 已經在 PATH，可安裝到目前連線的裝置：

```powershell
adb install -r C:\project\VDOT\android\app\build\outputs\apk\debug\app-debug.apk
```

## 建議驗收項目

1. 底部只有「算我的配速」、「熱天怎麼跑」、「這週怎麼練」，沒有 GPX。
2. 修改 VDOT 或輸入比賽成績後，配速結果即時更新。
3. 熱天換算的溫度與濕度可以調整。
4. 三個功能的「環境條件」中都有「使用目前位置天氣」；點擊後會出現 Android 定位權限，允許後能取得目前天氣。
5. 訓練課表可切換目標賽事、週期，並能拖曳或更換課表。
6. 中英文與明暗主題可正常切換。
7. 參考資料和意見回饋連結會交給手機瀏覽器開啟。

若模擬器無法取得定位，在模擬器右側 `...` → `Location` 先送出一組座標，再回 App 重新整理天氣。
