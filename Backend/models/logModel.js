import mongoose from "mongoose";

const logSchema = new mongoose.Schema(
    {
        method: { type: String },
        route: { type: String },
        statusCode: { type: Number },
        user: {
            id: { type: mongoose.Schema.Types.ObjectId, ref: "Staff" },
            name: { type: String },
            role: { type: String },
        },
        ip: { type: String },
        responseTime: { type: Number },
    },
    { timestamps: true } // adds createdAt and updatedAt
);

const Log = mongoose.model("Log", logSchema);
export default Log;
