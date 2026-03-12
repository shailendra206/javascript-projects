const landingPage = document.getElementById('landingPage');
const profilePage = document.getElementById('profilePage');
const errorPage = document.getElementById('errorPage');

const landingSearchInput = document.getElementById('landingSearchInput');
const landingSearchBtn = document.getElementById('landingSearchBtn');
const navSearchInput = document.getElementById('navSearchInput');

const loadingOverlay = document.getElementById('loadingOverlay');

const themeToggles = document.querySelectorAll('.theme-toggle');
const devCards = document.querySelectorAll('.dev-card');

const backToSearchBtn = document.getElementById('backToSearchBtn');
const profileNavBrand = document.getElementById('profileNavBrand');
const errorNavBrand = document.getElementById('errorNavBrand');

const profileAvatar = document.getElementById('profileAvatar');
const profileName = document.getElementById('profileName');
const profileUsername = document.getElementById('profileUsername');
const profileBio = document.getElementById('profileBio');
const followBtn = document.getElementById('followBtn');
const followersCount = document.getElementById('followersCount');
const followingCount = document.getElementById('followingCount');
const reposCount = document.getElementById('reposCount');
const profileLocation = document.getElementById('profileLocation');
const profileWebsite = document.getElementById('profileWebsite');
const profileCompany = document.getElementById('profileCompany');
const profileJoined = document.getElementById('profileJoined');
const locationItem = document.getElementById('locationItem');
const websiteItem = document.getElementById('websiteItem');
const companyItem = document.getElementById('companyItem');
const joinedItem = document.getElementById('joinedItem');
const reposGrid = document.getElementById('reposGrid');

const errorDetail = document.getElementById('errorDetail');

function initTheme() {
    const savedTheme = localStorage.getItem('githubFinderTheme');
    if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
}

function toggleTheme() {
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');
    localStorage.setItem('githubFinderTheme', isDark ? 'dark' : 'light');
}

themeToggles.forEach(btn => {
    btn.addEventListener('click', toggleTheme);
});

function showPage(page) {
    landingPage.classList.remove('active');
    profilePage.classList.remove('active');
    errorPage.classList.remove('active');
    page.classList.add('active');
    window.scrollTo(0, 0);
}

function goHome() {
    landingSearchInput.value = '';
    navSearchInput.value = '';
    showPage(landingPage);
}

backToSearchBtn.addEventListener('click', goHome);
profileNavBrand.addEventListener('click', goHome);
errorNavBrand.addEventListener('click', goHome);


function showLoading() {
    loadingOverlay.classList.remove('hidden');
}

function hideLoading() {
    loadingOverlay.classList.add('hidden');
}

function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    }
    return num.toString();
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function getLanguageClass(language) {
    if (!language) return 'lang-default';
    const lang = language.toLowerCase().replace(/[^a-z]/g, '');
    const supported = ['javascript', 'typescript', 'python', 'java', 'c', 'cpp', 'csharp', 'go', 'rust', 'ruby', 'php', 'swift', 'kotlin', 'html', 'css', 'scss', 'shell', 'vue'];
    return supported.includes(lang) ? `lang-${lang}` : 'lang-default';
}


const GITHUB_API = 'https://api.github.com';

async function fetchUser(username) {
    const response = await fetch(`${GITHUB_API}/users/${username}`);
    if (!response.ok) {
        throw new Error('User not found');
    }
    return response.json();
}

async function fetchRepos(username) {
    const response = await fetch(`${GITHUB_API}/users/${username}/repos?sort=stars&per_page=6`);
    if (!response.ok) {
        throw new Error('Could not fetch repos');
    }
    return response.json();
}


