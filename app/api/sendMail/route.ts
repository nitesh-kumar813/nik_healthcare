import { NextResponse } from 'next/server';
import { transporter } from '@/lib/mailer';

export async function POST(req: Request) {
  try {
    const { to, subject, text } = await req.json();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
