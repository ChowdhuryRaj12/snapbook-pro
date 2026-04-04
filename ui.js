function showToast(msg) { 
    let c = document.getElementById('toast-container'); 
    let t = document.createElement('div'); 
    t.className='toast'; t.innerText=msg; 
    c.appendChild(t); 
    setTimeout(()=>t.remove(), 3000); 
}

function withLoading(cb) { 
    document.getElementById('loader-overlay').classList.remove('hidden'); 
    setTimeout(()=>{ 
        document.getElementById('loader-overlay').classList.add('hidden'); 
        cb(); 
    }, 500); 
}

function navTo(screenId, navEl = null) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
    
    // Show targeted screen
    document.getElementById(screenId).classList.remove('hidden');

    // Update bottom nav active state
    if (navEl) { 
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active')); 
        navEl.classList.add('active'); 
    }
    closeAllDropdowns();
}

function openModal(id) { document.getElementById(id).classList.remove('closed'); closeAllDropdowns(); }
function closeModal(id) { document.getElementById(id).classList.add('closed'); }

function toggleDropdown(id, e) { 
    e.stopPropagation(); 
    closeAllDropdowns(); 
    document.getElementById(id).classList.add('show-dropdown'); 
}
function closeAllDropdowns() { 
    document.querySelectorAll('.dropdown-content').forEach(d => d.classList.remove('show-dropdown')); 
}

document.body.addEventListener('click', closeAllDropdowns);

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    if(currentUser) {
        currentUser.theme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
        let users = DB.get('users');
        let uIdx = users.findIndex(x => x.id === currentUser.id);
        if(uIdx > -1) { 
            users[uIdx].theme = currentUser.theme; 
            DB.set('users', users); 
            DB.setObj('currentUser', currentUser); 
        }
    }
                              }
