import Log from "../models/logModel.js";
import PDFDocument from "pdfkit";

export const getExportPDF = async (req, res) => {
    try {
        // Only admins allowed
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied: Admins only" });
        }

        // Fetch recent logs
        const logs = await Log.find().sort({ createdAt: -1 }).limit(200);

        // Initialize PDF
        const doc = new PDFDocument({ margin: 50, size: "A4" });

        // ✅ Set headers BEFORE piping
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "attachment; filename=api-logs-report.pdf");

        // Pipe document to response
        doc.pipe(res);

        // Optional: Handle PDF stream errors
        doc.on("error", (err) => {
            console.error("PDF generation error:", err.message);
            if (!res.headersSent) {
                res.status(500).json({ message: "Error generating PDF" });
            }
        });

        // Title
        doc
            .fontSize(22)
            .fillColor("#1f2937")
            .text("📊 API Logs Report", { align: "center" })
            .moveDown(0.5);

        // Subheader
        doc
            .fontSize(10)
            .fillColor("#6b7280")
            .text(`Generated on: ${new Date().toLocaleString()}`, { align: "center" })
            .moveDown(1.5);

        // Table header
        doc
            .fontSize(12)
            .fillColor("#111827")
            .text("Method", 50, doc.y, { continued: true })
            .text("Route", 120, doc.y, { continued: true })
            .text("Status", 300, doc.y, { continued: true })
            .text("User", 360, doc.y, { continued: true })
            .text("Response (ms)", 460, doc.y)
            .moveDown(0.3);

        doc
            .moveTo(50, doc.y)
            .lineTo(550, doc.y)
            .strokeColor("#9ca3af")
            .stroke();

        doc.moveDown(0.5);

        // Table rows
        logs.forEach((log, index) => {
            const y = doc.y;
            const bg = index % 2 === 0 ? "#f9fafb" : "#ffffff";

            // Background striping
            doc.save().rect(50, y - 2, 500, 20).fill(bg).restore();

            // Text
            doc
                .fillColor("#111827")
                .fontSize(10)
                .text(log.method || "-", 55, y, { width: 60 })
                .text(log.route || "-", 120, y, { width: 180 })
                .text(log.statusCode || "-", 300, y, { width: 50 })
                .text(log.user?.name || "Guest", 360, y, { width: 90 })
                .text(log.responseTime ? `${log.responseTime} ms` : "-", 460, y);

            doc.moveDown(1.2);

            // Prevent overflow
            if (doc.y > 750) doc.addPage();
        });

        // Footer
        doc.moveDown(2);
        doc
            .fontSize(10)
            .fillColor("#6b7280")
            .text("SmartGadgets Hub © 2025", { align: "center" });

        // ✅ Properly end the PDF stream
        doc.end();
    } catch (error) {
        console.error("Error generating PDF:", error);
        if (!res.headersSent) {
            res.status(500).json({ message: "Failed to export logs" });
        }
    }
};

// 🧠 Get all logs (Admin only) with date filtering
export const getAllLogs = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied: Admins only" });
        }

        const { page = 1, limit = 20, user, route, startDate, endDate } = req.query;

        const query = {};

        // 🔍 User filter
        if (user) query["user.name"] = { $regex: new RegExp(user, "i") };

        // 🔍 Route filter
        if (route) query.route = { $regex: new RegExp(route, "i") };

        // 🗓️ Date range filter
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) {
                // include entire day by setting time to 23:59:59
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                query.createdAt.$lte = end;
            }
        }

        const logs = await Log.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));

        const total = await Log.countDocuments(query);

        res.status(200).json({
            total,
            page: Number(page),
            pages: Math.ceil(total / limit),
            filters: { user, route, startDate, endDate },
            logs,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
