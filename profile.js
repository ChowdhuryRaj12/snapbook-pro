// profile.js

// View Profile (নিজের অথবা অন্যের প্রোফাইল দেখা)
async function viewProfile(userId = currentUser.id) {
    let u = await DB.getById("users", userId);
    if(!u) return;

    document.getElementById('prof-name').innerText = u.name;
    document.getElementById('prof-email').innerText = u.email;
    document.getElementById('profile-pic').src = u.profilePic;
    
    if(u.coverPhoto) {
        document.getElementById('profile-cover').style.backgroundImage = `url(${u.coverPhoto})`;
    } else {
        document.getElementById('profile-cover').style.backgroundImage = `none`;
    }

    // অন্যের প্রোফাইল দেখলে ছবি এডিট করার বাটন হাইড করা
    let editBtns = document.querySelectorAll('.edit-cover-btn, .edit-pfp-btn');
    if (userId !== currentUser.id) {
        editBtns.forEach(btn => btn.style.display = 'none');
    } else {
        editBtns.forEach(btn => btn.style.display = 'block');
    }

    // Load that user's posts
    let posts = await DB.getAll("posts");
    let userPosts = posts.filter(p => p.userId === u.id && p.type === 'post').reverse();
    let html = userPosts.map(p => `
        <div class="post-card">
            <p>${p.text}</p>
            ${p.media ? `<img src="${p.media}" style="width:100%; border-radius:10px; margin-top:10px;">` : ''}
        </div>
    `).join('');
    
    let postHeading = userId === currentUser.id ? 'My Posts' : `${u.name}'s Posts`;
    document.getElementById('user-posts').innerHTML = `<h3>${postHeading}</h3>` + (html || "<p>No posts yet.</p>");
    
    navTo('profile-screen');
}

// For Bottom Nav Loading
function loadProfile() {
    viewProfile(currentUser.id);
}

// Follow / Unfollow System
async function toggleFollow(targetUserId) {
    if(targetUserId === currentUser.id) return; // নিজে নিজেকে ফলো করা যাবে না

    let me = await DB.getById("users", currentUser.id);
    let target = await DB.getById("users", targetUserId);

    if(!me.following) me.following = [];
    if(!target.followersList) target.followersList = [];

    let index = me.following.indexOf(targetUserId);
    
    if (index > -1) {
        // Unfollow Logic
        me.following.splice(index, 1);
        let targetIndex = target.followersList.indexOf(me.id);
        if(targetIndex > -1) target.followersList.splice(targetIndex, 1);
        showToast(`Unfollowed ${target.name}`);
    } else {
        // Follow Logic
        me.following.push(targetUserId);
        target.followersList.push(me.id);
        await addNotification(targetUserId, `${me.name} started following you.`);
        showToast(`Following ${target.name}`);
    }

    // Update Dashboard numeric counts
    target.followers = target.followersList.length;

    // Save to Database
    await DB.add("users", me);
    await DB.add("users", target);
    
    // Update Local Storage for current user
    currentUser = me;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Refresh feeds to update follow buttons visually
    loadFeed();
}

// Profile Picture / Cover Upload
function updateProfilePic(type, input) {
    if (input.files && input.files[0]) {
        let reader = new FileReader();
        reader.onload = async (e) => {
            let u = await DB.getById("users", currentUser.id);
            if(type === 'pfp') u.profilePic = e.target.result;
            if(type === 'cover') u.coverPhoto = e.target.result;
            
            await DB.add("users", u);
            currentUser = u;
            localStorage.setItem('currentUser', JSON.stringify(u));
            loadProfile(); // Refresh profile UI
            showToast("Profile Updated!");
        };
        reader.readAsDataURL(input.files[0]);
    }
}
