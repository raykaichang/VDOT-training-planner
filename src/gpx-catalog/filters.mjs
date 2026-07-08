export function filterCatalogItems(items, filters) {
  const normalize = (value) =>
    String(value ?? "")
      .normalize("NFKC")
      .toLocaleLowerCase("zh-Hant");
  const keyword = normalize(filters.keyword).trim();
  return items.filter((item) => {
    const monthMatches =
      filters.month === "all" || Number(filters.month) === item.eventMonth;
    const distanceMatches =
      !filters.distanceCategory ||
      filters.distanceCategory === "all" ||
      filters.distanceCategory === item.distanceCategory;
    const haystack = [
      item.eventYear,
      item.raceName,
      item.location,
      item.city,
      item.distanceLabel,
      item.description,
      item.sourceNote,
      ...item.tags
    ]
      .filter(Boolean)
      .join(" ")
      .normalize("NFKC")
      .toLocaleLowerCase("zh-Hant");
    return monthMatches && distanceMatches && (!keyword || haystack.includes(keyword));
  });
}

export function sortCatalogItems(items, sortBy) {
  const sorted = [...items];
  const distanceOf = (item) => item.officialDistanceKm ?? Number.POSITIVE_INFINITY;

  if (sortBy === "month-desc") {
    sorted.sort((a, b) => b.eventMonth - a.eventMonth || a.raceName.localeCompare(b.raceName));
  } else if (sortBy === "distance-asc") {
    sorted.sort((a, b) => distanceOf(a) - distanceOf(b));
  } else if (sortBy === "distance-desc") {
    sorted.sort((a, b) => distanceOf(b) - distanceOf(a));
  } else if (sortBy === "name-asc") {
    sorted.sort((a, b) => `${a.raceName}-${a.distanceLabel}`.localeCompare(`${b.raceName}-${b.distanceLabel}`, "zh-Hant"));
  } else {
    sorted.sort((a, b) => a.eventMonth - b.eventMonth || a.raceName.localeCompare(b.raceName));
  }

  return sorted;
}
