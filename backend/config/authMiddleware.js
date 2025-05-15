const jwt = require("jsonwebtoken");

const authMiddleware = (roles) => {
    return (req, res, next) => {
        const token = req.header("Authorization");
        if (!token) return res.status(401).json({ message: "Access Denied" });

        try {
            const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
            if (Array.isArray(roles) && !roles.includes(decoded.role)) {
                return res.status(403).json({ message: "Access Forbidden" });
            }

            req.user = decoded;
            console.log("Authenticated User:", req.user);
            next();
        } catch (err) {
            console.error("Token verification error:", err);
            res.status(400).json({ message: "Invalid Token" });
        }
    };
};


module.exports = authMiddleware;