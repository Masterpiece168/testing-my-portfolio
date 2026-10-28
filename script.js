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

// --- PROJECT FILTERING LOGIC ---

// 1. Array of Project Data
const projects = [
    {
        title: "Subnet Calculator Tool",
        description: "Calculates network ranges, broadcast addresses, and usable IPs for IPv4 CIDR notation.",
        category: "Networking"
    },
    {
        title: "Arduino Calculator",
        description: "Built an interactive calculator using an Arduino microcontroller, matrix keypad, and LCD display.",
        category: "C++"
    },
    {
        title: "C++ Sorting Visualizer",
        description: "Implemented array manipulations and sorting algorithms to visualize how data ordering works.",
        category: "C++"
    },
    {
        title: "Personal Portfolio Website",
        description: "Multi-page responsive developer portfolio hosted on Vercel with dark mode and search features.",
        category: "Web"
    }
];

// Select DOM elements
const projectsContainer = document.getElementById('projects-container');
const searchInput = document.getElementById('search-input');
const filterBtns = document.querySelectorAll('.filter-btn');

// Only run on projects page where #projects-container exists
if (projectsContainer) {
    let currentCategory = 'all';
    let currentSearch = '';

    // Function to display projects on the page
    function renderProjects() {
        projectsContainer.innerHTML = ''; // Clear existing cards

        const filtered = projects.filter(project => {
            const matchesCategory = currentCategory === 'all' || project.category === currentCategory;
            const matchesSearch = project.title.toLowerCase().includes(currentSearch) || 
                                  project.description.toLowerCase().includes(currentSearch);
            return matchesCategory && matchesSearch;
        });

        if (filtered.length === 0) {
            projectsContainer.innerHTML = '<p style="color: #888;">No projects found matching your criteria.</p>';
            return;
        }

        filtered.forEach(project => {
            const card = document.createElement('section');
            card.className = 'project-item';
            card.innerHTML = `
                <h2>${project.title}</h2>
                <p>${project.description}</p>
                <div class="tags">
                    <span class="tag-badge">${project.category}</span>
                </div>
            `;
            projectsContainer.appendChild(card);
        });
    }

    // Event Listener: Search Bar Input
    searchInput.addEventListener('input', (e) => {
        currentSearch = e.target.value.toLowerCase();
        renderProjects();
    });

    // Event Listener: Category Filter Buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button highlight
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update current category and re-render
            currentCategory = btn.dataset.category;
            renderProjects();
        });
    });

    // Initial render when page loads
    renderProjects();
}

// --- CONTACT FORM VALIDATION & SUBMISSION ---
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Stop instant browser reload

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        // 1. Client-side Validation
        if (!name || !email || !message) {
            formStatus.className = 'form-status error';
            formStatus.textContent = 'Please fill out all fields.';
            return;
        }

        // Basic Email Regex Check
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            formStatus.className = 'form-status error';
            formStatus.textContent = 'Please enter a valid email address.';
            return;
        }

        // 2. Submit Data via Fetch API
        formStatus.className = 'form-status';
        formStatus.textContent = 'Sending message...';

        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: new FormData(contactForm),
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                formStatus.className = 'form-status success';
                formStatus.textContent = 'Thank you! Your message has been sent.';
                contactForm.reset();
            } else {
                formStatus.className = 'form-status error';
                formStatus.textContent = 'Oops! There was a problem submitting your form.';
            }
        } catch (error) {
            formStatus.className = 'form-status error';
            formStatus.textContent = 'Connection error. Please try again later.';
        }
    });
}

// --- MOBILE HAMBURGER MENU TOGGLE ---
const hamburgerBtn = document.getElementById('hamburger-btn');
const navLinks = document.getElementById('nav-links');

if (hamburgerBtn && navLinks) {
    hamburgerBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

// --- LIVE GITHUB REST API INTEGRATION ---
const githubUsername = 'Masterpiece168';
const githubStatsContainer = document.getElementById('github-stats');
const githubReposContainer = document.getElementById('github-repos');

if (githubStatsContainer && githubReposContainer) {
    async function fetchGitHubData() {
        try {
            // 1. Fetch Profile Info
            const profileResponse = await fetch(`https://api.github.com/users/${githubUsername}`);
            if (!profileResponse.ok) throw new Error('Failed to fetch profile');
            const profileData = await profileResponse.json();

            // Render Stats
            githubStatsContainer.innerHTML = `
                <div class="stat-box">
                    <span class="stat-number">${profileData.public_repos}</span>
                    <span class="stat-label">Public Repos</span>
                </div>
                <div class="stat-box">
                    <span class="stat-number">${profileData.followers}</span>
                    <span class="stat-label">Followers</span>
                </div>
                <div class="stat-box">
                    <span class="stat-number">${profileData.following}</span>
                    <span class="stat-label">Following</span>
                </div>
            `;

            // 2. Fetch Latest Public Repos (sorted by recently updated)
            const reposResponse = await fetch(`https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=3`);
            if (!reposResponse.ok) throw new Error('Failed to fetch repos');
            const reposData = await reposResponse.json();

            githubReposContainer.innerHTML = ''; // Clear loading text

            reposData.forEach(repo => {
                const repoCard = document.createElement('a');
                repoCard.className = 'repo-card';
                repoCard.href = repo.html_url;
                repoCard.target = '_blank'; // Open link in new tab
                repoCard.innerHTML = `
                    <div class="repo-header">
                        <span class="repo-title">📦 ${repo.name}</span>
                        <span class="repo-stars">⭐ ${repo.stargazers_count}</span>
                    </div>
                    <p class="repo-desc">${repo.description || 'No description provided.'}</p>
                `;
                githubReposContainer.appendChild(repoCard);
            });

        } catch (error) {
            console.error('GitHub API Error:', error);
            githubStatsContainer.innerHTML = '<p class="loading-text">Unable to load GitHub stats.</p>';
            githubReposContainer.innerHTML = '<p class="loading-text">Unable to load repositories.</p>';
        }
    }

    fetchGitHubData();
}