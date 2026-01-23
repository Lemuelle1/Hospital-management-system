// SAFE LOGIN HANDLER
const loginForm = document.getElementById("loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const username = document.getElementById("username")?.value;
        const password = document.getElementById("password")?.value;

        if (!username || !password) {
            alert("Please fill in all fields");
            return;
        }

        // TEMPORARY DEMO LOGIN (to be replaced with backend)
        if (username === "user" && password === "pass") {
            window.location.href = "dashboard.html";
        } else {
            alert("Invalid login credentials");
        }
    });
}

// SAFE APPOINTMENT HANDLER
const appointmentForm = document.getElementById("appointmentForm");
if (appointmentForm) {
    appointmentForm.addEventListener("submit", function (e) {
        e.preventDefault();
        alert("Appointment submitted (demo)");
    });
}

// SAFE BILLING HANDLER
const billForm = document.getElementById("billForm");
if (billForm) {
    billForm.addEventListener("submit", function (e) {
        e.preventDefault();
        alert("Bill generated (demo)");
    });
}
