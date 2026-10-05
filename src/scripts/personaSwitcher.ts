const buttons = document.querySelectorAll("[data-switcher]");
const contents = document.querySelectorAll("[data-persona]");

if (buttons.length) {
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-switcher");
      if (!target) return;

      buttons.forEach((b) => {
        const btnColor = b.getAttribute("data-color");
        const btnHover = b.getAttribute("data-hover-color");

        if (!btnColor || !btnHover) return;

        if (b === btn) {
          b.classList.remove(
            "bg-transparent",
            "text-catp-subtext-0",
            "border-catp-overlay-0",
            "hover:text-catp-text",
            btnHover
          );
          b.classList.add(
            btnColor,
            "text-catp-crust",
            "font-bold",
            "border-transparent"
          );
        } else {
          b.classList.remove(
            btnColor,
            "text-catp-crust",
            "font-bold",
            "border-transparent"
          );
          b.classList.add(
            "bg-transparent",
            "text-catp-subtext-0",
            "border-catp-overlay-0",
            "hover:text-catp-text",
            btnHover
          );
        }
      });

      contents.forEach((content) => {
        if (content.getAttribute("data-persona") === target) {
          content.classList.remove("hidden");
          content.classList.add("block", "animate-fade-in");
        } else {
          content.classList.add("hidden");
          content.classList.remove("block", "animate-fade-in");
        }
      });
    });
  });
}