// auth.js
function toggleAuth(id) {
    document.getElementById('login-box').classList.add('hidden');
    document.getElementById('signup-box').classList.add('hidden');
    document.getElementById(id).classList.remove('hidden');
}

async function handleSignup() {
    let name = document.getElementById('reg-name').value;
    let email = document.getElementById('reg-email').value;
    let pass = document.getElementById('reg-password').value;

    if (!name || !email || !pass) return showToast("Fill all fields!");

    let users = await DB.getAll("users");
    if (users.find(u => u.email === email)) return showToast("Email already exists!");

    let newUser = {
        id: Date.now().toString(),
        name, email, pass,
        profilePic: defaultAvatar, coverPhoto: "",
        theme: 'light', followers: 0, earnings: 0, views: 0, likes: 0
    };

    await DB.add("users", newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    showToast("Account Created!");
    location.reload();
}

async function handleLogin() {
    let email = document.getElementById('log-email').value;
    let pass = document.getElementById('log-password').value;

    let users = await DB.getAll("users");
    let user = users.find(u => u.email === email && u.pass === pass);

    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        location.reload();
    } else {
        showToast("Invalid Email or Password!");
    }
}

function logout() {
    localStorage.removeItem('currentUser');
    location.reload();
        }
