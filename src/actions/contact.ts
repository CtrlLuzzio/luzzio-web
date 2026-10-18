import { defineAction, ActionError } from "astro:actions";
import { z } from "astro/zod";
import { escapeHtml, sendDiscordNotification, sendEmailNotification } from "../utils/notifications";

export const contact = {
  submitMessage: defineAction({
    accept: "form",
    input: z.object({
      name: z.string().trim().min(3, "Name must be at least 3 characters").max(100, "Name is too long"),
      email: z.string().trim().email({ message: "Invalid Email" }).max(255),
      topic: z.enum(["dev", "fgc", "creator", "other"]),
      message: z.string().trim().min(10, "Message must be at least 10 characters").max(3000, "Message is too long"),
    }),
    handler: async (input) => {
      const { name, email, topic, message } = input;

      const notifyDiscord = sendDiscordNotification({
        title: "📬 Nuevo Mensaje de Contacto",
        color: 0x89b4fa, // catp-blue
        fields: [
          { name: "👤 Nombre", value: name, inline: true },
          { name: "✉️ Email", value: email, inline: true },
          { name: "📌 Tema", value: topic, inline: true },
          { name: "💬 Mensaje", value: message, inline: false },
        ],
      });

      const safeName = escapeHtml(name);
      const safeEmail = escapeHtml(email);
      const safeTopic = escapeHtml(topic);
      const safeMessage = escapeHtml(message).replace(/\n/g, "<br>");

      const notifyEmail = sendEmailNotification({
        subject: `Nuevo mensaje de contacto: ${topic}`,
        html: `<h3>Nuevo Mensaje de Contacto</h3>
               <p><strong>Nombre:</strong> ${safeName}</p>
               <p><strong>Email:</strong> ${safeEmail}</p>
               <p><strong>Tema:</strong> ${safeTopic}</p>
               <p><strong>Mensaje:</strong><br>${safeMessage}</p>`,
      });

      const [discordOk, emailOk] = await Promise.all([notifyDiscord, notifyEmail]);

      if (!discordOk && !emailOk) {
        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not send your message. Please try again or reach out via email.",
        });
      }

      return {
        success: true,
        message: "Message sent successfully. I'll get back to you soon!",
      };
    },
  }),
};