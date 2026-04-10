// chat.js
let activeChatUser = null;

async function loadUserList() {
    let users = await DB.getAll("users");
    let otherUsers = users.filter(u => u.id !== currentUser.id);
    
    let html = otherUsers.map(u => `
        <div class="user-list-item" onclick="openChat('${u.id}', '${u.name}')">
            <img src="${u.profilePic}" style="width:40px; height:40px; border-radius:50%; object-fit:cover;">
            <b>${u.name}</b>
        </div>
    `).join('');
    document.getElementById('user-list').innerHTML = html;
}

function openChat(userId, userName) {
    activeChatUser = userId;
    document.getElementById('chat-user-name').innerText = userName;
    document.getElementById('chat-box').classList.remove('hidden');
    loadMessages();
}

function closeChat() {
    document.getElementById('chat-box').classList.add('hidden');
    activeChatUser = null;
}

async function sendMessage() {
    let text = document.getElementById('chat-input').value;
    if(!text) return;

    let msg = { id: Date.now().toString(), senderId: currentUser.id, receiverId: activeChatUser, text: text };
    await DB.add("messages", msg);
    
    document.getElementById('chat-input').value = '';
    loadMessages();
}

async function loadMessages() {
    if(!activeChatUser) return;
    let msgs = await DB.getAll("messages");
    
    let chatMsgs = msgs.filter(m => 
        (m.senderId === currentUser.id && m.receiverId === activeChatUser) ||
        (m.senderId === activeChatUser && m.receiverId === currentUser.id)
    );

    let html = chatMsgs.map(m => `
        <div class="msg-bubble ${m.senderId === currentUser.id ? 'msg-mine' : 'msg-theirs'}">
            ${m.text}
        </div>
    `).join('');
    
    let chatBox = document.getElementById('chat-messages');
    chatBox.innerHTML = html;
    chatBox.scrollTop = chatBox.scrollHeight;
}
