// app.js
window.onload = async function() {
    if (currentUser) {
        if(currentUser.theme === 'dark') document.body.classList.add('dark-mode');
        document.getElementById('top-header').classList.remove('hidden');
        document.getElementById('bottom-bar').classList.remove('hidden');
        document.querySelector('.nav-item').classList.add('active');
        navTo('home-screen');
        loadFeed();
    } else {
        navTo('auth-screen');
    }
};

function navTo(screenId, navEl=null) {
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
    document.getElementById(screenId).classList.remove('hidden');
    if(navEl) {
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        navEl.classList.add('active');
    }
    
    if(screenId === 'home-screen') loadFeed();
    if(screenId === 'reels-screen') loadReels();
    if(screenId === 'message-screen') loadUserList();
    if(screenId === 'notification-screen') loadNotifications();
    if(screenId === 'dashboard-screen') loadDashboard();
    
    closeAllDropdowns();
}

function showToast(msg) {
    let t = document.createElement('div'); t.className = 'toast'; t.innerText = msg;
    document.getElementById('toast-container').appendChild(t);
    setTimeout(() => t.remove(), 3000);
}

function toggleDropdown(id, e) { e.stopPropagation(); document.getElementById(id).classList.toggle('show-dropdown'); }
function closeAllDropdowns() { document.querySelectorAll('.dropdown-content').forEach(d => d.classList.remove('show-dropdown')); }
document.body.addEventListener('click', closeAllDropdowns);

async function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    currentUser.theme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
    await DB.add("users", currentUser);
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
}

// Notifications Helper
async function addNotification(userId, text) {
    let notif = { id: Date.now().toString(), userId, text, time: new Date().toLocaleString() };
    await DB.add("notifications", notif);
}

async function loadNotifications() {
    let notifs = await DB.getAll("notifications");
    let myNotifs = notifs.filter(n => n.userId === currentUser.id).reverse();
    let html = myNotifs.map(n => `<div class="post-card">${n.text} <br><small>${n.time}</small></div>`).join('');
    document.getElementById('notifications-list').innerHTML = html || "<p>No notifications yet.</p>";
}
