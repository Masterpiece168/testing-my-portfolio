// 1. Select the button
const themeToggleBtn = document.getElementById('theme-toggle');

// 2. Check if user previously saved a preferred theme in localStorage
const currentTheme = localStorage.getItem('theme');

// If dark mode was saved before, apply it immediately when page loads
if (currentTheme === 'dark') {
    document.body.classList.add('dark-mode');
    themeToggleBtn.textContent = '☀️ Light';
}

// 3. Listen for clicks on the theme button
themeToggleBtn.addEventListener('click', () => {
    // Toggle the dark-mode class on body
    document.body.classList.toggle('dark-mode');

    // Check whether body currently has dark-mode active
    let theme = 'light';
    if (document.body.classList.contains('dark-mode')) {
        theme = 'dark';
        themeToggleBtn.textContent = '☀️ Light';
    } else {
        themeToggleBtn.textContent = '🌙 Dark';
    }

    // Save choice to browser memory so it persists across pages
    localStorage.setItem('theme', theme);
});