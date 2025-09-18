import { NextResponse } from 'next/server';

import { sendSMS } from '@/lib/sms';

export async function POST(req: Request) {
  try {
    const { to, message } = await req.json();
    console.log("📲 Sending SMS to:", to, "Message:", message);

    const result = await sendSMS(to, message);
    console.log("✅ Twilio SMS result:", result);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("❌ SMS Error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}


