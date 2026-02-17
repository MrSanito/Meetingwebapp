import sgMail from '@sendgrid/mail';

const apiKey = process.env.SENDGRID_API_KEY;

if (apiKey) {
    sgMail.setApiKey(apiKey);
} else {
    console.warn("SendGrid API Key not found in environment variables.");
}

export const sendEmail = async (to: string, subject: string, text: string) => {
    try {
        if (!apiKey) {
            console.warn("Skipping email: SendGrid API Key missing.");
            return;
        }

        const msg = {
            to,
            from: '1988krishnani@gmail.com',
            subject,
            text,
        };

        const response = await sgMail.send(msg);
        console.log("Email sent successfully status code:", response[0].statusCode);
    } catch (error: any) {
        console.error("Error sending email via SendGrid:", error);
        if (error.response) {
            console.error(error.response.body);
        }
    }
};
