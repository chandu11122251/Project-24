import { NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebaseAdmin';

export async function POST(request: Request) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Verify OTP in Firestore
    const otpDocRef = adminDb.collection('verification_otps').doc(email);
    const otpDocSnap = await otpDocRef.get();

    if (!otpDocSnap.exists) {
      return NextResponse.json({ error: 'OTP request not found or expired' }, { status: 400 });
    }

    const otpData = otpDocSnap.data()!;
    if (otpData.otp !== otp) {
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 401 });
    }

    const isExpired = new Date(otpData.expiresAt).getTime() < Date.now();
    if (isExpired) {
      await otpDocRef.delete();
      return NextResponse.json({ error: 'OTP has expired' }, { status: 401 });
    }

    // OTP Verified! Clean it up.
    await otpDocRef.delete();

    // 2. Process Firebase Authentication Identity
    let uidToReturn: string;

    try {
      // Condition A: User already exists from GitHub/Google
      const userRecord = await adminAuth.getUserByEmail(email);
      uidToReturn = userRecord.uid;
      
      console.log(`[Verify-OTP] Linked existing user (${uidToReturn}) via Passwordless OTP.`);
    } catch (authError: any) {
      if (authError.code === 'auth/user-not-found') {
        // Condition B: User NEVER logged in. Create a clean Passwordless Firebase Auth user.
        const newUserRecord = await adminAuth.createUser({
          email,
        });
        uidToReturn = newUserRecord.uid;
        console.log(`[Verify-OTP] Created NEW Passwordless user (${uidToReturn}).`);
      } else {
        throw authError; // Unhandled Firebase Admin error
      }
    }

    // 3. Generate a magical Custom Token
    // Passing the custom token back allows the frontend to 'sign in' natively using this authenticated context.
    const customToken = await adminAuth.createCustomToken(uidToReturn);

    return NextResponse.json({ success: true, customToken });
  } catch (error: any) {
    console.error('[Verify OTP Error]:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
