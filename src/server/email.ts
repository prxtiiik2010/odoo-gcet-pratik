// Backend Email Service using Node.js and Nodemailer
// This file should be run as a separate backend server

import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Configure your email service
// For Gmail: Use App Password (https://myaccount.google.com/apppasswords)
// For SendGrid/Other: Use their SMTP credentials

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'your-app-password',
  },
});

/**
 * Send OTP Email
 */
export async function sendOTPEmail(
  recipientEmail: string,
  otp: string,
  userName: string = 'User'
): Promise<boolean> {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'Dayflow HR Suite <noreply@dayflow-hr.com>',
      to: recipientEmail,
      subject: 'Your Dayflow HR Suite OTP Code',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; }
              .content { background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; }
              .otp-code { 
                background: white; 
                border: 2px solid #667eea; 
                padding: 15px; 
                text-align: center; 
                font-size: 32px; 
                font-weight: bold; 
                letter-spacing: 5px; 
                border-radius: 8px;
                margin: 20px 0;
                color: #667eea;
              }
              .footer { color: #666; font-size: 12px; text-align: center; margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🔐 Dayflow HR Suite</h1>
                <p>Your OTP Code</p>
              </div>
              
              <div class="content">
                <p>Hi ${userName},</p>
                <p>Your One-Time Password (OTP) for Dayflow HR Suite is:</p>
                
                <div class="otp-code">${otp}</div>
                
                <p><strong>⏱️ This code will expire in 2 minutes.</strong></p>
                <p>Please enter this code in the application to complete your sign-in.</p>
                
                <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                
                <p style="color: #666; font-size: 14px;">
                  If you didn't request this OTP, please ignore this email. 
                  Your account remains secure.
                </p>
              </div>
              
              <div class="footer">
                <p>© 2026 Dayflow HR Suite. All rights reserved.</p>
                <p>This is an automated message, please do not reply to this email.</p>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `Your OTP code is: ${otp}\n\nThis code will expire in 2 minutes.\n\nDo not share this code with anyone.`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent successfully to ${recipientEmail}. Message ID: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending email:', error);
    return false;
  }
}

// Test the email service
async function testEmailService() {
  console.log('🧪 Testing email service...');
  const result = await sendOTPEmail('test@example.com', '123456', 'Test User');
  if (result) {
    console.log('✅ Email service is working!');
  } else {
    console.log('❌ Email service failed. Check your credentials.');
  }
}

// Uncomment to test
// testEmailService();
