import React from "react";
import api from "../api/axiosInstance";
import { FileDown } from "lucide-react";

const ExportLogsButton: React.FC = () => {
    const handleExport = async () => {
        try {
            const response = await api.get("/logs/export/pdf", {
                responseType: "blob",
            });
            console.log(response);
            const blob = new Blob([response.data], { type: "application/pdf" });
            console.log(blob);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "api-logs-report.pdf";
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Error exporting logs:", err);
            alert("❌ Failed to generate PDF report.");
        }
    };

    return (
        <button
            onClick={handleExport}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-md transition"
        >
            <FileDown size={18} /> Export Logs as PDF
        </button>
    );
};

export default ExportLogsButton;
