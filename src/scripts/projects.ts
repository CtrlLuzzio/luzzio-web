function initProjectsReadme() {
  const wrappers = document.querySelectorAll<HTMLElement>(".readme-wrapper");
  if (!wrappers.length) return;

  wrappers.forEach((wrapper) => {
    const parent = wrapper.parentElement;
    if (!parent) return;

    const btn = parent.querySelector<HTMLButtonElement>(".readme-toggle-btn");
    const fade = wrapper.querySelector<HTMLElement>(".readme-fade");
    const btnText = btn?.querySelector<HTMLElement>(".readme-toggle-text");
    const btnIcon = btn?.querySelector<SVGElement>(".readme-toggle-icon");

    if (!btn || !fade || !btnText || !btnIcon) return;

    const isOverflowing = wrapper.scrollHeight > wrapper.clientHeight + 8;

    if (isOverflowing) {
      btn.classList.remove("hidden");
      btn.classList.add("inline-flex");
      fade.classList.remove("hidden");

      btn.addEventListener("click", () => {
        const isExpanded = btn.getAttribute("aria-expanded") === "true";
        const nextState = !isExpanded;

        btn.setAttribute("aria-expanded", String(nextState));
        wrapper.classList.toggle("max-h-56", !nextState);
        fade.classList.toggle("hidden", nextState);
        btnIcon.classList.toggle("rotate-180", nextState);
        btnText.textContent = nextState ? "Show less" : "Read more";
      });
    }
  });
}

document.addEventListener("astro:page-load", initProjectsReadme);