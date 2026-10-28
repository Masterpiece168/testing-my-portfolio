// Select the theme button element
const themeToggleBtn = document.getElementById('theme-toggle');

// Listen for a click on the button
themeToggleBtn.addEventListener('click', () => {
    // Toggle the 'dark-mode' class on the body tag
    document.body.classList.toggle('dark-mode');

    // Update the button text depending on current theme
    if (document.body.classList.contains('dark-mode')) {
        themeToggleBtn.textContent = '☀️ Light';
    } else {
        themeToggleBtn.textContent = '🌙 Dark';
    }
});