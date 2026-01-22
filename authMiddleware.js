const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // Get token from the header
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Adds user info (id, role) to the request
        next(); // Move to the next function
    } catch (err) {
        res.status(401).json({ message: "Token is not valid" });
    }
};
