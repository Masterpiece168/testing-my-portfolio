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

// --- PORT & PROTOCOL LOOKUP LOGIC ---
const networkPorts = [
    { port: 20, service: "FTP Data", transport: "TCP", description: "File Transfer Protocol for transferring data channels." },
    { port: 21, service: "FTP Control", transport: "TCP", description: "File Transfer Protocol for command control and authentication." },
    { port: 22, service: "SSH / SFTP", transport: "TCP", description: "Secure Shell for encrypted remote terminal sessions and file transfers." },
    { port: 23, service: "Telnet", transport: "TCP", description: "Unencrypted text communications (legacy, non-secure)." },
    { port: 25, service: "SMTP", transport: "TCP", description: "Simple Mail Transfer Protocol used for sending email between servers." },
    { port: 53, service: "DNS", transport: "TCP/UDP", description: "Domain Name System translates domain names into IP addresses." },
    { port: 67, service: "DHCP Server", transport: "UDP", description: "Dynamic Host Configuration Protocol server listener." },
    { port: 68, service: "DHCP Client", transport: "UDP", description: "Dynamic Host Configuration Protocol client request port." },
    { port: 80, service: "HTTP", transport: "TCP", description: "Hypertext Transfer Protocol for unencrypted web traffic." },
    { port: 110, service: "POP3", transport: "TCP", description: "Post Office Protocol version 3 for retrieving email." },
    { port: 123, service: "NTP", transport: "UDP", description: "Network Time Protocol synchronizes clocks across system network nodes." },
    { port: 143, service: "IMAP", transport: "TCP", description: "Internet Message Access Protocol for managing and retrieving email." },
    { port: 161, service: "SNMP", transport: "UDP", description: "Simple Network Management Protocol for monitoring network devices." },
    { port: 443, service: "HTTPS", transport: "TCP", description: "Hypertext Transfer Protocol Secure encrypted via TLS/SSL." },
    { port: 3389, service: "RDP", transport: "TCP/UDP", description: "Remote Desktop Protocol for Windows graphical desktop connections." }
];

const portsListContainer = document.getElementById('ports-list');
const portSearchInput = document.getElementById('port-search');
const portFilterBtns = document.querySelectorAll('.port-filter-btn');

if (portsListContainer && portSearchInput) {
    let selectedType = 'all';
    let searchQuery = '';

    function renderPorts() {
        portsListContainer.innerHTML = '';

        const filtered = networkPorts.filter(item => {
            const matchesType = selectedType === 'all' || item.transport === selectedType;
            const matchesQuery = item.port.toString().includes(searchQuery) ||
                                 item.service.toLowerCase().includes(searchQuery) ||
                                 item.description.toLowerCase().includes(searchQuery);
            return matchesType && matchesQuery;
        });

        if (filtered.length === 0) {
            portsListContainer.innerHTML = '<p style="color: #888; text-align: center; margin-top: 10px;">No matching ports found.</p>';
            return;
        }

        filtered.forEach(item => {
            const card = document.createElement('div');
            card.className = 'port-card';
            card.innerHTML = `
                <div class="port-info">
                    <h2>${item.service}</h2>
                    <p>${item.description}</p>
                </div>
                <div class="port-badge-group">
                    <span class="port-number">Port ${item.port}</span>
                    <span class="transport-badge">${item.transport}</span>
                </div>
            `;
            portsListContainer.appendChild(card);
        });
    }

    // Event listener for search input
    portSearchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase().trim();
        renderPorts();
    });

    // Event listeners for transport filter buttons (TCP, UDP, All)
    portFilterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            portFilterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedType = btn.dataset.type;
            renderPorts();
        });
    });

    // Initial render when loading page
    renderPorts();
}

// --- HTTP STATUS CODE EXPLORER LOGIC ---
const httpStatusCodes = [
    { code: 200, name: "OK", category: "2xx", description: "Standard successful HTTP request. The resource has been fetched and transmitted." },
    { code: 201, name: "Created", category: "2xx", description: "Request fulfilled and a new resource was created as a result." },
    { code: 204, name: "No Content", category: "2xx", description: "Server successfully processed the request, but is not returning any content." },
    { code: 301, name: "Moved Permanently", category: "3xx", description: "Target resource has been assigned a new permanent URI." },
    { code: 302, name: "Found (Temporary Redirect)", category: "3xx", description: "Target resource resides temporarily under a different URI." },
    { code: 304, name: "Not Modified", category: "3xx", description: "Indicates that the resource has not been modified since the last request (uses cache)." },
    { code: 400, name: "Bad Request", category: "4xx", description: "Server cannot process the request due to client syntax error or invalid framing." },
    { code: 401, name: "Unauthorized", category: "4xx", description: "Authentication is required and has failed or has not yet been provided." },
    { code: 403, name: "Forbidden", category: "4xx", description: "Client does not have access rights to the content, even if authenticated." },
    { code: 404, name: "Not Found", category: "4xx", description: "Server cannot find the requested resource or URL." },
    { code: 429, name: "Too Many Requests", category: "4xx", description: "The user has sent too many requests in a given amount of time (rate limiting)." },
    { code: 500, name: "Internal Server Error", category: "5xx", description: "Server encountered an unexpected condition that prevented it from fulfilling request." },
    { code: 502, name: "Bad Gateway", category: "5xx", description: "Server acting as a gateway/proxy received an invalid response from upstream server." },
    { code: 503, name: "Service Unavailable", category: "5xx", description: "Server is not ready to handle the request (down for maintenance or overloaded)." },
    { code: 504, name: "Gateway Timeout", category: "5xx", description: "Server acting as a gateway did not receive a timely response from upstream server." }
];

const httpListContainer = document.getElementById('http-list');
const httpSearchInput = document.getElementById('http-search');
const httpFilterBtns = document.querySelectorAll('.http-filter-btn');

if (httpListContainer && httpSearchInput) {
    let currentCategory = 'all';
    let searchQuery = '';

    function renderHttpCodes() {
        httpListContainer.innerHTML = '';

        const filtered = httpStatusCodes.filter(item => {
            const matchesCat = currentCategory === 'all' || item.category === currentCategory;
            const matchesQuery = item.code.toString().includes(searchQuery) ||
                                 item.name.toLowerCase().includes(searchQuery) ||
                                 item.description.toLowerCase().includes(searchQuery);
            return matchesCat && matchesQuery;
        });

        if (filtered.length === 0) {
            httpListContainer.innerHTML = '<p style="color: #888; text-align: center; margin-top: 10px;">No matching HTTP status codes found.</p>';
            return;
        }

        filtered.forEach(item => {
            const card = document.createElement('div');
            card.className = 'port-card';
            card.innerHTML = `
                <div class="port-info">
                    <h2>${item.code} ${item.name}</h2>
                    <p>${item.description}</p>
                </div>
                <div class="port-badge-group">
                    <span class="code-badge badge-${item.category}">${item.category}</span>
                </div>
            `;
            httpListContainer.appendChild(card);
        });
    }

    // Search event
    httpSearchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase().trim();
        renderHttpCodes();
    });

    // Category filter events
    httpFilterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            httpFilterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.dataset.category;
            renderHttpCodes();
        });
    });

    // Initial render
    renderHttpCodes();
}