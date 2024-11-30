import { sendSms, generateRandomOtp } from "../Utilities/HelperFunctions.js";

export const sendSmsController = async (req, res) => {
    try {
        const { phoneNumbers } = req.body;
        const OTP = generateRandomOtp();
        console.log(OTP);
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