import { defineAction, ActionError } from "astro:actions";
import { z } from "astro/zod";
import { escapeHtml, sendDiscordNotification, sendEmailNotification } from "../utils/notifications";

export const contact = {
  submitMessage: defineAction({
    accept: "form",
    input: z.object({
      lang: z.enum(["en", "es"]).optional().default("en"),
      name: z.string().trim().min(3).max(100),
      email: z.string().trim().email().max(255),
      topic: z.enum(["dev", "fgc", "creator", "other"]),
      message: z.string().trim().min(10).max(3000),
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
          message:
            input.lang === "es"
              ? "No se pudo enviar tu mensaje. Inténtalo de nuevo o escríbeme por correo."
              : "Could not send your message. Please try again or reach out via email.",
        });
      }

      return {
        success: true,
        message:
          input.lang === "es"
            ? "Mensaje enviado con éxito. ¡Te responderé pronto!"
            : "Message sent successfully. I'll get back to you soon!",
      };
    },
  }),
};