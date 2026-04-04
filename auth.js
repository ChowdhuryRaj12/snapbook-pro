let generatedOTP = null;
let pendingSignupData = null;

function startSignup() { 
    document.getElementById('login-box').classList.add('hidden'); 
    document.getElementById('signup-box').classList.remove('hidden'); 
    nextRegStep(1); 
}

function cancelSignup() { 
    document.getElementById('signup-box').classList.add('hidden'); 
    document.getElementById('login-box').classList.remove('hidden'); 
}

function nextRegStep(step) { 
    for(let i=1; i<=4; i++) {
        document.getElementById('reg-step-'+i).classList.add('hidden'); 
    }
    document.getElementById('reg-step-'+step).classList.remove('hidden'); 
    document.getElementById('reg-title').innerText = `Sign Up - Step ${step}`;
}

function sendOTP() {
    let fn = document.getElementById('reg-fn').value.trim();
    let ln = document.getElementById('reg-ln').value.trim();
    let email = document.getElementById('reg-contact').value.trim();
    let pass = document.getElementById('reg-password-new').value;

    if (!fn || !ln || !email || !pass) return showToast("Please fill all details!");
    if (!email.includes('@')) return showToast("Enter a valid email address!");

    let users = DB.get('users');
    if (users.find(u => u.contact === email)) {
        return showToast("Account already exists with this email!");
    }

    pendingSignupData = { name: fn + " " + ln, contact: email, pass: pass };
    generatedOTP = Math.floor(10000 + Math.random() * 90000).toString(); // 5-digit OTP

    let templateParams = {
        to_name: fn,
        to_email: email,
        otp: generatedOTP
    };

    // EmailJS Service ID and Template ID 
    emailjs.send('service_20bpfss', 'template_8yqzeol', templateParams)
        .then(function(response) {
            showToast("OTP sent successfully to your email!");
            nextRegStep(4); // Move to OTP Box
        }, function(error) {
            showToast("Failed to send OTP. Check email address.");
            console.log("EmailJS Error:", error);
        });
}

function verifyOTPAndSignup() {
    let userOTP = document.getElementById('reg-otp-input').value.trim();
    
    if (!userOTP) return showToast("Please enter the OTP!");
    if (userOTP !== generatedOTP) return showToast("Invalid OTP Code! Try again.");

    let users = DB.get('users');
    let newUser = { 
        id: Date.now(), 
        name: pendingSignupData.name, 
        contact: pendingSignupData.contact, 
        password: pendingSignupData.pass, 
        profilePic: defaultAvatar, 
        coverPhoto: "", 
        bookmarks: [], 
        earnings: 0,
        theme: 'light'
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

function logout() { 
    DB.remove('currentUser'); 
    location.reload(); 
        }    generatedOTP = Math.floor(10000 + Math.random() * 90000).toString();

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
