# runstrategy

這是一個給跑者使用的靜態前端工具，包含 VDOT 配速、熱環境換算、訓練課表、GPX 坡度換算，以及 GPX 開源賽事庫。

## 安裝

```bash
npm install
```

目前專案不需要後端、不需要資料庫，也不需要任何私密 API key。

## 本地啟動

```bash
npm run dev
```

預設網址：

```text
http://localhost:5173/
```

## Build

```bash
npm run build
```

Build 會輸出到 `dist/`，內容可部署到 GitHub Pages、Vercel Static 或 Netlify Static。

## GitHub Pages 部署

1. 執行 `npm run build`。
2. 將 `dist/` 作為靜態網站輸出。
3. 確認 `dist/Gpx/` 中存在 GPX 檔案。
4. GitHub Pages 若使用 Actions，可將 `dist/` 上傳為 Pages artifact。

## 如何新增一筆 GPX

1. 把 GPX 檔放到 `Gpx/`。
2. 在 `src/gpx-catalog/catalog.mjs` 加入 metadata。
3. `gpxUrl` 使用 `/Gpx/your-file-name.gpx`。
4. 重新執行 `npm run build`。

## Metadata 欄位

`GpxCatalogItem` 欄位：

- `id`: 唯一識別碼。
- `raceName`: 賽事名稱。
- `eventMonth`: 賽事月份，1 到 12。
- `eventYear`: 賽事年份，未知可填 `null`。
- `distanceCategory`: `3K`、`5K`、`10K`、`HALF_MARATHON`、`MARATHON`、`OTHER`。
- `distanceLabel`: 顯示用組別，例如 `10K`、`半馬`、`12.5K`。
- `officialDistanceKm`: 官方距離，未知可填 `null`。
- `location`: 地點，未知可填 `null`。
- `city`: 城市，未知可填 `null`。
- `sourceType`: `official`、`manual_rebuild`、`user_contributed`、`unknown`。
- `sourceNote`: 來源說明。
- `gpxUrl`: GPX 靜態路徑，例如 `/Gpx/2026萬金石馬拉松-10k組.gpx`。
- `description`: 賽事或路線描述。
- `tags`: 搜尋用標籤。
- `createdAt`: 建立日期。
- `updatedAt`: 更新日期。

## GPX 開源賽事庫

此賽事庫的目標是收錄可供跑者參考的路跑賽道 GPX。資料可能來自官方公告、人工重建或使用者提供。由於路跑賽事常涉及封路、高架、折返點與臨時動線，本工具不保證 GPX 與官方丈量結果完全一致。

使用前請確認官方公告、比賽當日路線與實際交通管制。

## 目前限制

- 只支援靜態收錄。
- 不支援使用者投稿。
- 不保證官方丈量距離。
- 沒有 elevation 的 GPX 無法做坡度分析。
- GPS elevation 未平滑，可能造成爬升下降誤差。
- 地圖使用 Leaflet 與 OpenStreetMap；若 CDN 或網路不可用，頁面會保留 SVG 路線預覽。

## 未來規劃

- 支援使用者上傳 GPX 投稿。
- 投稿前自動檢查距離與格式。
- 管理員審核 GPX。
- 加入官方連結欄位。
- 加入賽事日期。
- 加入 GPX 版本紀錄。
- 串接 elevation API 或 DEM。
- 加入坡度等強配速換算。
- 加入熱濕度配速修正。
- 支援依城市、賽事類型、爬升量篩選。
