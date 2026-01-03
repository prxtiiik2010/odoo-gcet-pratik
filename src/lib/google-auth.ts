// Google OAuth Configuration and Helper Functions

// Your actual Google Client ID
export const GOOGLE_CLIENT_ID = '656725352901-hhts2bhqdmqdqhl6ssqcvh2q4159pvkv.apps.googleusercontent.com';

// For demo purposes, we'll use a mock client ID
export const DEMO_GOOGLE_CLIENT_ID = '656725352901-hhts2bhqdmqdqhl6ssqcvh2q4159pvkv.apps.googleusercontent.com';

export interface GoogleUserInfo {
  email: string;
  name: string;
  picture: string;
  sub: string; // Google user ID
}

/**
 * Parse Google credential response
 */
export function parseGoogleCredential(credential: string): GoogleUserInfo | null {
  try {
    // Decode JWT token (in production, validate on backend)
    const base64Url = credential.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error parsing Google credential:', error);
    return null;
  }
}

/**
 * Mock Google authentication for demo purposes
 * In production, this would validate the token on your backend
 */
export async function mockGoogleAuth(email: string): Promise<boolean> {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // For demo, accept any Google email
  return email.includes('@');
}
