// db.js - IndexedDB Wrapper for Unlimited Storage
const DB_NAME = "SnapbookProDB";
const DB_VERSION = 1;

const initDB = () => {
    return new Promise((resolve, reject) => {
        let request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onupgradeneeded = (e) => {
            let db = e.target.result;
            if (!db.objectStoreNames.contains("users")) db.createObjectStore("users", { keyPath: "id" });
            if (!db.objectStoreNames.contains("posts")) db.createObjectStore("posts", { keyPath: "id" });
            if (!db.objectStoreNames.contains("messages")) db.createObjectStore("messages", { keyPath: "id" });
            if (!db.objectStoreNames.contains("notifications")) db.createObjectStore("notifications", { keyPath: "id" });
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};

const DB = {
    async add(storeName, data) {
        let db = await initDB();
        let tx = db.transaction(storeName, "readwrite");
        tx.objectStore(storeName).put(data);
        return tx.complete;
    },
    async getAll(storeName) {
        let db = await initDB();
        return new Promise(resolve => {
            let req = db.transaction(storeName, "readonly").objectStore(storeName).getAll();
            req.onsuccess = () => resolve(req.result);
        });
    },
    async getById(storeName, id) {
        let db = await initDB();
        return new Promise(resolve => {
            let req = db.transaction(storeName, "readonly").objectStore(storeName).get(id);
            req.onsuccess = () => resolve(req.result);
        });
    }
};

let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
