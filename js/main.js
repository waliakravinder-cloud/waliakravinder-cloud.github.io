(function () {
    var navToggle = document.querySelector('.nav-toggle');
    var menu = document.getElementById('primary-menu');
    var themeToggle = document.querySelector('[data-theme-toggle]');
    var storageKey = 'smart-civic-theme';

    function setTheme(themeName) {
        document.body.classList.toggle('theme-night', themeName === 'night');
        if (themeToggle) {
            themeToggle.textContent = themeName === 'night' ? 'Switch to Day View' : 'Switch to Night View';
        }
        try {
            localStorage.setItem(storageKey, themeName);
        } catch (error) {
            console.warn('Theme preference could not be saved.', error);
        }
    }

    if (navToggle && menu) {
        navToggle.addEventListener('click', function () {
            var isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', String(!isExpanded));
            menu.classList.toggle('is-open', !isExpanded);
            document.body.classList.toggle('menu-open', !isExpanded);
        });
    }

    var savedTheme = null;
    try {
        savedTheme = localStorage.getItem(storageKey);
    } catch (error) {
        console.warn('Theme preference could not be read.', error);
    }

    setTheme(savedTheme || 'day');

    if (themeToggle) {
        themeToggle.addEventListener('click', function () {
            var nextTheme = document.body.classList.contains('theme-night') ? 'day' : 'night';
            setTheme(nextTheme);
        });
    }
}());