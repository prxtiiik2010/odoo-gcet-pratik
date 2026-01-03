import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import OTPVerification from '@/components/auth/OTPVerification';
import GoogleSignInButton from '@/components/auth/GoogleSignInButton';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [userEmail, setUserEmail] = useState(''); // Store actual user email for OTP
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // First validate credentials
      const success = await login(email, password);
      if (success) {
        // Show OTP verification with the entered email
        setUserEmail(email);
        setShowOTP(true);
      } else {
        setError('Invalid email or password. Try: john.doe@dayflow.com or admin@dayflow.com');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPVerified = () => {
    // OTP verified, complete login
    navigate('/dashboard');
  };

  const handleOTPCancel = () => {
    setShowOTP(false);
    setPassword('');
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setIsLoading(true);

    try {
      const success = await loginWithGoogle();
      if (success) {
        // Get email from Firebase user
        const firebaseUser = (window as any).firebaseUser;
        const googleEmail = firebaseUser?.email || 'shahdevansh387@gmail.com';
        setUserEmail(googleEmail);
        // Show OTP verification after Firebase login
        setShowOTP(true);
      } else {
        setError('Failed to sign in with Google. Please try again.');
      }
    } catch (err) {
      setError('An error occurred during Google sign in.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30 px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-foreground">Dayflow</h1>
          <p className="text-sm text-muted-foreground mt-1">Every workday, perfectly aligned.</p>
        </div>

        {/* Sign In Card */}
        <div className="bg-card border border-border rounded-lg p-6">
          {!showOTP ? (
            <>
              <h2 className="text-lg font-medium text-foreground mb-6">Sign in to your account</h2>

              {/* Google Sign In Button */}
              <div className="space-y-4 mb-6">
                <GoogleSignInButton
                  onSuccess={handleGoogleSignIn}
                  onError={(err) => setError(err)}
                  disabled={isLoading}
                />

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-10"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-10"
                  />
                </div>

                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}

                <Button 
                  type="submit" 
                  className="w-full h-10"
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link to="/sign-up" className="text-primary hover:underline">
                  Create account
                </Link>
              </p>
            </>
          ) : (
            <OTPVerification
              email={userEmail || email}
              onVerified={handleOTPVerified}
              onCancel={handleOTPCancel}
            />
          )}
        </div>

        {/* Demo credentials */}
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <p className="text-xs text-muted-foreground font-medium mb-2">Demo Accounts:</p>
          <p className="text-xs text-muted-foreground">Employee: john.doe@dayflow.com</p>
          <p className="text-xs text-muted-foreground">HR Admin: admin@dayflow.com</p>
          <p className="text-xs text-muted-foreground mt-1">(Any password works)</p>
        </div>
      </div>
    </div>
  );
}
