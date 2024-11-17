import { User } from '../schemas/userSchema.js';
import jwt from 'jsonwebtoken';

export const isUserSignedin = async (req, res, next) => {
    try {
        const token = req.cookies.auth_token;
        const decoded = jwt.verify(token, 'MY-E-COMMERCE-TOKEN-SECRET');
        console.log(decoded);
        const userId = decoded.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).send('User not found');
        }
        console.log(user);
        if (user.sessionToken==token) {
            next();
        } else {
            return res.status(400).send('Please sign in');
        }
    } catch(err) {
        console.log(err);
        return res.status(500).send('There is some server error, please try in some other time');
    }
}