import { defineAction } from "astro:actions";
import { z } from "astro/zod";

export const contact = {
  submitMessage: defineAction({
    accept: "form",
    input: z.object({
      name: z.string().min(3, "Name must be at least 3 characters"),
      email: z.email({ message: "Invalid Email" }),
      topic: z.enum(["dev", "fgc", "creator", "other"]),
      message: z.string().min(10, "Message must be at least 10 characters"),
    }),
    handler: async (input) => {
      const { name, email, topic, message } = input;
      const discordWebhook = import.meta.env.DISCORD_WEBHOOK_URL;
      const resendApiKey = import.meta.env.RESEND_API_KEY;

      const notifyDiscord = discordWebhook ? fetch(discordWebhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          embeds: [{
            title: "📬 Nuevo Mensaje de Contacto",
            color: 0x89b4fa, // catp-blue
            fields: [
              { name: "👤 Nombre", value: name, inline: true },
              { name: "📧 Email", value: email, inline: true },
              { name: "📌 Tema", value: topic, inline: true },
              { name: "💬 Mensaje", value: message }
            ],
            timestamp: new Date().toISOString()
          }]
        })
      }) : Promise.resolve();

      const notifyEmail = resendApiKey ? fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendApiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          from: "Luzzio Web <onboarding@resend.dev>", // Change to contacto@luzzio.me after verifying domain
          to: "contacto@luzzio.me",
          subject: `Nuevo mensaje de contacto: ${topic}`,
          html: `<h3>Nuevo Mensaje de Contacto</h3>
                 <p><strong>Nombre:</strong> ${name}</p>
                 <p><strong>Email:</strong> ${email}</p>
                 <p><strong>Tema:</strong> ${topic}</p>
                 <p><strong>Mensaje:</strong><br>${message}</p>`
        })
      }) : Promise.resolve();

      await Promise.allSettled([notifyDiscord, notifyEmail]);

      return {
        success: true,
        message: "Message sent successfully. I'll get back to you soon!",
      };
    },
  }),
};