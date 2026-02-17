import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
    }
});

export const sendEmail = async (to: string, subject: string, text: string) => {
    try {
        if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
            console.warn("Skipping email: Creds not set.");
            return;
        }

        const info = await transporter.sendMail({
            from: process.env.GMAIL_USER,
            to,
            subject,
            text
        });
        console.log("Email sent: " + info.response);
    } catch (error) {
        console.error("Error sending email:", error);
    }
};
