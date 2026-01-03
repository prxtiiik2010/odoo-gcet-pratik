import React, { useState, useEffect } from 'react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, Clock, RefreshCw } from 'lucide-react';
import { otpGenerator } from '@/lib/otp';

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

  // Generate OTP on mount
  useEffect(() => {
    const { code } = otpGenerator.generateOTP(email);
    setCurrentOTP(code);
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

  const handleResendOTP = () => {
    const { code } = otpGenerator.generateOTP(email);
    setCurrentOTP(code);
    setTimeLeft(120);
    setOtp('');
    setError('');
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
          <CheckCircle2 className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Verify Your Identity</h3>
        <p className="text-sm text-muted-foreground">
          Enter the 6-digit OTP sent to<br />
          <span className="font-medium text-foreground">{email}</span>
        </p>
      </div>

      {/* Demo OTP Display */}
      <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
        <AlertDescription className="text-center">
          <p className="text-xs text-muted-foreground mb-1">Demo Mode - Your OTP is:</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 tracking-wider">
            {currentOTP}
          </p>
        </AlertDescription>
      </Alert>

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
          disabled={timeLeft > 90} // Can resend after 30 seconds
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Resend OTP
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
