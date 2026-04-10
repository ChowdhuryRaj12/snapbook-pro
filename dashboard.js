// dashboard.js
async function loadDashboard() {
    let posts = await DB.getAll("posts");
    let myPosts = posts.filter(p => p.userId === currentUser.id);
    
    let totalLikes = 0;
    myPosts.forEach(p => totalLikes += p.likes);
    
    // Auto calculate views and earnings based on posts and likes (Mock Logic)
    let totalViews = myPosts.length * 150 + totalLikes * 10; 
    let earnings = (totalViews * 0.005).toFixed(2); // $0.005 per view logic

    document.getElementById('dash-likes').innerText = totalLikes;
    document.getElementById('dash-views').innerText = totalViews;
    document.getElementById('dash-followers').innerText = (totalLikes * 2); // Mock followers
    document.getElementById('dash-earnings').innerText = "$" + earnings;

    // Update to DB
    currentUser.likes = totalLikes;
    currentUser.views = totalViews;
    currentUser.earnings = parseFloat(earnings);
    await DB.add("users", currentUser);
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
}
