import { defineAction, ActionError } from "astro:actions";
import { z } from "astro/zod";
import { escapeHtml, sendDiscordNotification, sendEmailNotification } from "../utils/notifications";
import { SERVICE_IDS } from "../utils/services";

export const leads = {
  submitProject: defineAction({
    accept: "form",
    input: z.object({
      lang: z.enum(["en", "es"]).optional().default("en"),
      name: z.string().trim().min(2).max(100),
      email: z.string().trim().max(255).pipe(z.email()),
      service: z.enum(SERVICE_IDS),
      deadline: z.string().trim().max(200).optional(),
      details: z.string().trim().min(20).max(4000),
    }),
    handler: async (input) => {
      const { name, email, service, deadline, details } = input;

      const notifyDiscord = sendDiscordNotification({
        title: "🚀 Nueva Cotización (Lead)",
        color: 0xa6e3a1, // catp-green
        fields: [
          { name: "👤 Cliente", value: name, inline: true },
          { name: "✉️ Email", value: email, inline: true },
          { name: "🛠️ Servicio", value: service, inline: true },
          { name: "📅 Deadline", value: deadline || "No especificado", inline: true },
          { name: "📝 Detalles", value: details, inline: false },
        ],
      });

      const safeName = escapeHtml(name);
      const safeEmail = escapeHtml(email);
      const safeService = escapeHtml(service);
      const safeDeadline = deadline ? escapeHtml(deadline) : "No especificado";
      const safeDetails = escapeHtml(details).replace(/\n/g, "<br>");

      const notifyEmail = sendEmailNotification({
        subject: `Nuevo Lead: ${service}`,
        html: `<h3>Nueva Cotización</h3>
               <ul>
                 <li><strong>Cliente:</strong> ${safeName}</li>
                 <li><strong>Email:</strong> ${safeEmail}</li>
                 <li><strong>Servicio:</strong> ${safeService}</li>
                 <li><strong>Deadline:</strong> ${safeDeadline}</li>
               </ul>
               <p><strong>Detalles:</strong><br>${safeDetails}</p>`,
      });

      const [discordOk, emailOk] = await Promise.all([notifyDiscord, notifyEmail]);

      if (!discordOk && !emailOk) {
        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            input.lang === "es"
              ? "No se pudo enviar tu solicitud. Por favor, inténtalo más tarde."
              : "Could not submit your request. Please try again later.",
        });
      }

      return {
        success: true,
        message:
          input.lang === "es"
            ? "Solicitud recibida. Me pondré en contacto contigo pronto."
            : "Request received. I'll get back to you soon.",
      };
    },
  }),
};