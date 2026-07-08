export const DistanceCategory = Object.freeze({
  THREE_K: "3K",
  FIVE_K: "5K",
  TEN_K: "10K",
  HALF_MARATHON: "HALF_MARATHON",
  MARATHON: "MARATHON",
  OTHER: "OTHER"
});

export const SourceType = Object.freeze({
  OFFICIAL: "official",
  MANUAL_REBUILD: "manual_rebuild",
  USER_CONTRIBUTED: "user_contributed",
  UNKNOWN: "unknown"
});

export const gpxCatalog = [
  {
    id: "2025-taipei-marathon-half",
    raceName: "台北馬拉松",
    eventMonth: 12,
    eventYear: 2025,
    distanceCategory: DistanceCategory.HALF_MARATHON,
    distanceLabel: "半馬組",
    officialDistanceKm: 21.0975,
    location: "台北馬拉松半馬路線",
    city: "台北市",
    sourceType: SourceType.MANUAL_REBUILD,
    sourceNote: "依專案內 GPX 檔收錄，使用前請再次確認官方路線。",
    gpxUrl: "/Gpx/2025台北馬拉松-半馬組.gpx",
    description: "2025 台北馬拉松半馬組 GPX。",
    tags: ["台北", "台北馬拉松", "半馬"],
    createdAt: "2026-07-07",
    updatedAt: "2026-07-07"
  },
  {
    id: "2026-tainan-historic-half",
    raceName: "台南古都半程馬拉松",
    eventMonth: 3,
    eventYear: 2026,
    distanceCategory: DistanceCategory.HALF_MARATHON,
    distanceLabel: "半馬組",
    officialDistanceKm: 21.0975,
    location: "台南古都半程馬拉松路線",
    city: "台南市",
    sourceType: SourceType.MANUAL_REBUILD,
    sourceNote: "依專案內 GPX 檔收錄，使用前請再次確認官方路線。",
    gpxUrl: "/Gpx/2026_台南古都半程馬拉松-半馬組.gpx",
    description: "2026 台南古都半程馬拉松半馬組 GPX。",
    tags: ["台南", "古都", "半馬"],
    createdAt: "2026-07-07",
    updatedAt: "2026-07-07"
  },
  {
    id: "2026-standard-chartered-half",
    raceName: "渣打馬拉松",
    eventMonth: 1,
    eventYear: 2026,
    distanceCategory: DistanceCategory.HALF_MARATHON,
    distanceLabel: "半馬組",
    officialDistanceKm: 21.0975,
    location: "渣打馬拉松半馬路線",
    city: "台北市",
    sourceType: SourceType.MANUAL_REBUILD,
    sourceNote: "依專案內 GPX 檔收錄，使用前請再次確認官方路線。",
    gpxUrl: "/Gpx/2026渣打馬拉松-半馬組.gpx",
    description: "2026 渣打馬拉松半馬組 GPX。",
    tags: ["台北", "渣打", "半馬"],
    createdAt: "2026-07-07",
    updatedAt: "2026-07-07"
  },
  {
    id: "2026-wanjinshi-10k",
    raceName: "萬金石馬拉松",
    eventMonth: 3,
    eventYear: 2026,
    distanceCategory: DistanceCategory.TEN_K,
    distanceLabel: "10K組",
    officialDistanceKm: 10,
    location: "萬金石馬拉松 10K 路線",
    city: "新北市",
    sourceType: SourceType.MANUAL_REBUILD,
    sourceNote: "依專案內 GPX 檔收錄，使用前請再次確認官方路線。",
    gpxUrl: "/Gpx/2026萬金石馬拉松-10k組.gpx",
    description: "2026 萬金石馬拉松 10K 組 GPX。",
    tags: ["新北", "萬金石", "10K"],
    createdAt: "2026-07-07",
    updatedAt: "2026-07-07"
  }
];
