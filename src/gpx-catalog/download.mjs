import { sanitizeFileName } from "./format.mjs";

export async function downloadGpxFile(item) {
  const response = await fetch(item.gpxUrl);
  if (!response.ok) {
    throw new Error(`無法讀取 GPX：${item.gpxUrl}`);
  }
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  const title = `${item.eventYear ?? "年份待補"}-${item.raceName}-${item.distanceLabel}`;
  link.download = `${sanitizeFileName(title)}.gpx`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
