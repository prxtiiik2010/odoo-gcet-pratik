// OTP Generator Utility
export class OTPGenerator {
  private static instance: OTPGenerator;
  private otpMap: Map<string, { code: string; expiresAt: number }> = new Map();
  private readonly OTP_LENGTH = 6;
  private readonly OTP_VALIDITY = 120000; // 2 minutes in milliseconds

  private constructor() {}

  static getInstance(): OTPGenerator {
    if (!OTPGenerator.instance) {
      OTPGenerator.instance = new OTPGenerator();
    }
    return OTPGenerator.instance;
  }

  /**
   * Generate a new OTP for the given email
   */
  generateOTP(email: string): { code: string; expiresIn: number } {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + this.OTP_VALIDITY;

    this.otpMap.set(email.toLowerCase(), { code, expiresAt });

    // Auto-clean expired OTP after validity period
    setTimeout(() => {
      this.deleteOTP(email);
    }, this.OTP_VALIDITY);

    console.log(`[OTP] Generated for ${email}: ${code} (Valid for 2 minutes)`);

    return {
      code,
      expiresIn: this.OTP_VALIDITY,
    };
  }

  /**
   * Verify the OTP for the given email
   */
  verifyOTP(email: string, code: string): boolean {
    const stored = this.otpMap.get(email.toLowerCase());

    if (!stored) {
      console.log(`[OTP] No OTP found for ${email}`);
      return false;
    }

    if (Date.now() > stored.expiresAt) {
      console.log(`[OTP] Expired OTP for ${email}`);
      this.deleteOTP(email);
      return false;
    }

    const isValid = stored.code === code;
    if (isValid) {
      console.log(`[OTP] Valid OTP for ${email}`);
      this.deleteOTP(email); // Delete after successful verification
    } else {
      console.log(`[OTP] Invalid OTP for ${email}`);
    }

    return isValid;
  }

  /**
   * Check if OTP exists and is valid for the given email
   */
  hasValidOTP(email: string): boolean {
    const stored = this.otpMap.get(email.toLowerCase());
    if (!stored) return false;
    return Date.now() <= stored.expiresAt;
  }

  /**
   * Get remaining time for OTP validity
   */
  getRemainingTime(email: string): number {
    const stored = this.otpMap.get(email.toLowerCase());
    if (!stored) return 0;

    const remaining = stored.expiresAt - Date.now();
    return remaining > 0 ? remaining : 0;
  }

  /**
   * Delete OTP for the given email
   */
  deleteOTP(email: string): void {
    this.otpMap.delete(email.toLowerCase());
  }

  /**
   * Get OTP code for demo/testing purposes
   */
  getOTPCode(email: string): string | null {
    const stored = this.otpMap.get(email.toLowerCase());
    return stored?.code || null;
  }
}

export const otpGenerator = OTPGenerator.getInstance();
