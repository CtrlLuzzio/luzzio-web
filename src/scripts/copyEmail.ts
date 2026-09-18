const copyBtn = document.getElementById("copy-email-btn");
const emailText = document.getElementById("email-text")?.textContent?.trim();
const copyIcon = document.getElementById("copy-icon");
const checkIcon = document.getElementById("check-icon");

if (copyBtn && emailText && copyIcon && checkIcon) {
copyBtn.addEventListener("click", async () => {
    try {
    await navigator.clipboard.writeText(emailText);
    
    copyIcon.classList.add("hidden");
    checkIcon.classList.remove("hidden");

    setTimeout(() => {
        checkIcon.classList.add("hidden");
        copyIcon.classList.remove("hidden");
    }, 2000);
    } catch (err) {
    console.error("Failed to copy email: ", err);
    }
});
}