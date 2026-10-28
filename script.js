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

// --- IPV4 SUBNET CALCULATOR LOGIC ---
const calcBtn = document.getElementById('calc-btn');
const ipInput = document.getElementById('ip-input');

if (calcBtn && ipInput) {
    // Convert 32-bit integer to IP string
    function intToIp(int) {
        return [
            (int >>> 24) & 255,
            (int >>> 16) & 255,
            (int >>> 8) & 255,
            int & 255
        ].join('.');
    }

    // Convert IP string to 32-bit integer
    function ipToInt(ip) {
        return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0;
    }

    function calculateSubnet() {
        const inputVal = ipInput.value.trim();
        const parts = inputVal.split('/');

        // Basic CIDR notation validation
        if (parts.length !== 2) {
            alert('Please enter a valid CIDR notation format, e.g., 192.168.1.100/24');
            return;
        }

        const ipStr = parts[0];
        const cidr = parseInt(parts[1], 10);

        const ipRegex = /^^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$$/;
        if (!ipRegex.test(ipStr) || isNaN(cidr) || cidr < 0 || cidr > 32) {
            alert('Invalid IP address or CIDR prefix (must be between /0 and /32).');
            return;
        }

        // Bitwise Subnet Logic
        const ipInt = ipToInt(ipStr);
        const maskInt = cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0;
        const networkInt = (ipInt & maskInt) >>> 0;
        const broadcastInt = (networkInt | (~maskInt >>> 0)) >>> 0;

        const totalHosts = cidr >= 31 ? 0 : Math.pow(2, 32 - cidr) - 2;
        const firstHostInt = cidr >= 31 ? networkInt : networkInt + 1;
        const lastHostInt = cidr >= 31 ? broadcastInt : broadcastInt - 1;

        // Render Results
        document.getElementById('res-network').textContent = `${intToIp(networkInt)} /${cidr}`;
        document.getElementById('res-mask').textContent = intToIp(maskInt);
        document.getElementById('res-broadcast').textContent = intToIp(broadcastInt);
        document.getElementById('res-range').textContent = cidr >= 31 
            ? 'N/A (Point-to-Point)' 
            : `${intToIp(firstHostInt)} - ${intToIp(lastHostInt)}`;
        document.getElementById('res-hosts').textContent = totalHosts.toLocaleString();
    }

    calcBtn.addEventListener('click', calculateSubnet);
    
    // Calculate default example on load
    calculateSubnet();
}

// --- KNOWLEDGE QUIZ WIDGET LOGIC ---
const quizQuestions = [
    {
        question: "Which OSI layer is responsible for IP addressing and routing?",
        options: ["Data Link (Layer 2)", "Network (Layer 3)", "Transport (Layer 4)", "Application (Layer 7)"],
        answer: 1
    },
    {
        question: "What is the default subnet mask for a Class C IPv4 network?",
        options: ["255.0.0.0", "255.255.0.0", "255.255.255.0", "255.255.255.255"],
        answer: 2
    },
    {
        question: "Which port does SSH (Secure Shell) use by default?",
        options: ["Port 21", "Port 22", "Port 80", "Port 443"],
        answer: 1
    },
    {
        question: "What does the command 'git commit' do?",
        options: ["Pushes code to GitHub", "Downloads remote code", "Saves a snapshot of changes locally", "Deletes a branch"],
        answer: 2
    },
    {
        question: "In standard CIDR notation, how many usable hosts are in a /24 network?",
        options: ["254", "256", "128", "512"],
        answer: 0
    }
];

const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const questionCountText = document.getElementById('question-count');
const scoreCountText = document.getElementById('score-count');
const nextBtn = document.getElementById('next-btn');
const quizContainer = document.getElementById('quiz-container');
const resultScreen = document.getElementById('result-screen');
const finalScoreText = document.getElementById('final-score-text');
const restartBtn = document.getElementById('restart-btn');

if (questionText && optionsContainer) {
    let currentIdx = 0;
    let score = 0;

    function loadQuestion() {
        const q = quizQuestions[currentIdx];
        questionText.textContent = q.question;
        questionCountText.textContent = `Question ${currentIdx + 1} of ${quizQuestions.length}`;
        scoreCountText.textContent = `Score: ${score}`;
        optionsContainer.innerHTML = '';
        nextBtn.style.display = 'none';

        q.options.forEach((optText, i) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.textContent = `${i + 1}. ${optText}`;
            btn.addEventListener('click', () => selectOption(i, q.answer));
            optionsContainer.appendChild(btn);
        });
    }

    function selectOption(selectedIdx, correctIdx) {
        const buttons = optionsContainer.querySelectorAll('.option-btn');
        buttons.forEach((btn, i) => {
            btn.disabled = true; // Lock buttons after choice
            if (i === correctIdx) btn.classList.add('correct');
            if (i === selectedIdx && selectedIdx !== correctIdx) btn.classList.add('incorrect');
        });

        if (selectedIdx === correctIdx) score++;

        scoreCountText.textContent = `Score: ${score}`;
        nextBtn.style.display = 'block';
    }

    nextBtn.addEventListener('click', () => {
        currentIdx++;
        if (currentIdx < quizQuestions.length) {
            loadQuestion();
        } else {
            showResults();
        }
    });

    function showResults() {
        quizContainer.style.display = 'none';
        resultScreen.style.display = 'block';
        finalScoreText.textContent = `You scored ${score} out of ${quizQuestions.length}!`;
    }

    restartBtn.addEventListener('click', () => {
        currentIdx = 0;
        score = 0;
        resultScreen.style.display = 'none';
        quizContainer.style.display = 'block';
        loadQuestion();
    });

    loadQuestion();
}