const menuToggle = document.getElementById("menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");
const menuBackdrop = document.getElementById("menu-backdrop");
const iconOpen = document.getElementById("menu-icon-open");
const iconClose = document.getElementById("menu-icon-close");

function setMenuState(isOpen: boolean) {
  if (!menuToggle || !mobileMenu || !menuBackdrop || !iconOpen || !iconClose) return;

  menuToggle.setAttribute("aria-expanded", String(isOpen));

  mobileMenu.classList.toggle("translate-x-full", !isOpen);
  mobileMenu.classList.toggle("translate-x-0", isOpen);
  mobileMenu.classList.toggle("shadow-none", !isOpen);
  mobileMenu.classList.toggle("shadow-2xl", isOpen);

  menuBackdrop.classList.toggle("opacity-0", !isOpen);
  menuBackdrop.classList.toggle("pointer-events-none", !isOpen);
  menuBackdrop.classList.toggle("opacity-100", isOpen);
  menuBackdrop.classList.toggle("pointer-events-auto", isOpen);

  iconOpen.classList.toggle("block", !isOpen);
  iconOpen.classList.toggle("hidden", isOpen);
  iconClose.classList.toggle("hidden", !isOpen);
  iconClose.classList.toggle("block", isOpen);

  document.body.classList.toggle("overflow-hidden", isOpen);
}

if (menuToggle && mobileMenu && menuBackdrop) {
  menuToggle.addEventListener("click", () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    setMenuState(!isExpanded);
  });

  menuBackdrop.addEventListener("click", () => setMenuState(false));

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
      setMenuState(false);
    }
  });

  window.matchMedia("(min-width: 1024px)").addEventListener("change", (e) => {
    if (e.matches) setMenuState(false);
  });
}