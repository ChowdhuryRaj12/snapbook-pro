let tempMedia = null;

// Use Compression for Post Uploads
function previewUpload(input) {
    if (input.files && input.files[0]) {
        compressImage(input.files[0], (compressedData) => {
            tempMedia = compressedData;
            showToast("Media Attached & Compressed!");
        });
    }
}

async function createPost() {
    let text = document.getElementById('post-text').value;
    if(!text && !tempMedia) return;

    let post = {
        id: Date.now().toString(),
        userId: currentUser.id,
        text: text,
        media: tempMedia,
        type: 'post',
        reactions: {}, // { userId: '❤️' }
        comments: [],
        views: 0,
        timestamp: Date.now()
    };

    await DB.add("posts", post);
    document.getElementById('post-text').value = '';
    tempMedia = null;
    showToast("Posted successfully!");
    loadFeed();
}

async function loadFeed(isSavedFeed = false) {
    let posts = await DB.getAll("posts");
    let users = await DB.getAll("users");
    
    if(!currentUser.savedPosts) currentUser.savedPosts = [];

    // Filter logic for Feed vs Saved Screen
    let feedPosts = posts.filter(p => p.type === 'post').reverse();
    if(isSavedFeed) feedPosts = feedPosts.filter(p => currentUser.savedPosts.includes(p.id));

    let html = feedPosts.map(p => {
        let u = users.find(x => x.id === p.userId) || { name: 'Unknown', verified: false };
        let myReaction = p.reactions[currentUser.id] || '🤍';
        let reactionCount = Object.keys(p.reactions).length;
        let isSaved = currentUser.savedPosts.includes(p.id);
        
        let verifiedIcon = u.verified ? `<span class="verified-badge">✔️</span>` : '';
        
        // Post Menu (Edit/Delete for owner, Save for everyone)
        let menuHtml = `
            <div class="dropdown">
                <span class="post-menu-btn" onclick="toggleDropdown('menu-${p.id}', event)">⋮</span>
                <div id="menu-${p.id}" class="dropdown-content">
                    <div class="menu-item" onclick="toggleSavePost('${p.id}')">${isSaved ? 'Unsave' : '📌 Save Post'}</div>
                    ${u.id === currentUser.id ? `
                        <div class="menu-item" onclick="editPost('${p.id}')">✏️ Edit</div>
                        <div class="menu-item" style="color:red;" onclick="deletePost('${p.id}')">🗑️ Delete</div>
                    ` : ''}
                </div>
            </div>`;

        return `
            <div class="post-card">
                <div class="post-header" style="justify-content: space-between;">
                    <div style="display:flex; gap:10px; align-items:center;">
                        <img src="${u.profilePic}" class="post-avatar">
                        <b>${u.name} ${verifiedIcon}</b>
                    </div>
                    ${menuHtml}
                </div>
                <p>${p.text.replace(/(#\w+)/g, '<span style="color:var(--primary);cursor:pointer;">$1</span>')}</p>
                ${p.media ? `<img src="${p.media}" class="post-media">` : ''}
                
                <div class="post-actions">
                    <!-- Advanced Reactions -->
                    <div class="reaction-box">
                        <span>${myReaction} ${reactionCount}</span>
                        <div class="reaction-emojis">
                            <span class="react-icon" onclick="reactPost('${p.id}', '❤️')">❤️</span>
                            <span class="react-icon" onclick="reactPost('${p.id}', '😂')">😂</span>
                            <span class="react-icon" onclick="reactPost('${p.id}', '😮')">😮</span>
                            <span class="react-icon" onclick="reactPost('${p.id}', '😢')">😢</span>
                        </div>
                    </div>
                    <span>💬 ${p.comments.length}</span>
                    <span>👁️ ${p.views || 0}</span>
                </div>
            </div>`;
    }).join('');
    
    document.getElementById(isSavedFeed ? 'saved-feed' : 'home-feed').innerHTML = html;
    
    if(!isSavedFeed) loadStories(); // Load stories on home screen
}

// 🎭 React System
async function reactPost(postId, emoji) {
    let post = await DB.getById("posts", postId);
    if (!post.reactions) post.reactions = {};
    
    if(post.reactions[currentUser.id] === emoji) {
        delete post.reactions[currentUser.id]; // Remove if clicked same
    } else {
        post.reactions[currentUser.id] = emoji; // Add/Change reaction
    }
    
    await DB.add("posts", post);
    loadFeed();
}

// 📌 Save/Bookmark System
async function toggleSavePost(postId) {
    if(!currentUser.savedPosts) currentUser.savedPosts = [];
    let index = currentUser.savedPosts.indexOf(postId);
    if (index > -1) {
        currentUser.savedPosts.splice(index, 1);
        showToast("Post Removed from Saved");
    } else {
        currentUser.savedPosts.push(postId);
        showToast("Post Saved!");
    }
    await DB.add("users", currentUser);
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    loadFeed();
}

// 🗑️ Delete & Edit System
async function deletePost(postId) {
    if(confirm("Are you sure you want to delete this post?")) {
        await DB.delete("posts", postId);
        showToast("Post Deleted!");
        loadFeed();
    }
}

async function editPost(postId) {
    let post = await DB.getById("posts", postId);
    let newText = prompt("Edit your post:", post.text);
    if(newText !== null) {
        post.text = newText;
        await DB.add("posts", post);
        loadFeed();
    }
}

// 🎥 Story System (24h Auto Expire)
function uploadStory(input) {
    if (input.files && input.files[0]) {
        compressImage(input.files[0], async (compressedData) => {
            let story = { id: Date.now().toString(), userId: currentUser.id, media: compressedData, time: Date.now() };
            await DB.add("stories", story);
            showToast("Story Uploaded!");
            loadStories();
        });
    }
}

async function loadStories() {
    let stories = await DB.getAll("stories");
    let users = await DB.getAll("users");
    let now = Date.now();
    let validStories = stories.filter(s => (now - s.time) < 86400000); // 24 Hours in ms

    // Delete expired from DB
    stories.filter(s => (now - s.time) >= 86400000).forEach(async s => await DB.delete("stories", s.id));

    let html = validStories.map(s => {
        let u = users.find(x => x.id === s.userId);
        return `<div class="story-item" onclick="showToast('Story Viewing UI Comming Soon!')">
                    <img src="${s.media}" class="story-img">
                    <span>${u.name.split(' ')[0]}</span>
                </div>`;
    }).join('');
    
    document.getElementById('story-list').innerHTML = html;
}

// 🔍 Search System
async function liveSearch() {
    let query = document.getElementById('global-search').value.toLowerCase();
    let resultBox = document.getElementById('search-results');
    if(!query) { resultBox.classList.add('hidden'); return; }

    let users = await DB.getAll("users");
    let posts = await DB.getAll("posts");

    let userMatches = users.filter(u => u.name.toLowerCase().includes(query) || (u.username && u.username.toLowerCase().includes(query)));
    let tagMatches = posts.filter(p => p.text.toLowerCase().includes(query) && query.includes('#'));

    let html = userMatches.map(u => `<div class="menu-item" onclick="viewProfile('${u.id}')">👤 ${u.name}</div>`).join('');
    html += tagMatches.map(p => `<div class="menu-item" onclick="showToast('Post matched!')">📄 Post matching ${query}</div>`).join('');

    resultBox.innerHTML = html || "<div class='menu-item'>No results found</div>";
    resultBox.classList.remove('hidden');
}
