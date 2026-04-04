let generatedOTP = null;
let pendingSignupData = null;

function startSignup() {
    document.getElementById('login-box').classList.add('hidden');
    document.getElementById('otp-box').classList.add('hidden');
    document.getElementById('signup-box').classList.remove('hidden');
}

function cancelSignup() {
    document.getElementById('signup-box').classList.add('hidden');
    document.getElementById('otp-box').classList.add('hidden');
    document.getElementById('login-box').classList.remove('hidden');
    
    document.getElementById('reg-name').value = '';
    document.getElementById('reg-contact').value = '';
    document.getElementById('reg-password').value = '';
    document.getElementById('reg-otp-input').value = '';
}

function sendOTP() {
    let name = document.getElementById('reg-name').value.trim();
    let contact = document.getElementById('reg-contact').value.trim();
    let pass = document.getElementById('reg-password').value;

    if (!name || !contact || !pass) return showToast("Please fill all details!");
    if (!contact.includes('@')) return showToast("Please enter a valid email address!");

    let users = DB.get('users');
    if (users.find(u => u.contact === contact)) {
        return showToast("Account already exists with this email!");
    }

    pendingSignupData = { name, contact, pass };
    
    // 5-Digit OTP জেনারেট করা হচ্ছে
    generatedOTP = Math.floor(10000 + Math.random() * 90000).toString();

    // লোডার দেখানো হচ্ছে
    document.getElementById('loader-overlay').classList.remove('hidden');

    // EmailJS এর মাধ্যমে ইউজারের আসল মেইলে OTP পাঠানো হচ্ছে
    let templateParams = {
        to_name: name,
        to_email: contact,
        otp: generatedOTP
    };

    // নিচে আপনার Service ID এবং Template ID বসান
    emailjs.send('service_20bpfss', 'template_8yqzeol', templateParams)
        .then(function(response) {
            document.getElementById('loader-overlay').classList.add('hidden');
            showToast("OTP sent successfully to your email!");
            
            document.getElementById('signup-box').classList.add('hidden');
            document.getElementById('otp-box').classList.remove('hidden');
        }, function(error) {
            document.getElementById('loader-overlay').classList.add('hidden');
            showToast("Failed to send OTP. Check email address.");
            console.log("EmailJS Error:", error);
        });
}

function verifyOTPAndSignup() {
    let userOTP = document.getElementById('reg-otp-input').value.trim();
    
    if (!userOTP) return showToast("Please enter the OTP!");
    if (userOTP !== generatedOTP) return showToast("Invalid OTP Code! Please try again.");

    let users = DB.get('users');
    let newUser = { 
        id: Date.now(), name: pendingSignupData.name, contact: pendingSignupData.contact, 
        password: pendingSignupData.pass, profilePic: defaultAvatar, coverPhoto: "", 
        bookmarks: [], followers: [], following: [], theme: 'light', earnings: 0 
    };
    
    users.push(newUser);
    DB.set('users', users);
    DB.setObj('currentUser', newUser);
    
    showToast("Account Created Successfully!");
    setTimeout(() => { location.reload(); }, 1000);
}

function handleLogin() {
    let contact = document.getElementById('log-username').value.trim();
    let pass = document.getElementById('log-password').value;
    
    if (!contact || !pass) return showToast("Enter email and password!");
    
    let user = DB.get('users').find(u => u.contact === contact && u.password === pass);
    if (user) {
        DB.setObj('currentUser', user);
        showToast("Login Successful!");
        setTimeout(() => { location.reload(); }, 500);
    } else {
        showToast("Invalid Email or Password!");
    }
}

function logout() { DB.remove('currentUser'); location.reload(); }        showToast("Login Successful!");
        location.reload();
    } else {
        showToast("Invalid Contact or Password!");
    }
}

function logout() { DB.remove('currentUser'); location.reload(); }
