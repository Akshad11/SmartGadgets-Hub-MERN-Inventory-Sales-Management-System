import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail", // OR use SMTP for production
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Reusable email function
export const sendEmail = async ({ to, subject, html }) => {
    try {
        await transporter.sendMail({
            from: `"SmartGadgets Hub" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
        });

        console.log(`📧 Email sent to ${to}`);
    } catch (error) {
        console.error("Email Error:", error);
    }
};
