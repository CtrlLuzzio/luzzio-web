const themeBtns = document.querySelectorAll('[data-theme-btn]');

function applyTheme(theme: string | null) {
  const systemPrefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
  const isLatte = theme === 'latte' || (!theme && systemPrefersLight);
  
  if (isLatte) {
    document.documentElement.classList.add('theme-latte');
  } else {
    document.documentElement.classList.remove('theme-latte');
  }
  
  updateActiveUI(theme);
}

function updateActiveUI(theme: string | null) {
  themeBtns.forEach(btn => {
    const btnTheme = btn.getAttribute('data-theme-btn');
    const isActive = 
      (theme === 'latte' && btnTheme === 'latte') || 
      (theme === 'mocha' && btnTheme === 'mocha') || 
      (!theme && btnTheme === 'system');

    if (isActive) {
      btn.classList.add('bg-catp-surface-1', 'text-catp-blue');
      btn.classList.remove('text-catp-subtext-0', 'hover:text-catp-text');
    } else {
      btn.classList.remove('bg-catp-surface-1', 'text-catp-blue');
      btn.classList.add('text-catp-subtext-0', 'hover:text-catp-text');
    }
  });
}

if (themeBtns.length > 0) {
  const savedTheme = localStorage.getItem('theme');
  updateActiveUI(savedTheme);

  themeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedTheme = btn.getAttribute('data-theme-btn');
      
      if (selectedTheme === 'system') {
        localStorage.removeItem('theme');
        applyTheme(null);
      } else {
        localStorage.setItem('theme', selectedTheme as string);
        applyTheme(selectedTheme);
      }
    });
  });

  window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', () => {
    if (!localStorage.getItem('theme')) {
      applyTheme(null);
    }
  });
}