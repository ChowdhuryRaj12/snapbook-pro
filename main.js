window.onload = function() {
    // Initially hide all screens to prevent overlapping
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));

    if (currentUser) {
        // Logged In
        document.getElementById('top-header').classList.remove('hidden');
        document.getElementById('bottom-bar').classList.remove('hidden');
        if(currentUser.theme === 'dark') document.body.classList.add('dark-mode');
        
        navTo('feed-screen'); 
    } else {
        // Not Logged In
        document.getElementById('top-header').classList.add('hidden');
        document.getElementById('bottom-bar').classList.add('hidden');
        
        navTo('auth-screen'); 
    }
};

// --- Profile Rendering ---
function viewProfile(userId, navEl=null) {
    let u = DB.get('users').find(x => x.id === userId);
    if(!u) return;
    
    document.getElementById('profile-name').innerText = u.name;
    document.getElementById('profile-email').innerText = u.contact;
    document.getElementById('profile-pic-large').src = u.profilePic || defaultAvatar;
    
    let coverEl = document.getElementById('profile-cover');
    if(u.coverPhoto) { 
        coverEl.src = u.coverPhoto; 
        coverEl.style.display = 'block'; 
    } else { 
        coverEl.style.display = 'none'; 
    }
    
    navTo('profile-screen', navEl);
}

// --- Image Upload Logic (Base64) ---
function triggerUploadWrapper(type, el) {
    if (!el.files || !el.files[0]) return;
    
    let reader = new FileReader();
    reader.onload = function(e) {
        let base64Image = e.target.result;
        let users = DB.get('users');
        let uIdx = users.findIndex(u => u.id === currentUser.id);
        
        if(type === 'pfp') users[uIdx].profilePic = base64Image;
        if(type === 'cover') users[uIdx].coverPhoto = base64Image;
        
        DB.set('users', users);
        currentUser = users[uIdx];
        DB.setObj('currentUser', currentUser);
        
        showToast("Photo Updated Successfully!");
        viewProfile(currentUser.id); // Refresh
    };
    reader.readAsDataURL(el.files[0]);
}

// --- Features ---
function openMonetization() {
    closeAllDropdowns();
    document.getElementById('monetization-earnings').innerText = "$" + (currentUser.earnings || 0).toFixed(2);
    openModal('monetization-modal');
}

function openVerification() {
    closeAllDropdowns();
    document.getElementById('verify-body').innerHTML = `
        <h3>Get Verified</h3>
        <input type="text" placeholder="Full Legal Name" style="width:100%; margin:10px 0; padding:10px;">
        <input type="text" placeholder="Country" style="width:100%; margin:10px 0; padding:10px;">
        <button class="btn" onclick="showToast('Verification Request Submitted!'); closeModal('verification-modal');">Submit Identity</button>
    `;
    openModal('verification-modal');
}

function renderBookmarks() {
    navTo('bookmarks-screen');
    let posts = DB.get('posts').filter(p => currentUser.bookmarks && currentUser.bookmarks.includes(p.id));
    let html = posts.map(p => `<div style="padding:15px; background:var(--bg-color); margin-bottom:10px; border-radius:12px; border:1px solid #ccc;">${p.text}</div>`).join('');
    document.getElementById('bookmarks-list').innerHTML = html || "<p style='text-align:center; color:gray; margin-top:20px;'>No saved posts yet.</p>";
            }    });
}

// 👤 Profile Render
function viewProfile(userId, navEl=null) {
    let u = DB.get('users').find(x => x.id === userId);
    if(!u) return;
    document.getElementById('profile-name').innerText = u.name;
    document.getElementById('profile-pic-large').src = u.profilePic || defaultAvatar;
    
    let coverEl = document.getElementById('profile-cover');
    if(u.coverPhoto) { coverEl.src = u.coverPhoto; coverEl.style.display = 'block'; } 
    else { coverEl.style.display = 'none'; }
    
    navTo('profile-screen', navEl);
}

// 💰 Monetization Fixed
function openMonetization() {
    closeAllDropdowns();
    document.getElementById('monetization-earnings').innerText = "$" + (currentUser.earnings || 0).toFixed(2);
    openModal('monetization-modal');
}

// ✔️ Get Verified Fixed
function openVerification() {
    closeAllDropdowns();
    document.getElementById('verify-body').innerHTML = `
        <input type="text" placeholder="Full Legal Name">
        <input type="text" placeholder="Country">
        <button class="btn" onclick="showToast('Verification Request Submitted!'); closeModal('verification-modal');">Submit Identity</button>
    `;
    openModal('verification-modal');
}

// 📑 Saved Posts Fixed
function renderBookmarks() {
    navTo('bookmarks-screen');
    let posts = DB.get('posts').filter(p => currentUser.bookmarks && currentUser.bookmarks.includes(p.id));
    let html = posts.map(p => `<div style="padding:15px; background:var(--glass-bg); margin-bottom:10px; border-radius:12px;">${p.text}</div>`).join('');
    document.getElementById('bookmarks-list').innerHTML = html || "<p style='text-align:center; color:gray;'>No saved posts yet.</p>";
}
