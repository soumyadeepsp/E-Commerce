import { transporter } from '../config/nodemailer.js';

export const sendEmail = async (emails, subject, message) => {
    // Define email options
    const mailOptions = {
        from: 'cncoding5@gmail.com', // Sender address
        to: emails, // List of recipients
        subject: subject, // Subject line
        text: message, // Plain text body
        // html: `<b>${message}</b>` // HTML body
    };
    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.error('Error sending email:', error);
        }
        console.log('Email sent:', info.response);
    });
}

export const generateRandomOtp = () => {
    return Math.floor(1000 + Math.random() * 9000);
}

export const sendSms = async (mobiles, otp) => {
    try {
        // https://www.fast2sms.com/dev/bulkV2?authorization=YOUR_API_KEY&variables_values=5599&route=otp&numbers=9999999999,8888888888,7777777777
        const API_KEY = "";
        const response = await fetch(`https://www.fast2sms.com/dev/bulkV2?authorization=${API_KEY}&variables_values=${otp}&route=otp&numbers=${mobiles.join(',')}`, {
            method: 'GET',
        });
        const data = await response.json();
        console.log(data);
        return { success: true, message: 'SMS sent successfully' };
    } catch(err) {
        console.log(err);
        return { success: false, message: 'There is some server error, please try in some other time' };
    }
}