const track = document.getElementById("blog-track");
const prevBtn = document.getElementById("blog-prev");
const nextBtn = document.getElementById("blog-next");

if (track && prevBtn && nextBtn) {
  const updateArrows = () => {
    const isAtStart = track.scrollLeft <= 0;
    const isAtEnd = Math.ceil(track.scrollLeft + track.clientWidth) >= track.scrollWidth - 1;

    if (isAtStart) {
      prevBtn.classList.add("opacity-30", "pointer-events-none");
      prevBtn.classList.remove("hover:border-mocha-overlay-0");
    } else {
      prevBtn.classList.remove("opacity-30", "pointer-events-none");
      prevBtn.classList.add("hover:border-mocha-overlay-0");
    }

    if (isAtEnd) {
      nextBtn.classList.add("opacity-30", "pointer-events-none");
      nextBtn.classList.remove("hover:border-mocha-overlay-0");
    } else {
      nextBtn.classList.remove("opacity-30", "pointer-events-none");
      nextBtn.classList.add("hover:border-mocha-overlay-0");
    }
  };

  const scrollByItem = (direction: "prev" | "next") => {
    const firstVisibleItem = track.querySelector("a:not(.hidden)");
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
  
  track.addEventListener("scroll", updateArrows);
  window.addEventListener("resize", updateArrows);

  setTimeout(updateArrows, 100);
}