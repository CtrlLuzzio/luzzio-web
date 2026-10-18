const track = document.getElementById("blog-track");
const prevBtn = document.getElementById("blog-prev");
const nextBtn = document.getElementById("blog-next");

if (track && prevBtn && nextBtn) {
  const updateArrows = () => {
    const isAtStart = track.scrollLeft <= 0;
    const isAtEnd = Math.ceil(track.scrollLeft + track.clientWidth) >= track.scrollWidth - 1;

    prevBtn.classList.toggle("opacity-30", isAtStart);
    prevBtn.classList.toggle("pointer-events-none", isAtStart);
    prevBtn.classList.toggle("hover:border-catp-overlay-0", !isAtStart);

    nextBtn.classList.toggle("opacity-30", isAtEnd);
    nextBtn.classList.toggle("pointer-events-none", isAtEnd);
    nextBtn.classList.toggle("hover:border-catp-overlay-0", !isAtEnd);
  };

  const scrollByItem = (direction: "prev" | "next") => {
    const firstVisibleItem = track.querySelector<HTMLElement>("a:not(.hidden)");
    if (!firstVisibleItem) return;

    const itemWidth = firstVisibleItem.getBoundingClientRect().width;
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    const scrollAmount = itemWidth + gap;

    track.scrollBy({
      left: direction === "next" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });
  };

  prevBtn.addEventListener("click", () => scrollByItem("prev"));
  nextBtn.addEventListener("click", () => scrollByItem("next"));
  track.addEventListener("scroll", updateArrows, { passive: true });
  window.addEventListener("resize", updateArrows, { passive: true });

  updateArrows();
}