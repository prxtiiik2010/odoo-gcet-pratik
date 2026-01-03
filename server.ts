// Express backend server for Dayflow HR Suite
// Run this with: node server.js or ts-node server.ts

import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.BACKEND_PORT || 5000;

// Middleware
app.use(cors({
  origin: '*', // Allow all origins for now
  credentials: true,
}));
app.use(express.json());

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Test email configuration on startup
console.log(`📧 Testing email with: ${process.env.EMAIL_USER}`);
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email authentication failed:', error.message);
  } else {
    console.log('✅ Email service is ready');
  }
});

// Health check endpoint
app.get('/health', (req: express.Request, res: express.Response) => {
  res.json({ status: 'Backend server is running', timestamp: new Date().toISOString() });
});

// Test email endpoint
app.get('/test-email', async (req: express.Request, res: express.Response) => {
  try {
    console.log('\n🧪 Test Email Request');
    const testEmail = 'shahdevansh387@gmail.com';
    const testOTP = '123456';
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || `Dayflow HR Suite <${process.env.EMAIL_USER}>`,
      to: testEmail,
      subject: '🧪 Test OTP - Dayflow HR Suite',
      text: `Test OTP: ${testOTP}`,
      html: `<h2>Test OTP</h2><p>Your test OTP: <strong>${testOTP}</strong></p>`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Test email sent! Message ID: ${info.messageId}`);
    
    res.json({
      success: true,
      message: 'Test email sent successfully!',
      messageId: info.messageId,
    });
  } catch (error) {
    console.error('❌ Test email failed:', error);
    res.status(500).json({
      success: false,
      message: 'Test email failed',
      error: (error as Error).message,
    });
  }
});

// Send OTP Email endpoint
app.post('/api/send-otp-email', async (req: express.Request, res: express.Response) => {
  try {
    const { email, otp, userName } = req.body;
    
    console.log(`\n📧 OTP Email Request Received:`);
    console.log(`   To: ${email}`);
    console.log(`   OTP: ${otp}`);
    console.log(`   User: ${userName}`);

    // Validate inputs
    if (!email || !otp) {
      console.error('❌ Missing email or OTP');
      return res.status(400).json({ 
        success: false, 
        message: 'Email and OTP are required' 
      });
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || `Dayflow HR Suite <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your Dayflow HR Suite OTP Code',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: 'Segoe UI', Arial, sans-serif; color: #333; line-height: 1.6; }
              .container { max-width: 600px; margin: 0 auto; padding: 0; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px; text-align: center; }
              .header h1 { margin: 0; font-size: 28px; }
              .header p { margin: 5px 0 0 0; font-size: 14px; opacity: 0.9; }
              .content { padding: 30px 20px; background: #ffffff; }
              .otp-section { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
              .otp-code { 
                background: white; 
                border: 2px solid #667eea; 
                padding: 20px; 
                text-align: center; 
                font-size: 36px; 
                font-weight: bold; 
                letter-spacing: 8px; 
                border-radius: 8px;
                margin: 15px 0;
                color: #667eea;
                font-family: 'Courier New', monospace;
              }
              .info { background: #e7f3ff; border-left: 4px solid #2196F3; padding: 12px; border-radius: 4px; margin: 15px 0; font-size: 14px; }
              .footer { background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666; }
              .divider { border: none; border-top: 1px solid #ddd; margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🔐 Dayflow HR Suite</h1>
                <p>Your One-Time Password</p>
              </div>
              
              <div class="content">
                <p>Hi ${userName || 'User'},</p>
                <p>Your One-Time Password (OTP) for Dayflow HR Suite is:</p>
                
                <div class="otp-section">
                  <div class="otp-code">${otp}</div>
                  <p style="text-align: center; color: #d32f2f; font-weight: bold; margin: 0;">⏱️ Expires in 2 minutes</p>
                </div>
                
                <p>Please enter this code in the application to complete your sign-in process.</p>
                
                <div class="info">
                  <strong>🛡️ Security Notice:</strong> Never share this code with anyone. Dayflow HR will never ask for your OTP via email or phone.
                </div>
                
                <hr class="divider">
                
                <p style="color: #666; font-size: 13px;">
                  If you didn't request this OTP, your account may have been compromised. 
                  Please reset your password immediately or contact our support team.
                </p>
              </div>
              
              <div class="footer">
                <p style="margin: 0 0 10px 0;">© 2025 Dayflow HR Suite. All rights reserved.</p>
                <p style="margin: 0;">This is an automated message. Please do not reply to this email.</p>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `Your OTP code is: ${otp}\n\nThis code will expire in 2 minutes.\n\nDo not share this code with anyone.\n\nIf you didn't request this OTP, please contact support immediately.`,
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log(`✅ Email sent to ${email}. Message ID: ${info.messageId}`);
    
    res.json({
      success: true,
      message: 'OTP email sent successfully',
      messageId: info.messageId,
    });

  } catch (error) {
    console.error('❌ Error sending email:', error);
    
    res.status(500).json({
      success: false,
      message: 'Failed to send OTP email',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Server error',
    });
  }
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
});

// 404 handler
app.use((req: express.Request, res: express.Response) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📧 Email service configured with: ${process.env.EMAIL_USER || 'default'}`);
  console.log(`🔗 CORS enabled for: http://localhost:5173, http://localhost:3000, http://localhost:8080`);
});
