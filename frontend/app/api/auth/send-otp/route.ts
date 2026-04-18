import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { adminDb } from '@/lib/firebaseAdmin';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // 0. Rate Limiting Check
    const rateLimitRef = adminDb.collection('otp_rate_limits').doc(email);
    const rateLimitSnap = await rateLimitRef.get();
    
    if (rateLimitSnap.exists) {
      const { attempts, resetAt } = rateLimitSnap.data()!;
      if (Date.now() < new Date(resetAt).getTime() && attempts >= 3) {
        return NextResponse.json({ error: 'Too many requests. Please try again in 10 minutes.' }, { status: 429 });
      }
    }

    // 1. Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // 2. Store OTP in secure Firebase Admin collection
    await adminDb.collection('verification_otps').doc(email).set({
      otp,
      expiresAt: expiresAt.toISOString(),
      verified: false,
    });

    // 2.5 Update Rate Limit
    const currentResetAt = rateLimitSnap.exists && Date.now() < new Date(rateLimitSnap.data()!.resetAt).getTime() 
      ? rateLimitSnap.data()!.resetAt 
      : expiresAt.toISOString();
      
    const currentAttempts = rateLimitSnap.exists && Date.now() < new Date(rateLimitSnap.data()!.resetAt).getTime()
      ? rateLimitSnap.data()!.attempts + 1
      : 1;

    await rateLimitRef.set({ attempts: currentAttempts, resetAt: currentResetAt });

    // 3. Configure Nodemailer (Requires valid GMAIL environment variables)
    // If not configured, we'll log it on development but error out in production.
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      console.warn('[OTP DEV MODE] Missing Gmail credentials. Generated OTP:', otp);
      if (process.env.NODE_ENV !== 'development') {
        return NextResponse.json({ error: 'Server mailer is improperly configured.' }, { status: 500 });
      }
      return NextResponse.json({ success: true, message: 'OTP logged to console (DEV MODE).' });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"Project-24 Auth" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Your Project-24 Login Verification Code',
      text: `Your One-Time Password (OTP) is: ${otp}\n\nIt expires in 10 minutes.`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; background: #06070f; color: white;">
          <h2 style="color: #4fd1c5;">Project-24 Identity Synthesis</h2>
          <p>Please enter the following OTP to verify your identity.</p>
          <h1 style="letter-spacing: 5px; color: #fff;">${otp}</h1>
          <p style="color: #666; font-size: 12px;">This code expires in 10 minutes. Do not share it with anyone.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: 'OTP sent to your email.' });
  } catch (error: any) {
    console.error('[Send OTP Error]:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
