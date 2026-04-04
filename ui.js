function showToast(msg) {
    let container = document.getElementById('toast-container');
    let toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerText = msg;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function withLoading(cb) {
    document.getElementById('loader-overlay').classList.remove('hidden');
    setTimeout(() => { document.getElementById('loader-overlay').classList.add('hidden'); cb(); }, 500);
}

function navTo(screenId, navEl = null) {
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
    document.getElementById(screenId).classList.remove('hidden');
    if (navEl) {
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        navEl.classList.add('active');
    }
    closeAllDropdowns();
}

function toggleDropdown(id, e) {
    e.stopPropagation();
    closeAllDropdowns();
    document.getElementById(id).classList.add('show-dropdown');
}

function closeAllDropdowns() {
    document.querySelectorAll('.dropdown-content').forEach(d => d.classList.remove('show-dropdown'));
}

function openModal(id) { document.getElementById(id).classList.remove('closed'); closeAllDropdowns(); }
function closeModal(id) { document.getElementById(id).classList.add('closed'); }

// 🌗 Theme Change Fixed
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    if(currentUser) {
        currentUser.theme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
        let users = DB.get('users');
        let uIdx = users.findIndex(x => x.id === currentUser.id);
        if(uIdx > -1) { users[uIdx].theme = currentUser.theme; DB.set('users', users); DB.setObj('currentUser', currentUser); }
    }
    closeAllDropdowns();
}

// 🌐 Language Fixed
function openLanguage() { openModal('language-modal'); }
