import { transporter } from '../config/nodemailer.js';
import bcrypt from 'bcrypt';
import { ProductTokens } from '../schemas/productTokens.js';

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
        const API_KEY = "TbQDydw9pFqAl42YNrKX5v78nkBgPiEHo1cexMtWGVCjUZusL09YwKrT32hjSkzPZO5NBApRV8suMLqG";
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

export const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

export function removeSpecialCharacters(str) {
    // Regular expression to match all non-alphanumeric characters except spaces
    return str.replace(/[^a-zA-Z0-9 ]/g, '');
}

export const findMatchingProducts = async (searchQuery, productTokens=null, limit) => {
    searchQuery = searchQuery.replaceAll('+', ' ');
    searchQuery = removeSpecialCharacters(searchQuery).toLowerCase();
    const searchTokens = searchQuery.split(' ');
    if (!productTokens) {
        productTokens = await ProductTokens.find({});
    }
    const tokenMatchingScore = [];
    productTokens.map((productToken) => {
        let score = 0;
        productToken.tokenArray.map((token) => {
            if (searchTokens.includes(token)) {
                score++;
            }
        });
        tokenMatchingScore.push({productId: productToken.productId, score});
    });
    tokenMatchingScore.sort((a, b) => {
        return b.score - a.score;
    });
    if (tokenMatchingScore[0]==0) {
        // if the score of the first product is 0, then no product matched as all the products will have a score of 0
        return [];
    }
    const selectedProducts = tokenMatchingScore.slice(0, limit);
    return selectedProducts;
}

export const getTokensOfAProduct = (doc) => {
    let name = removeSpecialCharacters(doc.name).toLowerCase();
    let brand = removeSpecialCharacters(doc.brand).toLowerCase();
    let description = removeSpecialCharacters(doc.description).toLowerCase();
    const tokenArray = name.split(" ").concat(brand.split(" "), description.split(" "));
    return tokenArray;
}