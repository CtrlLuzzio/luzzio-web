const themeToggleBtn = document.getElementById('theme-toggle');
const iconSun = document.getElementById('icon-sun');
const iconMoon = document.getElementById('icon-moon');

function updateIcons(isLatte: boolean) {
  if (iconSun && iconMoon) {
    if (isLatte) {
      iconSun.classList.add('hidden');
      iconMoon.classList.remove('hidden');
    } else {
      iconMoon.classList.add('hidden');
      iconSun.classList.remove('hidden');
    }
  }
}

if (themeToggleBtn) {
  updateIcons(document.documentElement.classList.contains('theme-latte'));

  themeToggleBtn.addEventListener('click', () => {
    const isLatte = document.documentElement.classList.toggle('theme-latte');
    
    localStorage.setItem('theme', isLatte ? 'latte' : 'mocha');
    updateIcons(isLatte);
  });
}