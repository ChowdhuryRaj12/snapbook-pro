function navTo(screenId, navEl = null) {
    // প্রথমে সব স্ক্রিন লুকিয়ে ফেলা হচ্ছে
    document.querySelectorAll('.screen').forEach(s => {
        s.classList.add('hidden');
    });

    // এবার শুধু যেটিতে ক্লিক করা হয়েছে, সেটি দেখানো হচ্ছে
    document.getElementById(screenId).classList.remove('hidden');

    // নিচের মেনুর কালার চেঞ্জ করার লজিক
    if (navEl) {
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        navEl.classList.add('active');
    }
    closeAllDropdowns();
}

// আপনার ui.js এর বাকি ফাংশনগুলো (showToast, toggleTheme ইত্যাদি) আগের মতই থাকবে...
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
