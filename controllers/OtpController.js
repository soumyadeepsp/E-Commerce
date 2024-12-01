import { sendEmail } from "../Utilities/HelperFunctions.js";
import { sendSms, generateRandomOtp } from "../Utilities/HelperFunctions.js";
import { User } from "../schemas/userSchema.js";
import { Otp } from "../schemas/otpSchema.js";

export const sendSmsController = async (req, res) => {
    try {
        // same controller sends OTP to multiple users and also just the signed in user
        const OTP = generateRandomOtp();
        console.log(OTP);
        let phoneNumbers = req.body.phoneNumbers;
        if (!phoneNumbers || phoneNumbers.length==0) {
            const jwt = req.cookies.auth_token;
            const user = await User.findOne({sessionToken: jwt});
            phoneNumbers = [user.mobile];
            const otp = new Otp({jwt, otp: OTP});
            await otp.save();
            setTimeout(async () => {
                await Otp.findOneAndDelete({jwt});
            }, 30000);
        }
        const response = await sendSms(phoneNumbers, OTP);
        if (!response.success) {
            return res.status(500).send(response.message);
        } else {
            return res.status(200).send(response.message);
        }
    } catch(err) {
        console.log(err);
        return res.status(500).send('There is some server error, please try in some other time');
    }
}

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

export const verifyOtpController = async (req, res) => {
    try {
        const otp = req.params.otp;
        const jwt = req.cookies.auth_token;
        const otpData = await Otp.findOne({jwt});
        if (!otpData) {
            return res.status(400).send('Invalid OTP or OTP expired');
        }
        if (otpData.otp!=otp) {
            return res.status(400).send('Invalid OTP');
        }
        await User.findOneAndUpdate({sessionToken: jwt}, {verifiedMobile: true});
        await Otp.findOneAndDelete({jwt});
        return res.status(200).send('OTP verified successfully');
    } catch(err) {
        console.log(err);
        return res.status(500).send('There is some server error, please try in some other time');
    }
}