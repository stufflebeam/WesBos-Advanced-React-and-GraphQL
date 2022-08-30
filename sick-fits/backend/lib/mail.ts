import { createTransport, getTestMessageUrl } from 'nodemailer';

const transport = createTransport({
    host: process.env.ETHEREAL_MAIL_HOST || process.env.MAIL_HOST,
    port: process.env.ETHEREAL_MAIL_PORT || process.env.MAIL_PORT,
    auth: {
        user: process.env.ETHEREAL_MAIL_USER || process.env.MAIL_USER,
        pass: process.env.ETHEREAL_MAIL_PASS || process.env.MAIL_PASS,
    },
});

const frontEndURL =
    process.env.SICKFITS_FRONTEND_URL || process.env.FRONTEND_URL;

function makeANiceEmail(text: string): string {
    return `
    <div className="email" style="
        border: 1px solid black;
        padding: 20px;
        font-family: sans-serif;
        line-height: 2;
        font-size: 20px;
    ">
        <h2>Hello There!</h2>
        <p>${text}</p>

        <p>😘, Sickfits</p>
    </div>
    `;
}

export interface MailResponse {
    accepted?: string[] | null;
    rejected?: null[] | null;
    envelopeTime: number;
    messageTime: number;
    messageSize: number;
    response: string;
    envelope: Envelope;
    messageId: string;
}
export interface Envelope {
    from: string;
    to?: string[] | null;
}

export async function sendPasswordResetEmail(
    resetToken: string,
    to: string
): Promise<void> {
    // email the user a token/link to reset their password
    const info = (await transport.sendMail({
        to,
        from: 'Sickfits <test@example.com>',
        subject: 'Reset your password on Sickfits',
        html: makeANiceEmail(`Please use the following link to reset your password:<br/>
        <a href="${frontEndURL}/reset?token=${resetToken}">Reset Password</a><br/>
        <br/>
        If, for some reason, you cannot click the link, copy and paste the following into your browser:<br/>
        ${frontEndURL}/reset?token=${resetToken} <br/>
        If you did not request this, please ignore this email and your password will remain unchanged.
        `),
    })) as MailResponse;

    // console.log('[mail] info:', info);
    // console.log('[mail] Message sent: %s', info.messageId);

    // Of course, being that we are currently using an environment variable called
    // ETHEREAL_MAIL_USER, this conditional is not really necessary. But, it's good
    // to have it in here for when I build in more robust environment switching.
    if (process.env.ETHEREAL_MAIL_USER.includes('ethereal.email')) {
        console.log(
            '[mail] 📧 Message Sent! Preview URL: %s',
            getTestMessageUrl(info)
        );
    }
}
