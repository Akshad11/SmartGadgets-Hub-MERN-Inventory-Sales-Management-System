import Log from "../models/logModel.js";

export const requestLogger = async (req, res, next) => {
    const start = Date.now();

    res.on("finish", async () => {
        try {
            const duration = Date.now() - start;

            const log = {
                method: req.method,
                route: req.originalUrl,
                statusCode: res.statusCode,
                ip: req.ip,
                responseTime: duration,
            };

            // If user is logged in (JWT middleware adds req.user)
            if (req.user) {
                log.user = {
                    id: req.user._id,
                    name: req.user.name || "Unknown",
                    role: req.user.role,
                };
            }

            await Log.create(log); // Save log to MongoDB
        } catch (error) {
            console.error("Logger error:", error.message);
        }
    });

    next();
};