function renderProfile(user) {
    profileAvatar.src = user.avatar_url;
    profileAvatar.alt = user.login;
    profileName.textContent = user.name || user.login;
    profileUsername.textContent = `@${user.login}`;
    profileBio.textContent = user.bio || 'No bio available';
    followBtn.href = user.html_url;

    followersCount.textContent = formatNumber(user.followers);
    followingCount.textContent = formatNumber(user.following);
    reposCount.textContent = formatNumber(user.public_repos);

    if (user.location) {
        profileLocation.textContent = user.location;
        locationItem.classList.remove('hidden');
    } else {
        locationItem.classList.add('hidden');
    }

    if (user.blog) {
        let website = user.blog;
        if (!website.startsWith('http')) {
            website = 'https://' + website;
        }
        profileWebsite.textContent = user.blog.replace(/^https?:\/\//, '');
        profileWebsite.href = website;
        websiteItem.classList.remove('hidden');
    } else {
        websiteItem.classList.add('hidden');
    }

    if (user.company) {
        profileCompany.textContent = user.company;
        companyItem.classList.remove('hidden');
    } else {
        companyItem.classList.add('hidden');
    }
    if (user.created_at) {
        profileJoined.textContent = `Joined ${formatDate(user.created_at)}`;
        joinedItem.classList.remove('hidden');
    } else {
        joinedItem.classList.add('hidden');
    }
}

function renderRepos(repos) {
    reposGrid.innerHTML = '';

    if (repos.length === 0) {
        reposGrid.innerHTML = '<p style="color: var(--text-secondary); font-style: italic;">No public repositories found.</p>';
        return;
    }

    repos.forEach(repo => {
        const card = document.createElement('a');
        card.href = repo.html_url;
        card.target = '_blank';
        card.className = 'repo-card';

        const languageClass = getLanguageClass(repo.language);

        card.innerHTML = `
            <div class="repo-header">
                <div class="repo-title-container">
                    <span class="material-symbols-outlined repo-icon">folder</span>
                    <h4 class="repo-name">${repo.name}</h4>
                </div>
                <span class="repo-badge">${repo.private ? 'Private' : 'Public'}</span>
            </div>
            <p class="repo-description">${repo.description || 'No description'}</p>
            <div class="repo-stats">
                ${repo.language ? `
                    <div class="repo-stat">
                        <span class="lang-dot ${languageClass}"></span>
                        ${repo.language}
                    </div>
                ` : ''}
                <div class="repo-stat">
                    <span class="material-symbols-outlined">star</span>
                    ${formatNumber(repo.stargazers_count)}
                </div>
                <div class="repo-stat">
                    <span class="material-symbols-outlined">call_split</span>
                    ${formatNumber(repo.forks_count)}
                </div>
            </div>
        `;

        reposGrid.appendChild(card);
    });
}

async function searchUser(username) {
    const cleanUsername = username.trim().replace('@', '');

    if (!cleanUsername) {
        shakeElement(landingSearchInput);
        shakeElement(navSearchInput);
        return;
    }

    showLoading();

    try {
        const user = await fetchUser(cleanUsername);
        const repos = await fetchRepos(cleanUsername);

        renderProfile(user);
        renderRepos(repos);

        hideLoading();
        showPage(profilePage);

    } catch (error) {
        hideLoading();
        errorDetail.textContent = `Searched: @${cleanUsername}`;
        showPage(errorPage);
    }
}

function shakeElement(element) {
    element.style.transition = 'transform 0.1s';
    element.style.transform = 'translateX(-5px)';
    
    setTimeout(() => {
        element.style.transform = 'translateX(5px)';
    }, 100);
    
    setTimeout(() => {
        element.style.transform = 'translateX(-3px)';
    }, 200);
    
    setTimeout(() => {
        element.style.transform = 'translateX(0)';
    }, 300);
}


landingSearchBtn.addEventListener('click', () => {
    searchUser(landingSearchInput.value);
});

landingSearchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchUser(landingSearchInput.value);
    }
});

navSearchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchUser(navSearchInput.value);
    }
});

devCards.forEach(card => {
    card.addEventListener('click', () => {
        const username = card.dataset.username;
        if (username) {
            searchUser(username);
        }
    });
});

initTheme();