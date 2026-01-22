document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem('token');
    
    // If no badge is found, kick them back to the welcome page
    if (!token) {
        alert("Access Denied. Please Login.");
        window.location.href = 'welcome.html';
    }
});

function logout() {
    localStorage.removeItem('token');
    window.location.href = 'welcome.html';
}