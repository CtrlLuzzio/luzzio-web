let isDropdownGlobalInitialized = false;

export function closeAllDropdowns(except?: Element | null) {
  document.querySelectorAll<HTMLElement>("[data-dropdown]").forEach((dropdown) => {
    if (except && dropdown === except) return;
    const trigger = dropdown.querySelector<HTMLButtonElement>("[data-dropdown-trigger]");
    const menu = dropdown.querySelector<HTMLElement>("[data-dropdown-menu]");
    const chevron = dropdown.querySelector<SVGElement>("[data-dropdown-chevron]");

    trigger?.setAttribute("aria-expanded", "false");
    menu?.classList.remove("flex");
    menu?.classList.add("hidden");
    chevron?.classList.remove("rotate-180");
  });
}

export function toggleDropdown(dropdown: HTMLElement) {
  const trigger = dropdown.querySelector<HTMLButtonElement>("[data-dropdown-trigger]");
  const menu = dropdown.querySelector<HTMLElement>("[data-dropdown-menu]");
  const chevron = dropdown.querySelector<SVGElement>("[data-dropdown-chevron]");
  if (!trigger || !menu) return;

  const isExpanded = trigger.getAttribute("aria-expanded") === "true";
  closeAllDropdowns(dropdown);

  const nextState = !isExpanded;
  trigger.setAttribute("aria-expanded", String(nextState));
  menu.classList.toggle("flex", nextState);
  menu.classList.toggle("hidden", !nextState);
  chevron?.classList.toggle("rotate-180", nextState);
}

export function initDropdownGlobalListeners() {
  if (isDropdownGlobalInitialized) return;

  document.addEventListener("click", (e) => {
    const target = e.target as HTMLElement | null;
    if (!target?.closest("[data-dropdown]")) {
      closeAllDropdowns();
    }
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeAllDropdowns();
    }
  });

  isDropdownGlobalInitialized = true;
}