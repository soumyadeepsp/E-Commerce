import { sendEmail } from "../Utilities/HelperFunctions.js";

export const sendEmailController = async (req, res) => {
    try {
        const { emails, subject, message } = req.body;
        for (let i=0; i<emails.length; i++) {
            await sendEmail(emails[i], subject, message);
        }
        return res.status(200).send('Email sent successfully');
    } catch(err) {
        console.log(err);
        return res.status(500).send('There is some server error, please try in some other time');
    }
}