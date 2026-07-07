export function parseGpxTrackPoints(gpxText) {
  const xml = new DOMParser().parseFromString(gpxText, "application/xml");
  const parserError = xml.querySelector("parsererror");
  if (parserError) throw new Error("Invalid GPX XML.");

  const nodes = [...xml.querySelectorAll("trkpt")];
  const points = nodes
    .map((node) => {
      const lat = Number(node.getAttribute("lat"));
      const lon = Number(node.getAttribute("lon"));
      const elevationNode = node.querySelector("ele");
      const elevation = elevationNode ? Number(elevationNode.textContent) : NaN;
      const timeNode = node.querySelector("time");
      return {
        lat,
        lon,
        elevation,
        time: timeNode?.textContent?.trim() ?? null
      };
    })
    .filter(
      (point) =>
        Number.isFinite(point.lat) &&
        Number.isFinite(point.lon) &&
        Number.isFinite(point.elevation)
    );

  if (points.length < 2) throw new Error("GPX needs at least two points with elevation.");
  return points;
}
