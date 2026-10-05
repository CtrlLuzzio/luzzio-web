import { actions } from "astro:actions";

async function checkTwitchStatus() {
  const badgeContainers = document.querySelectorAll(".twitch-status-badge");
  const statusDots = document.querySelectorAll(".twitch-status-dot");
  const statusTexts = document.querySelectorAll(".twitch-status-text");

  if (!badgeContainers.length) return;

  try {
    const { data, error } = await actions.twitch.getTwitchStatus();
    
    if (!error && data?.isLive) {
      badgeContainers.forEach((badge) => {
        badge.classList.replace("bg-catp-crust", "bg-catp-red/10");
        badge.classList.replace("border-catp-surface-0", "border-catp-red/50");
      });
      statusDots.forEach((dot) => {
        dot.classList.replace("bg-catp-text", "bg-catp-red");
        dot.classList.remove("opacity-50");
        dot.classList.add("animate-pulse");
      });
      statusTexts.forEach((text) => {
        text.classList.replace("text-catp-text", "text-catp-red");
        text.textContent = "Live";
      });
    }
  } catch (e) {
    console.error("Unable to get twitch status");
  }
}

checkTwitchStatus();