const DB_const DB_PREFIX = 'snap_pro_v9_';

const DB = {
    get: (k) => JSON.parse(localStorage.getItem(`${DB_PREFIX}${k}`)) || [],
    set: (k, v) => localStorage.setItem(`${DB_PREFIX}${k}`, JSON.stringify(v)),
    getObj: (k) => JSON.parse(localStorage.getItem(`${DB_PREFIX}${k}`)) || null,
    setObj: (k, v) => localStorage.setItem(`${DB_PREFIX}${k}`, JSON.stringify(v)),
    remove: (k) => localStorage.removeItem(`${DB_PREFIX}${k}`)
};

let currentUser = DB.getObj('currentUser');
const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

// Initialize Database Arrays if empty
if (!localStorage.getItem(`${DB_PREFIX}users`)) DB.set('users', []);
if (!localStorage.getItem(`${DB_PREFIX}posts`)) DB.set('posts', []); = 'snap_pro_v9_';
const DB = {
    get: (k) => JSON.parse(localStorage.getItem(`${DB_PREFIX}${k}`)) || [],
    set: (k, v) => localStorage.setItem(`${DB_PREFIX}${k}`, JSON.stringify(v)),
    getObj: (k) => JSON.parse(localStorage.getItem(`${DB_PREFIX}${k}`)) || null,
    setObj: (k, v) => localStorage.setItem(`${DB_PREFIX}${k}`, JSON.stringify(v)),
    remove: (k) => localStorage.removeItem(`${DB_PREFIX}${k}`)
};
let currentUser = DB.getObj('currentUser');
const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
