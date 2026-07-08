export function formatDistanceKm(value, digits = 2) {
  if (!Number.isFinite(value)) return "-";
  return `${Number(value).toFixed(digits)} km`;
}

export function formatMeters(value) {
  if (!Number.isFinite(value)) return "-";
  return `${Math.round(value)} m`;
}

export function formatPercent(value) {
  if (!Number.isFinite(value)) return "-";
  return `${value.toFixed(1)}%`;
}

export function sourceTypeLabel(sourceType) {
  const labels = {
    official: "官方 GPX",
    manual_rebuild: "手動重建",
    user_contributed: "使用者提供",
    unknown: "未知"
  };
  return labels[sourceType] ?? "未知";
}

export function sanitizeFileName(name) {
  return name
    .replace(/[\\/:*?"<>|]+/g, "-")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

