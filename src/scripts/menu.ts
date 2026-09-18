const menuToggle = document.getElementById("menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");
const menuBackdrop = document.getElementById("menu-backdrop");
const iconOpen = document.getElementById("menu-icon-open");
const iconClose = document.getElementById("menu-icon-close");

function toggleMenu() {
  const isExpanded = menuToggle?.getAttribute("aria-expanded") === "true";
  menuToggle?.setAttribute("aria-expanded", String(!isExpanded));

  mobileMenu?.classList.toggle("translate-x-full");
  mobileMenu?.classList.toggle("translate-x-0");
  mobileMenu?.classList.toggle("shadow-none");
  mobileMenu?.classList.toggle("shadow-2xl");

  menuBackdrop?.classList.toggle("opacity-0");
  menuBackdrop?.classList.toggle("pointer-events-none");
  menuBackdrop?.classList.toggle("opacity-100");
  menuBackdrop?.classList.toggle("pointer-events-auto");

  iconOpen?.classList.toggle("hidden");
  iconOpen?.classList.toggle("block");
  iconClose?.classList.toggle("hidden");
  iconClose?.classList.toggle("block");

  document.body.classList.toggle("overflow-hidden");
}

if (menuToggle && mobileMenu && menuBackdrop && iconOpen && iconClose) {
  menuToggle.addEventListener("click", toggleMenu);
  menuBackdrop.addEventListener("click", toggleMenu);
}