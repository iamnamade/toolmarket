import { getResendConfig } from "@/lib/auth-env";

type SendAuthEmailOptions = {
  html: string;
  subject: string;
  text?: string;
  to: string;
};

type ResendSendEmailResponse = {
  id: string;
};

function isLikelyEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function isResendConfigured() {
  return getResendConfig() !== null;
}

export async function sendAuthEmail({
  html,
  subject,
  text,
  to
}: SendAuthEmailOptions): Promise<ResendSendEmailResponse> {
  const config = getResendConfig();

  if (!config) {
    throw new Error("Resend email configuration is missing.");
  }

  if (!isLikelyEmail(config.fromEmail)) {
    throw new Error("RESEND_FROM_EMAIL is invalid.");
  }

  if (!isLikelyEmail(to)) {
    throw new Error("Recipient email is invalid.");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: config.fromEmail,
      to: [to],
      subject,
      html,
      text
    }),
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error("Resend email send failed.");
  }

  return (await response.json()) as ResendSendEmailResponse;
}
