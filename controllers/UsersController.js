import { User } from '../schemas/userSchema.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const signup = async (req, res) => {
    try {
        const data = req.body;
        const isUserPresent = await User.findOne({email: data.email});
        if (isUserPresent) {
            return res.status(400).send('User already exists');
        }
        const newUser = new User(data);
        await newUser.save();
        return res.status(201).send('User added successfully');
    } catch(err) {
        console.log(err);
        return res.status(500).send('There is some server error, please try in some other time');
    }
};

export const signin = async (req, res) => {
    try {
        const data = req.body;
        const storedUser = await User.findOne({email: data.email});
        if (!storedUser) {
            return res.status(400).send('Email or password not matching');
        }
        const isPasswordCorrect = await bcrypt.compare(data.password, storedUser.password);
        if (!isPasswordCorrect) {
            return res.status(400).send('Email or password not matching');
        }
        console.log(isPasswordCorrect);
        const token = jwt.sign({ userId: storedUser._id }, 'MY-E-COMMERCE-TOKEN-SECRET', { expiresIn: '1d' });
        console.log(token);
        const user = await User.findByIdAndUpdate(storedUser._id, {sessionToken: token});
        await user.save();
        res.cookie('auth_token', token, { httpOnly: true, maxAge: 3600000 });
        return res.status(200).send(JSON.stringify({ success: true, message: 'User logged in successfully', token: token }));
    } catch(err) {
        console.log(err);
        return res.status(500).send(JSON.stringify({ success: false, message: 'There is some server error, please try in some other time' }));
    }
}

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzM4NmU2ZTZjM2I2YTVmNmRiZDY4NzAiLCJpYXQiOjE3MzE4MzU5ODcsImV4cCI6MTczMTkyMjM4N30.yB3RVDgKQtjDkI4XcgPVRC_yDu459QIvUBTBRBrkIG4
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzM4NmU2ZTZjM2I2YTVmNmRiZDY4NzAiLCJpYXQiOjE3MzE4MzU4NTMsImV4cCI6MTczMTkyMjI1M30.VAjqh-dxrsDg3dkoadxJepKTEvpNLRiw2p4rp1WAuEE