import React, { useState, useEffect } from 'react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, Clock, RefreshCw, Mail } from 'lucide-react';
import { otpGenerator } from '@/lib/otp';
import { sendOTPEmail, type EmailOTPResponse } from '@/lib/email-otp';

interface OTPVerificationProps {
  email: string;
  onVerified: () => void;
  onCancel: () => void;
}

export default function OTPVerification({ email, onVerified, onCancel }: OTPVerificationProps) {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
  const [currentOTP, setCurrentOTP] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [emailStatus, setEmailStatus] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  // Generate OTP and send email on mount
  useEffect(() => {
    const generateAndSendOTP = async () => {
      const { code } = otpGenerator.generateOTP(email);
      setCurrentOTP(code);
      
      // Send OTP via email
      setIsSendingEmail(true);
      const result: EmailOTPResponse = await sendOTPEmail(email, code);
      setEmailSent(result.success);
      setEmailStatus(result.message);
      setIsSendingEmail(false);
    };

    generateAndSendOTP();
  }, [email]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      const remaining = Math.floor(otpGenerator.getRemainingTime(email) / 1000);
      setTimeLeft(remaining);

      if (remaining <= 0) {
        setError('OTP has expired. Please request a new one.');
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, email]);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }

    setIsVerifying(true);
    setError('');

    // Simulate API verification delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const isValid = otpGenerator.verifyOTP(email, otp);

    if (isValid) {
      onVerified();
    } else {
      setError('Invalid OTP. Please check and try again.');
      setOtp('');
    }

    setIsVerifying(false);
  };

  const handleResendOTP = async () => {
    const { code } = otpGenerator.generateOTP(email);
    setCurrentOTP(code);
    setTimeLeft(120);
    setOtp('');
    setError('');
    
    // Send OTP via email again
    setIsSendingEmail(true);
    const result: EmailOTPResponse = await sendOTPEmail(email, code);
    setEmailSent(result.success);
    setEmailStatus(result.message);
    setIsSendingEmail(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Verify Your Email</h3>
        <p className="text-sm text-muted-foreground">
          We've sent a 6-digit OTP code to<br />
          <span className="font-medium text-foreground">{email}</span>
        </p>
      </div>

      {/* Email Status */}
      {isSendingEmail && (
        <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
          <AlertDescription className="text-center text-sm">
            📧 Sending OTP to your email...
          </AlertDescription>
        </Alert>
      )}

      {emailSent && !isSendingEmail && (
        <Alert className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
          <AlertDescription className="text-center text-sm text-green-700 dark:text-green-400">
            ✅ {emailStatus || 'OTP sent successfully to your email!'}
          </AlertDescription>
        </Alert>
      )}

      {!emailSent && !isSendingEmail && (
        <Alert variant="destructive">
          <AlertDescription className="text-center text-sm">
            ⚠️ {emailStatus || 'Failed to send OTP. Please try resending.'}
          </AlertDescription>
        </Alert>
      )}

      {/* OTP Input */}
      <div className="flex flex-col items-center space-y-4">
        <InputOTP
          maxLength={6}
          value={otp}
          onChange={(value) => {
            setOtp(value);
            setError('');
          }}
          disabled={isVerifying || timeLeft <= 0}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>

        {/* Timer */}
        <div className="flex items-center gap-2 text-sm">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <span className={timeLeft <= 30 ? 'text-destructive font-medium' : 'text-muted-foreground'}>
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Actions */}
      <div className="space-y-3">
        <Button
          onClick={handleVerify}
          className="w-full"
          disabled={isVerifying || otp.length !== 6 || timeLeft <= 0}
        >
          {isVerifying ? 'Verifying...' : 'Verify OTP'}
        </Button>

        <Button
          variant="outline"
          onClick={handleResendOTP}
          className="w-full"
          disabled={timeLeft > 90 || isSendingEmail} // Can resend after 30 seconds
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          {isSendingEmail ? 'Sending...' : 'Resend OTP'}
        </Button>

        <Button
          variant="ghost"
          onClick={onCancel}
          className="w-full"
        >
          Cancel
        </Button>
      </div>

      <p className="text-xs text-center text-muted-foreground">
        Didn't receive the code? Check your spam folder or resend in {Math.max(0, 30 - (120 - timeLeft))}s
      </p>
    </div>
  );
}
