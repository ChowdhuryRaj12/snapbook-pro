function startSignup() {
    document.getElementById('login-box').classList.add('hidden');
    document.getElementById('signup-box').classList.remove('hidden');
}
function cancelSignup() {
    document.getElementById('signup-box').classList.add('hidden');
    document.getElementById('login-box').classList.remove('hidden');
}

function submitSignup() {
    let name = document.getElementById('reg-name').value.trim();
    let contact = document.getElementById('reg-contact').value.trim();
    let pass = document.getElementById('reg-password').value;

    if (!name || !contact || !pass) return showToast("Fill all details!");
    
    let users = DB.get('users');
    let newUser = { 
        id: Date.now(), name: name, contact: contact, password: pass, 
        profilePic: defaultAvatar, coverPhoto: "", bookmarks: [], 
        followers: [], following: [], theme: 'light', earnings: 0 
    };
    
    users.push(newUser);
    DB.set('users', users);
    showToast("Account Created Successfully!");
    cancelSignup();
}

function handleLogin() {
    let contact = document.getElementById('log-username').value.trim();
    let pass = document.getElementById('log-password').value;
    let user = DB.get('users').find(u => u.contact === contact && u.password === pass);
    
    if (user) {
        DB.setObj('currentUser', user);
        showToast("Login Successful!");
        location.reload();
    } else {
        showToast("Invalid Contact or Password!");
    }
}

function logout() { DB.remove('currentUser'); location.reload(); }
