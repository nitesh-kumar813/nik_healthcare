import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

export const sendSMS = async (to: string, body: string) => {
  const message = await client.messages.create({
    body,
    from: process.env.TWILIO_PHONE_NUMBER,
    to,
  });

  console.log("✅ SMS sent successfully:");
  console.log("To:", to);
  console.log("Body:", body);
  console.log("SID:", message.sid);

  return message;
};
