const DB_NAME = "SnapbookProDB";
const DB_VERSION = 2; // Updated Version

const initDB = () => {
    return new Promise((resolve, reject) => {
        let request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onupgradeneeded = (e) => {
            let db = e.target.result;
            if (!db.objectStoreNames.contains("users")) db.createObjectStore("users", { keyPath: "id" });
            if (!db.objectStoreNames.contains("posts")) db.createObjectStore("posts", { keyPath: "id" });
            if (!db.objectStoreNames.contains("stories")) db.createObjectStore("stories", { keyPath: "id" }); // New
            if (!db.objectStoreNames.contains("messages")) db.createObjectStore("messages", { keyPath: "id" });
            if (!db.objectStoreNames.contains("notifications")) db.createObjectStore("notifications", { keyPath: "id" });
        };
        request.onsuccess = () => resolve(request.result);
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
    async delete(storeName, id) {
        let db = await initDB();
        db.transaction(storeName, "readwrite").objectStore(storeName).delete(id);
    }
};

// 📁 Image Compression Function (Reduces Base64 Size)
function compressImage(file, callback) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = event => {
        let img = new Image();
        img.src = event.target.result;
        img.onload = () => {
            let canvas = document.createElement('canvas');
            let ctx = canvas.getContext('2d');
            let maxWidth = 800; // Resize width
            let scaleSize = maxWidth / img.width;
            canvas.width = maxWidth;
            canvas.height = img.height * scaleSize;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            callback(canvas.toDataURL('image/jpeg', 0.7)); // 70% Quality
        };
    };
}
