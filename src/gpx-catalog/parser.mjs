const EARTH_RADIUS_METERS = 6371008.8;

function toRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

function distanceMeters(a, b) {
  const lat1 = toRadians(a.lat);
  const lat2 = toRadians(b.lat);
  const deltaLat = toRadians(b.lat - a.lat);
  const deltaLng = toRadians(b.lng - a.lng);
  const sinLat = Math.sin(deltaLat / 2);
  const sinLng = Math.sin(deltaLng / 2);
  const h =
    sinLat * sinLat +
    Math.cos(lat1) * Math.cos(lat2) * sinLng * sinLng;
  return 2 * EARTH_RADIUS_METERS * Math.asin(Math.min(1, Math.sqrt(h)));
}

export function parseGpxText(gpxText) {
  const xml = new DOMParser().parseFromString(gpxText, "application/xml");
  if (xml.querySelector("parsererror")) {
    throw new Error("GPX XML 解析失敗，請確認檔案格式。");
  }

  const name = xml.querySelector("metadata > name, trk > name")?.textContent?.trim() || null;
  const nodes = [...xml.querySelectorAll("trkpt")];
  let cumulativeMeters = 0;
  let totalAscentM = 0;
  let totalDescentM = 0;
  let hasElevation = false;

  const points = nodes
    .map((node, index) => {
      const lat = Number(node.getAttribute("lat"));
      const lng = Number(node.getAttribute("lon"));
      const eleText = node.querySelector("ele")?.textContent?.trim();
      const ele = eleText == null || eleText === "" ? null : Number(eleText);
      return { lat, lng, ele: Number.isFinite(ele) ? ele : null, index, distanceFromStartKm: 0 };
    })
    .filter((point) => Number.isFinite(point.lat) && Number.isFinite(point.lng));

  points.forEach((point, index) => {
    if (index > 0) {
      const previous = points[index - 1];
      cumulativeMeters += distanceMeters(previous, point);
      if (previous.ele != null && point.ele != null) {
        hasElevation = true;
        const diff = point.ele - previous.ele;
        if (diff > 0) totalAscentM += diff;
        if (diff < 0) totalDescentM += Math.abs(diff);
      }
    }
    point.distanceFromStartKm = cumulativeMeters / 1000;
  });

  return {
    name,
    points,
    distanceKm: cumulativeMeters / 1000,
    hasElevation,
    totalAscentM: hasElevation ? totalAscentM : null,
    totalDescentM: hasElevation ? totalDescentM : null
  };
}

