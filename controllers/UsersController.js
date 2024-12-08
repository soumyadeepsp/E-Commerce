import { User } from '../schemas/userSchema.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PasswordResetUrl } from '../schemas/passwordResetUrlSchema.js';
import { sendEmail, hashPassword } from '../Utilities/HelperFunctions.js';
import { Cart } from '../schemas/cartSchema.js';
import { Product } from '../schemas/productSchema.js';

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

export const signout = async (req, res) => {
    try {
        const jwt = req.cookies.auth_token;
        res.clearCookie('auth_token');
        await User.findOneAndUpdate({sessionToken: jwt}, {sessionToken: ''});
        return res.status(200).send('User logged out successfully');
    } catch(err) {
        console.log(err);
        return res.status(500).send('There is some server error, please try in some other time');
    }
}

export const sendResetPasswordUrl = async (req, res) => {
    try {
        const email = req.body.email;
        const user = await User.findOne({email});
        if (!user) {
            return res.status(400).send('There is no user with this email!');
        }
        const token = jwt.sign({ email: email }, 'MY-E-COMMERCE-TOKEN-SECRET', { expiresIn: '3m' });
        console.log(token);
        const resetUrl = `http://localhost:3000/users/reset-password/${token}`;
        await PasswordResetUrl.create({email, url: resetUrl});
        setTimeout(async () => {
            await PasswordResetUrl.findOneAndDelete({email, url: resetUrl});
        }, 1000 * 60 * 3);
        const message = `Click on the link to reset your password: ${resetUrl}. This link is valid for 10 minutes.`;
        await sendEmail(email, 'Reset Password', message);
        return res.status(200).send('Reset password link sent successfully');
    } catch (err) {
        console.log(err);
        return res.status(500).send('There is some server error, please try in some other time');
    }
}

export const updatePassword = async (req, res) => {
    try {
        const {password, confirmPassword, token} = req.body;
        if (password !== confirmPassword) {
            return res.status(400).send('Passwords do not match');
        }
        const tokenEntry = await PasswordResetUrl.findOne({url: 'http://localhost:3000/users/reset-password/'+token});
        if (!tokenEntry) {
            return res.status(400).send('Invalid token or your token has expired');
        }
        const decoded = jwt.verify(token, 'MY-E-COMMERCE-TOKEN-SECRET');
        const emailInToken = decoded.email;
        if (emailInToken !== tokenEntry.email) {
            return res.status(400).send('Invalid token');
        }
        const user = await User.findOne({email: emailInToken});
        user.password = password;
        await user.save();
        await PasswordResetUrl.findOneAndDelete({email: emailInToken});
        return res.status(200).send('Password updated successfully');
    } catch(err) {
        console.log(err);
        return res.status(500).send('There is some server error, please try in some other time');
    }
}

export const addToCart = async (req, res) => {
    // to be called only when you are authenticated
    try {
        const products = req.body.products;
        // console.log(req);
        // I am assuming that from FE, you will be sending an array of objects containing product ID, price, and quantity
        const userId = req.customData.userId;
        products.map(async (product) => {
            const productId = product.productId;
            const fetchedProduct = await Product.findOne({_id: productId});
            if (!fetchedProduct) {
                return res.status(400).send('Product not found');
            }
            if (product.price != fetchedProduct.price) {
                return res.status(400).send('Price of the product does not match');
            }
            if (product.quantity > fetchedProduct.countInStock) {
                return res.status(400).send(`Quantity of the product ${fetchedProduct.name} is only ${fetchedProduct.countInStock} left`);
            }
        })
        const cart = await Cart.findOne({userId});
        if (!cart) {
            await Cart.create({userId, products});
        } else {
            // always send the full cart object from FE even for the smallest update
            cart.products = products;
            await cart.save();
        }
        return res.status(200).send('Product added to cart successfully');
    } catch(err) {
        console.log(err);
        return res.status(500).send('There is some server error, please try in some other time');
    }
}

// $2b$10$NC9B4d.0YLueMhUJ22gtzunlzU6DfY.nup47wP08WEo2k2uJESA86
// $2b$10$dCPNnfU.HIcfudfhnHYkGeAVuVaeGblr9r75uErb4qaYxiUuQU1mm