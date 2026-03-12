const themeToggle = document.getElementById('themeToggle');

function updateButtonText() {
    if (document.documentElement.dataset.theme === 'dark') {
        themeToggle.textContent = 'Light';
    } else {
        themeToggle.textContent = 'Dark';
    }
}

themeToggle.addEventListener('click', function() {
    if (document.documentElement.dataset.theme === 'dark') {
        document.documentElement.dataset.theme = 'light';
    } else {
        document.documentElement.dataset.theme = 'dark';
    }
    updateButtonText();
});

updateButtonText();