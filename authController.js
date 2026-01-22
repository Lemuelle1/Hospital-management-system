// authController.js
const bcrypt = require('bcryptjs');
const db = require('../config/db'); // Database connection from Member 2

exports.registerPatient = async (req, res) => {
    try {
        // 1. Capture data from your HTML form fields
        const { username, email, phone, password } = req.body;

        // 2. Check if user already exists
        const [existingUser] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: "Email already registered" });
        }

        // 3. Hash the password (Security requirement for Member 3)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. Save to Database (Role is hardcoded as 'patient' for this page)
        const sql = 'INSERT INTO users (username, email, phone, password, role) VALUES (?, ?, ?, ?, ?)';
        await db.execute(sql, [username, email, phone, hashedPassword, 'patient']);

        res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const jwt = require('jsonwebtoken'); // You'll need to install this: npm install jsonwebtoken

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Check if user exists
        const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(401).json({ message: "Invalid Email or Password" });
        }

        const user = users[0];

        // 2. Compare the password provided with the hashed password in DB
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid Email or Password" });
        }

        // 3. Create a JWT Token (The "Digital Badge")
        // We include the user's ID and Role so the app knows where to send them
        const token = jwt.sign(
            { id: user.id, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );

        // 4. Send the token and user info back to the frontend
        res.status(200).json({
            message: "Login successful",
            token: token,
            role: user.role // Helps frontend decide which dashboard to show
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// authController.js (Update)
exports.staffLogin = async (req, res) => {
    try {
        const { email, password, role } = req.body; // 'role' comes from the <select> tag

        // 1. Find user by email AND role (Security check)
        const [users] = await db.execute('SELECT * FROM users WHERE email = ? AND role = ?', [email, role]);
        
        if (users.length === 0) {
            return res.status(401).json({ message: "Invalid credentials for the selected role." });
        }

        const user = users[0];

        // 2. Password Verification
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid Password" });
        }

        // 3. Generate Token with Role permissions
        const token = jwt.sign(
            { id: user.id, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '2h' }
        );

        res.status(200).json({
            token,
            role: user.role,
            redirectUrl: /${user.role}-dashboard.html // Dynamic-redirect-path
        });

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};