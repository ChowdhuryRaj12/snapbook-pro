const DB_PREFIX = 'sb_v8_';
const DB = { get: k => JSON.parse(localStorage.getItem(DB_PREFIX+k))||[], set: (k,v) => localStorage.setItem(DB_PREFIX+k, JSON.stringify(v)), getObj: k => JSON.parse(localStorage.getItem(DB_PREFIX+k)), setObj: (k,v) => localStorage.setItem(DB_PREFIX+k, JSON.stringify(v)), remove: k => localStorage.removeItem(DB_PREFIX+k) };
const MediaStore = { db: null, init() { return new Promise(r => { let req = indexedDB.open('SBMedia', 1); req.onupgradeneeded = e => e.target.result.createObjectStore('media', {keyPath:'id'}); req.onsuccess = e => { this.db = e.target.result; r(); }; }); }, save(id, blob) { return new Promise(r => { let tx = this.db.transaction('media','readwrite'); tx.objectStore('media').put({id,blob}); tx.oncomplete=r; }); }, get(id) { return new Promise(r => { let tx = this.db.transaction('media','readonly'); let req = tx.objectStore('media').get(id); req.onsuccess = () => r(req.result?.blob||null); }); } };

let currentUser = DB.getObj('currentUser');
const defaultAvatar = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' fill='%23999' viewBox='0 0 24 24'><path d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/></svg>";

function showToast(msg) { let c = document.getElementById('toast-container'); let t = document.createElement('div'); t.className='toast'; t.innerText=msg; c.appendChild(t); setTimeout(()=>t.remove(), 3000); }
function withLoading(cb) { document.getElementById('loader-overlay').classList.remove('hidden'); setTimeout(()=>{ document.getElementById('loader-overlay').classList.add('hidden'); cb(); }, 300); }

/* Navigation Logic */
function navTo(screenId, navEl=null) {
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden')); 
    document.getElementById(screenId).classList.remove('hidden');
    if(navEl) { document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active')); navEl.classList.add('active'); }
    closeAllDropdowns();
    if(screenId==='feed-screen') renderFeed();
}
function openModal(id) { document.getElementById(id).classList.remove('closed'); closeAllDropdowns(); }
function closeModal(id) { document.getElementById(id).classList.add('closed'); }
function toggleDropdown(id, e) { e.stopPropagation(); closeAllDropdowns(); document.getElementById(id).classList.add('show-dropdown'); }
function closeAllDropdowns() { document.querySelectorAll('.dropdown-content').forEach(d => d.classList.remove('show-dropdown')); }

async function init() {
    ['users','posts','chats','notifications'].forEach(k => { if(!localStorage.getItem(DB_PREFIX+k)) DB.set(k,[]); });
    await MediaStore.init();
    if(currentUser) {
        document.getElementById('top-header').classList.remove('hidden');
        document.getElementById('bottom-bar').classList.remove('hidden');
        navTo('feed-screen');
    } else {
        navTo('auth-screen');
    }
}

/* AUTH */
let signupData={};
function startSignup() { document.getElementById('login-box').classList.add('hidden'); document.getElementById('signup-box').classList.remove('hidden'); nextRegStep(1); }
function cancelSignup() { document.getElementById('signup-box').classList.add('hidden'); document.getElementById('login-box').classList.remove('hidden'); }
function nextRegStep(step) { for(let i=1;i<=5;i++) document.getElementById('reg-step-'+i).classList.add('hidden'); document.getElementById('reg-step-'+step).classList.remove('hidden'); }
function submitSignup() {
    let c = document.getElementById('reg-contact').value; let p = document.getElementById('reg-password-new').value;
    if(!c||!p) return showToast("Fill all!");
    let u = { id:Date.now(), name: "User", username: "@user", contact: c, password: p, profilePic: defaultAvatar, followers:[], following:[], bookmarks:[] };
    let users = DB.get('users'); users.push(u); DB.set('users', users);
    currentUser = u; DB.setObj('currentUser', u); showToast("Account Created"); location.reload();
}
function handleLogin() {
    let u = document.getElementById('log-username').value; let p = document.getElementById('log-password').value;
    let user = DB.get('users').find(x => x.contact===u && x.password===p);
    if(user) { currentUser = user; DB.setObj('currentUser', user); location.reload(); } else showToast("Invalid!");
}
function logout() { DB.remove('currentUser'); location.reload(); }

/* APP CORE */
function renderFeed() {
    let html = DB.get('posts').map(p => {
        let u = DB.get('users').find(x=>x.id===p.userId);
        return `<div class="fb-post"><div class="post-header"><img src="${u?.profilePic||defaultAvatar}" class="post-avatar"><b>${u?.name}</b></div><div style="padding:15px">${p.text||''}</div></div>`;
    }).join('');
    document.getElementById('main-feed').innerHTML = html || "<p style='text-align:center; margin-top:20px;'>No posts yet.</p>";
}

function viewProfile(uid) {
    let u = DB.get('users').find(x=>x.id===uid); if(!u) return;
    document.getElementById('profile-name').innerText = u.name;
    document.getElementById('profile-pic-large').src = u.profilePic||defaultAvatar;
    navTo('profile-screen');
}

function processUpload() {
    let text = document.getElementById('up-text').value; if(!text) return;
    let posts = DB.get('posts'); posts.push({ id:Date.now(), userId:currentUser.id, text, timestamp:Date.now() });
    DB.set('posts', posts); closeModal('upload-media-modal'); document.getElementById('up-text').value=''; showToast("Posted!"); renderFeed();
}

window.onload = init;
