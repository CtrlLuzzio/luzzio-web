const buttons = document.querySelectorAll("[data-switcher]");
const contents = document.querySelectorAll("[data-persona]");

if (buttons.length) {
  const colorMap = {
    dev: "bg-mocha-green",
    fgc: "bg-mocha-red",
    creator: "bg-mocha-blue",
  };

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-switcher");
      if (!target) return;

      const activeColor = colorMap[target as keyof typeof colorMap];

      buttons.forEach((b) => {
        b.classList.remove(
          "bg-mocha-green",
          "bg-mocha-red",
          "bg-mocha-blue",
          "text-mocha-crust",
          "font-bold"
        );
        b.classList.add(
          "bg-transparent",
          "text-mocha-subtext-0",
          "border-transparent",
          "hover:border-mocha-overlay-0"
        );
      });

      btn.classList.remove(
        "bg-transparent",
        "text-mocha-subtext-0",
        "border-transparent",
        "hover:border-mocha-overlay-0"
      );
      btn.classList.add(
        activeColor,
        "text-mocha-crust",
        "font-bold",
        "border-transparent"
      );

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