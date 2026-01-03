// Email OTP Service
// Sends OTP codes via email through backend API

export interface EmailOTPResponse {
  success: boolean;
  message: string;
  messageId?: string;
  isDemoMode?: boolean;
}

interface EmailConfig {
  lastSentEmail?: string;
  lastSentTime?: Date;
  demoMode?: boolean;
}

const emailConfig: EmailConfig = {};

/**
 * Send OTP via email
 * Calls backend API to send actual emails via Gmail/Nodemailer
 */
export async function sendOTPEmail(
  email: string,
  otp: string,
  name: string = 'User'
): Promise<EmailOTPResponse> {
  try {
    const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    console.log(`📧 Email OTP Debug:`);
    console.log(`   Email: ${email}`);
    console.log(`   OTP: ${otp}`);
    console.log(`   Name: ${name}`);
    console.log(`   Backend URL: ${backendUrl}`);
    console.log(`   Sending request...`);

    const body = {
      email,
      otp,
      userName: name,
    };
    
    console.log(`   Request body:`, body);

    const response = await fetch(`${backendUrl}/api/send-otp-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    console.log(`   Response status: ${response.status}`);
    
    const data = await response.json();
    
    console.log(`   Response data:`, data);

    if (!response.ok) {
      throw new Error(data.message || `Email service error: ${response.statusText}`);
    }

    updateEmailConfig({
      lastSentEmail: email,
      lastSentTime: new Date(),
      demoMode: false,
    });

    console.log('✅ OTP email sent successfully!');

    return {
      success: data.success,
      message: data.message || 'OTP sent successfully! Check your email.',
      messageId: data.messageId,
      isDemoMode: false,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to send OTP email';
    console.error('❌ Error sending OTP email:', error);

    // Provide helpful error messages
    let userMessage = errorMessage;
    if (
      errorMessage.includes('ECONNREFUSED') ||
      errorMessage.includes('Failed to fetch')
    ) {
      userMessage = 'Backend server not running. Please start: npm run server';
    }

    return {
      success: false,
      message: `Error: ${userMessage}`,
      isDemoMode: false,
    };
  }
}

/**
 * Get email OTP status
 */
export function getEmailOTPStatus(): string {
  return '📧 Email OTP Service Active';
}

/**
 * Update email configuration
 */
export function updateEmailConfig(config: Partial<EmailConfig>): void {
  Object.assign(emailConfig, config);
  console.log('✅ Email config updated:', emailConfig);
}
