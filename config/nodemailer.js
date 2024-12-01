import nodemailer from 'nodemailer';
import { google } from 'googleapis';

const OAuth2 = google.auth.OAuth2;

// Create a transporter object using the default SMTP transport
export const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // Replace with your SMTP server
    port: 587, // Replace with your SMTP port
    secure: false, // true for 465, false for other ports
    auth: { // sender email id credentials
        user: 'cncoding5@gmail.com', // Replace with your email
        pass: '' // Replace with your email password
    }
});

// Verify connection configuration
// checking if the nodejs application is able to make the connection
// with your sender email id 
transporter.verify((error, success) => {
    if (error) {
        console.error('Error configuring transporter:', error);
    } else {
        console.log('Transporter configured successfully');
    }
});
