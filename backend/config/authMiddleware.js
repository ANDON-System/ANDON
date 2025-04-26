const jwt = require("jsonwebtoken");

const authMiddleware = (role) => {
    return (req, res, next) => {
        const token = req.header("Authorization");
        if (!token) return res.status(401).json({ message: "Access Denied" });

        try {
            const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET); // Split to get the token part
            if (role && decoded.role !== role)
                return res.status(403).json({ message: "Access Forbidden" });

            req.user = decoded; // Set the user information
            console.log("Authenticated User:", req.user); // Log the authenticated user
            next();
        } catch (err) {
            console.error("Token verification error:", err); // Log the error
            res.status(400).json({ message: "Invalid Token" });
        }
    };
};

module.exports = authMiddleware;