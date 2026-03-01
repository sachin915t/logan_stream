// utils/prepareSliderData.js

export function prepareSliderData(items, mode = "random") {
  // ✅ Filter - ghatiya content hata do
  const filtered = items.filter((item) => {
    const rating = item.vote_average || 0;
    const votes = item.vote_count || 0;
    const hasPoster = !!item.backdrop_path;

    return (
      rating >= 7.0 &&      // rating 7+ ho
      votes >= 500 &&        // enough votes ho fake rating na ho
      hasPoster              // backdrop image ho
    );
  });

  // ✅ Sort by rating descending
  const sorted = filtered.sort((a, b) => b.vote_average - a.vote_average);

  // ✅ Top 10 lo
  const top = sorted.slice(0, 5);

  // ✅ Random shuffle
  if (mode === "random") {
    return top.sort(() => Math.random() - 0.5);
  }

  return top;
}