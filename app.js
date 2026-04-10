// app.js

window.onload = async function() {
    if (currentUser) {
        // যদি ইউজার লগিন করা থাকে
        if(currentUser.theme === 'dark') document.body.classList.add('dark-mode');
        document.getElementById('top-header').classList.remove('hidden');
        document.getElementById('bottom-bar').classList.remove('hidden');
        
        // হোম স্ক্রিন লোড করা
        navTo('home-screen');
    } else {
        // যদি লগিন করা না থাকে
        navTo('auth-screen');
    }
};

function navTo(screenId, navEl=null) {
    // ১. প্রথমে সমস্ত স্ক্রিনগুলো ১০০% হাইড করা
    document.querySelectorAll('.screen').forEach(s => {
        s.classList.add('hidden');
        s.style.display = 'none'; // CSS কাজ না করলেও JS দিয়ে জোর করে হাইড করা
    });
    
    // ২. শুধুমাত্র টার্গেট স্ক্রিনটি শো করা
    let activeScreen = document.getElementById(screenId);
    activeScreen.classList.remove('hidden');
    activeScreen.style.display = '';

    // ৩. ন্যাভিগেশন বার এর আইকন এক্টিভ করা
    if(navEl) {
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        navEl.classList.add('active');
    } else if (screenId === 'home-screen') {
        // ম্যানুয়ালি হোম স্ক্রিন সিলেক্ট করা
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        let firstNav = document.querySelector('.nav-item');
        if(firstNav) firstNav.classList.add('active');
    }
    
    // ৪. স্ক্রিন অনুযায়ী ডাটা লোড করা
    if(screenId === 'home-screen' && typeof loadFeed === 'function') loadFeed();
    if(screenId === 'reels-screen' && typeof loadReels === 'function') loadReels();
    if(screenId === 'message-screen' && typeof loadUserList === 'function') loadUserList();
    if(screenId === 'notification-screen' && typeof loadNotifications === 'function') loadNotifications();
    if(screenId === 'dashboard-screen' && typeof loadDashboard === 'function') loadDashboard();
    
    closeAllDropdowns();
}

function showToast(msg) {
    let t = document.createElement('div'); 
    t.className = 'toast'; 
    t.innerText = msg;
    document.getElementById('toast-container').appendChild(t);
    setTimeout(() => t.remove(), 3000);
}

function toggleDropdown(id, e) { 
    e.stopPropagation(); 
    closeAllDropdowns();
    document.getElementById(id).classList.toggle('show-dropdown'); 
}

function closeAllDropdowns() { 
    document.querySelectorAll('.dropdown-content').forEach(d => d.classList.remove('show-dropdown')); 
}
document.body.addEventListener('click', closeAllDropdowns);

async function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    if (currentUser) {
        currentUser.theme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
        await DB.add("users", currentUser);
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
}

// Notifications Helper System
async function addNotification(userId, text) {
    let notif = { 
        id: Date.now().toString(), 
        userId: userId, 
        text: text, 
        time: new Date().toLocaleString() 
    };
    await DB.add("notifications", notif);
}

async function loadNotifications() {
    let notifs = await DB.getAll("notifications");
    let myNotifs = notifs.filter(n => n.userId === currentUser.id).reverse();
    
    let html = myNotifs.map(n => `
        <div class="post-card">
            <b>${n.text}</b> <br>
            <small style="color:gray;">${n.time}</small>
        </div>
    `).join('');
    
    document.getElementById('notifications-list').innerHTML = html || "<p style='text-align:center;'>No notifications yet.</p>";
                                                                               }
