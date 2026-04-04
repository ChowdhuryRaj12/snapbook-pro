window.onload = function() {
    if (!localStorage.getItem(`${DB_PREFIX}users`)) DB.set('users', []);
    if (!localStorage.getItem(`${DB_PREFIX}posts`)) DB.set('posts', []);
    
    // অ্যাপ লোড হওয়ার সাথে সাথে সব স্ক্রিন হাইড করে দাও
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));

    if (currentUser) {
        // যদি লগইন করা থাকে, তাহলে Home/Feed দেখাবে
        document.getElementById('top-header').classList.remove('hidden');
        document.getElementById('bottom-bar').classList.remove('hidden');
        if(currentUser.theme === 'dark') document.body.classList.add('dark-mode');
        
        navTo('feed-screen'); // ফিড স্ক্রিন ওপেন হবে
    } else {
        // লগইন করা না থাকলে শুধু Auth (লগইন) স্ক্রিন দেখাবে
        document.getElementById('top-header').classList.add('hidden');
        document.getElementById('bottom-bar').classList.add('hidden');
        
        navTo('auth-screen'); // লগইন স্ক্রিন ওপেন হবে
    }
};

// আপনার main.js এর বাকি কোড (ছবি আপলোড ইত্যাদি) আগের মতই থাকবে...        let base64Image = await resizeImage(el.files[0]);
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
