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