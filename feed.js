// feed.js
let tempMedia = null;

function previewUpload(input) {
    if (input.files && input.files[0]) {
        let reader = new FileReader();
        reader.onload = e => { tempMedia = e.target.result; showToast("Media Attached!"); };
        reader.readAsDataURL(input.files[0]);
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
        likes: [], // লাইক কাউন্টের জন্য Array (১ জন ১ বারই পারবে)
        comments: [] // কমেন্টের জন্য Array
    };

    await DB.add("posts", post);
    document.getElementById('post-text').value = '';
    tempMedia = null;
    showToast("Posted successfully!");
    loadFeed();
}

async function loadFeed() {
    let posts = await DB.getAll("posts");
    let users = await DB.getAll("users");
    
    // Safety check: Make sure currentUser has following array
    if(!currentUser.following) currentUser.following = [];

    let feedPosts = posts.filter(p => p.type === 'post').reverse();
    
    let html = feedPosts.map(p => {
        let u = users.find(x => x.id === p.userId);
        if(!u) return '';

        // Safety check for older posts missing arrays
        if(!p.likes) p.likes = [];
        if(!p.comments) p.comments = [];

        let isLiked = p.likes.includes(currentUser.id);
        let isFollowing = currentUser.following.includes(u.id);
        let mediaHtml = p.media ? `<img src="${p.media}" class="post-media">` : '';
        
        // Follow Button HTML (নিজে নিজের পোস্টে ফলো বাটন দেখাবে না)
        let followBtnHtml = '';
        if(u.id !== currentUser.id) {
            followBtnHtml = `<button class="follow-btn ${isFollowing ? 'following' : ''}" onclick="toggleFollow('${u.id}')">
                                ${isFollowing ? 'Following' : 'Follow'}
                             </button>`;
        }

        // Render Comments HTML
        let commentsHtml = p.comments.map(c => {
            let commenter = users.find(x => x.id === c.userId);
            return `<div class="comment-item"><b onclick="viewProfile('${c.userId}')">${commenter?.name || 'User'}:</b> ${c.text}</div>`;
        }).join('');

        return `
            <div class="post-card">
                <div class="post-header">
                    <img src="${u.profilePic || defaultAvatar}" class="post-avatar" onclick="viewProfile('${u.id}')" style="cursor:pointer;">
                    <div>
                        <span onclick="viewProfile('${u.id}')" style="cursor:pointer;">${u.name}</span>
                        ${followBtnHtml}
                    </div>
                </div>
                <p>${p.text}</p>
                ${mediaHtml}
                <div class="post-actions">
                    <span class="${isLiked ? 'liked' : ''}" onclick="likePost('${p.id}', '${p.userId}')">
                        ${isLiked ? '❤️' : '🤍'} ${p.likes.length} Likes
                    </span>
                    <span onclick="document.getElementById('comment-input-${p.id}').focus()">💬 ${p.comments.length} Comments</span>
                </div>

                <div class="comment-section">
                    <div id="comments-${p.id}">${commentsHtml}</div>
                    <div class="comment-box">
                        <input type="text" id="comment-input-${p.id}" placeholder="Write a comment...">
                        <button onclick="addComment('${p.id}', '${p.userId}')">Send</button>
                    </div>
                </div>
            </div>`;
    }).join('');
    
    document.getElementById('home-feed').innerHTML = html || "<p style='text-align:center;'>No posts yet.</p>";
}

// Fixed 1 Like System (Like / Unlike)
async function likePost(postId, postOwnerId) {
    let post = await DB.getById("posts", postId);
    if (!post.likes) post.likes = []; 
    
    let index = post.likes.indexOf(currentUser.id);
    
    if (index > -1) {
        post.likes.splice(index, 1); // Unlike
    } else {
        post.likes.push(currentUser.id); // Add Like
        if(postOwnerId !== currentUser.id) {
            await addNotification(postOwnerId, `${currentUser.name} liked your post.`);
        }
    }
    
    await DB.add("posts", post);
    loadFeed(); // Refresh
}

// Add Comment System
async function addComment(postId, postOwnerId) {
    let input = document.getElementById(`comment-input-${postId}`);
    let text = input.value.trim();
    if(!text) return;

    let post = await DB.getById("posts", postId);
    if (!post.comments) post.comments = [];
    
    post.comments.push({
        userId: currentUser.id,
        text: text,
        time: new Date().toLocaleString()
    });

    await DB.add("posts", post);
    input.value = ''; // Clear input field

    if(postOwnerId !== currentUser.id) {
        await addNotification(postOwnerId, `${currentUser.name} commented on your post: "${text}"`);
    }
    loadFeed(); // Refresh
}

// Reels Load
function uploadReel(input) {
    if (input.files && input.files[0]) {
        let reader = new FileReader();
        reader.onload = async (e) => {
            let reel = { id: Date.now().toString(), userId: currentUser.id, media: e.target.result, type: 'reel', likes: [] };
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
