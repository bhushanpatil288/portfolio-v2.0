import nodemailer from 'nodemailer';
import asyncWrapper from '../middleware/asyncWrapper.js';
import { ApiError } from '../utils/ApiError.js';

export const sendContactMessage = asyncWrapper(async (req, res) => {
  const { name, email, subject, message } = req.body;
  
  if (!name || !email || !subject || !message) {
    throw new ApiError(400, 'All fields are required');
  }

  const hasCredentials = process.env.EMAIL_USER && process.env.EMAIL_PASS && process.env.EMAIL_USER !== 'test@portfolio.dev';

  if (hasCredentials) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: process.env.EMAIL_USER,
      subject: `Portfolio Contact: ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    };

    await transporter.sendMail(mailOptions);
  } else {
    console.log('--- Mock Contact Form Submission ---');
    console.log(`From: ${name} (${email})`);
    console.log(`Subject: ${subject}`);
    console.log(`Message: ${message}`);
    console.log('------------------------------------');
  }

  res.status(200).json({
    success: true,
    message: 'Message sent successfully!'
  });
});
