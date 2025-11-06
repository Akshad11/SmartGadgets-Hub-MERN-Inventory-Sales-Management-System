const adminOnly = (req, res, next) => {
    try {
        if (req.user && req.user.role === "admin") {
            next();
        } else {
            res.status(403).json({ message: "Access denied: Admins only" });
        }
    } catch (error) {
        console.error("Admin check error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export { adminOnly };
