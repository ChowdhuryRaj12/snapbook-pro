/* === CORE SYSTEM & DATABASE === */
const DB_PREFIX = 'snapbook_pro_v8_';
const DB = {
    get: (k) => JSON.parse(localStorage.getItem(`${DB_PREFIX}${k}`)) ||[],
    set: (k, v) => localStorage.setItem(`${DB_PREFIX}${k}`, JSON.stringify(v)),
    getObj: (k) => JSON.parse(localStorage.getItem(`${DB_PREFIX}${k}`)) || null,
    setObj: (k, v) => localStorage.setItem(`${DB_PREFIX}${k}`, JSON.stringify(v)),
    remove: (k) => localStorage.removeItem(`${DB_PREFIX}${k}`)
};

/* ... (আগের ফাইলের সম্পূর্ণ JavaScript কোড এখানে পেস্ট করুন) ... */

function toggleTheme() { document.body.classList.toggle('dark-mode'); currentUser.theme = document.body.classList.contains('dark-mode') ? 'dark' : 'light'; let users = DB.get('users'); let u = users.find(x=>x.id===currentUser.id); if(u) { u.theme = currentUser.theme; DB.set('users', users); DB.setObj('currentUser', currentUser); } closeAllDropdowns(); }

window.onload = init;
