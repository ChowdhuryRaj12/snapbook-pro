window.onload = function() {
    if (!localStorage.getItem(`${DB_PREFIX}users`)) DB.set('users', []);
    if (!localStorage.getItem(`${DB_PREFIX}posts`)) DB.set('posts', []);
    
    if (currentUser) {
        document.getElementById('auth-screen').classList.add('hidden');
        document.getElementById('top-header').classList.remove('hidden');
        document.getElementById('bottom-bar').classList.remove('hidden');
        if(currentUser.theme === 'dark') document.body.classList.add('dark-mode');
        navTo('feed-screen');
    }
};

// 🖼️ PFP and Cover Upload Fixed
function resizeImage(file) {
    return new Promise(resolve => {
        let reader = new FileReader();
        reader.onload = e => {
            let img = new Image();
            img.onload = () => {
                let canvas = document.createElement('canvas');
                let w = img.width, h = img.height;
                if(w > 800) { h *= 800/w; w = 800; }
                canvas.width = w; canvas.height = h;
                canvas.getContext('2d').drawImage(img, 0, 0, w, h);
                resolve(canvas.toDataURL('image/jpeg', 0.8));
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });
}

function triggerUploadWrapper(type, el) {
    if(!el.files[0]) return;
    withLoading(async () => {
        let base64Image = await resizeImage(el.files[0]);
        let users = DB.get('users');
        let uIdx = users.findIndex(u => u.id === currentUser.id);
        
        if(type === 'pfp') users[uIdx].profilePic = base64Image;
        if(type === 'cover') users[uIdx].coverPhoto = base64Image;
        
        DB.set('users', users);
        currentUser = users[uIdx];
        DB.setObj('currentUser', currentUser);
        
        showToast("Photo Updated Successfully!");
        viewProfile(currentUser.id); // Refresh Profile
    });
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
