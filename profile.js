// profile.js
async function loadProfile() {
    let u = await DB.getById("users", currentUser.id);
    document.getElementById('prof-name').innerText = u.name;
    document.getElementById('prof-email').innerText = u.email;
    document.getElementById('profile-pic').src = u.profilePic;
    
    if(u.coverPhoto) {
        document.getElementById('profile-cover').style.backgroundImage = `url(${u.coverPhoto})`;
    }

    // Load user's own posts
    let posts = await DB.getAll("posts");
    let myPosts = posts.filter(p => p.userId === u.id && p.type === 'post').reverse();
    let html = myPosts.map(p => `
        <div class="post-card">
            <p>${p.text}</p>
            ${p.media ? `<img src="${p.media}" style="width:100%; border-radius:10px; margin-top:10px;">` : ''}
        </div>
    `).join('');
    document.getElementById('user-posts').innerHTML = "<h3>My Posts</h3>" + (html || "<p>No posts yet.</p>");
}

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
            loadProfile();
            showToast("Profile Updated!");
        };
        reader.readAsDataURL(input.files[0]);
    }
}
