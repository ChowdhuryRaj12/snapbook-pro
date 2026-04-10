// feed.js
let tempMedia = null;

function previewUpload(input) {
    if (input.files && input.files[0]) {
        let reader = new FileReader();
        reader.onload = e => { tempMedia = e.target.result; showToast("Media Attached!"); };
        reader.readAsDataURL(input.files[0]); // Using Base64 for IndexedDB
    }
}

async function createPost() {
    let text = document.getElementById('post-text').value;
    if(!text && !tempMedia) return showToast("Post cannot be empty!");

    let post = {
        id: Date.now().toString(),
        userId: currentUser.id,
        text: text,
        media: tempMedia,
        type: 'post',
        likes: 0
    };

    await DB.add("posts", post);
    document.getElementById('post-text').value = '';
    tempMedia = null;
    showToast("Posted!");
    loadFeed();
}

async function loadFeed() {
    let posts = await DB.getAll("posts");
    let users = await DB.getAll("users");
    
    let feedPosts = posts.filter(p => p.type === 'post').reverse();
    let html = feedPosts.map(p => {
        let u = users.find(x => x.id === p.userId);
        let mediaHtml = p.media ? `<img src="${p.media}" class="post-media">` : '';
        return `
            <div class="post-card">
                <div class="post-header">
                    <img src="${u?.profilePic || defaultAvatar}" class="post-avatar">
                    <span>${u?.name}</span>
                </div>
                <p>${p.text}</p>
                ${mediaHtml}
                <div class="post-actions">
                    <span onclick="likePost('${p.id}', '${p.userId}')">❤️ ${p.likes} Like</span>
                    <span onclick="showToast('Comments coming soon!')">💬 Comment</span>
                </div>
            </div>`;
    }).join('');
    document.getElementById('home-feed').innerHTML = html || "<p style='text-align:center;'>No posts yet.</p>";
}

async function likePost(postId, postOwnerId) {
    let post = await DB.getById("posts", postId);
    post.likes += 1;
    await DB.add("posts", post);
    
    if(postOwnerId !== currentUser.id) {
        await addNotification(postOwnerId, `${currentUser.name} liked your post.`);
    }
    loadFeed();
}

// Reels Logic
function uploadReel(input) {
    if (input.files && input.files[0]) {
        let reader = new FileReader();
        reader.onload = async (e) => {
            let reel = { id: Date.now().toString(), userId: currentUser.id, media: e.target.result, type: 'reel', likes: 0 };
            await DB.add("posts", reel);
            showToast("Reel Uploaded!");
            loadReels();
        };
        reader.readAsDataURL(input.files[0]);
    }
}

async function loadReels() {
    let posts = await DB.getAll("posts");
    let reels = posts.filter(p => p.type === 'reel').reverse();
    let html = reels.map(r => `
        <div class="reel-item">
            <video src="${r.media}" class="reel-video" autoplay loop muted controls></video>
        </div>`).join('');
    document.getElementById('reels-feed').innerHTML = html || "<p style='color:white; text-align:center; padding-top:100px;'>No reels found.</p>";
}
