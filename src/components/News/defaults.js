/**
 * Returns news items with optional limit and featured (Pink October) first.
 * Use on non-news pages so the block shows featured first (e.g. on mobile).
 */
export function getNewsItemsForBlock(items, { limit = 3, featuredFirst = false } = {}) {
  const list = items || [];
  if (!featuredFirst) return list.slice(0, limit);
  const pink = list.find((it) => it.slug === "pink-october");
  const rest = list.filter((it) => it.slug !== "pink-october");
  return (pink ? [pink, ...rest] : list).slice(0, limit);
}

/**
 * News component default props. Shared by all pages that use News.
 */
export const NewsDefaults = {
  title: "News",
  items: [
    { slug: "pink-october", image: { src: "/images/news-page.png", alt: "Pink October at El-Rapha" }, title: "Pink October\nat El-Rapha", content: "Norem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, " },
    { slug: "lorem-ipsum-dolor", image: { src: "/images/news1.png", alt: "news-image" }, title: "Lorem ipsum dolor", content: "Norem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, " },
    { slug: "lorem-ipsum-dolorr", image: { src: "/images/news2.png", alt: "news-image" }, title: "Lorem ipsum dolorr", content: "Norem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, " },
    { slug: "lorem-ipsum-dolorrr", image: { src: "/images/news3.png", alt: "news-image" }, title: "Lorem ipsum dolorrr", content: "Norem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, " },
  ],
};
