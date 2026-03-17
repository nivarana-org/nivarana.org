import "server-only";

import { createTransport } from "nodemailer";

const transporter = createTransport({
    host: process.env.AUTH_MAIL_HOST as string,
    port: 587,
    secure: false,
    auth: {
        user: process.env.AUTH_MAIL_USER as string,
        pass: process.env.AUTH_MAIL_PASS as string,
    },
});

type SendMailProps = {
    to: string;
    subject: string;
    text: string;
};

export const sendEmail = async ({ to, subject, text }: SendMailProps) => {
    transporter.sendMail({
        from: `"Nivarana" <${process.env.AUTH_MAIL_USER}>`,
        to,
        subject,
        text,
    });
};
