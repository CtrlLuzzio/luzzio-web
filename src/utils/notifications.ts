// src/utils/notifications.ts

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + "...";
}

interface DiscordEmbedField {
  name: string;
  value: string;
  inline?: boolean;
}

interface SendDiscordParams {
  title: string;
  color: number;
  fields: DiscordEmbedField[];
}

export async function sendDiscordNotification({
  title,
  color,
  fields,
}: SendDiscordParams): Promise<boolean> {
  const webhookUrl = import.meta.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) return false;

  const sanitizedFields = fields.map((f) => ({
    name: truncate(f.name, 256),
    value: truncate(f.value.trim() || "N/A", 1024),
    inline: Boolean(f.inline),
  }));

  const payload = {
    embeds: [
      {
        title: truncate(title, 256),
        color: color,
        fields: sanitizedFields,
        timestamp: new Date().toISOString(),
      },
    ],
  };

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Discord API error:", res.status, errText);
    }

    return res.ok;
  } catch (err) {
    console.error("Error enviando webhook a Discord:", err);
    return false;
  }
}

interface SendEmailParams {
  subject: string;
  html: string;
}

export async function sendEmailNotification({
  subject,
  html,
}: SendEmailParams): Promise<boolean> {
  const apiKey = import.meta.env.RESEND_API_KEY;
  if (!apiKey) return false;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Luzzio Web <onboarding@resend.dev>",
        to: "contacto@luzzio.me",
        subject,
        html,
      }),
    });
    return res.ok;
  } catch (err) {
    console.error("Error enviando email vía Resend:", err);
    return false;
  }
}