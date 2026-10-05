import { defineAction } from "astro:actions";
import { z } from "astro/zod";

export const leads = {
  submitProject: defineAction({
    accept: "form",
    input: z.object({
      name: z.string().min(2, "Name is mandatory"),
      email: z.email({ message: "Invalid email" }),
      service: z.enum(["static_page", "web_app", "odoo_module", "devops", "creator_tools", "custom"]),
      budget: z.enum(["under_500", "500_1000", "1000_3000", "3000_plus"]),
      deadline: z.string().optional(),
      details: z.string().min(20, "Please detail your proyect (min 20 characters)")
    }),
    handler: async (input) => {
      const { name, email, service, budget, deadline, details } = input;
      const discordWebhook = import.meta.env.DISCORD_WEBHOOK_URL;
      const resendApiKey = import.meta.env.RESEND_API_KEY;

      const notifyDiscord = discordWebhook ? fetch(discordWebhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          embeds: [{
            title: "🚀 Nueva Cotización (Lead)",
            color: 0xa6e3a1, // catp-green
            fields: [
              { name: "👤 Cliente", value: name, inline: true },
              { name: "📧 Email", value: email, inline: true },
              { name: "🛠️ Servicio", value: service, inline: true },
              { name: "💰 Presupuesto", value: budget, inline: true },
              { name: "⏳ Deadline", value: deadline || "No especificado", inline: true },
              { name: "📝 Detalles", value: details }
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
          subject: `Nuevo Lead: ${service} - ${budget}`,
          html: `<h3>Nueva Cotización</h3>
                 <ul>
                   <li><strong>Cliente:</strong> ${name}</li>
                   <li><strong>Email:</strong> ${email}</li>
                   <li><strong>Servicio:</strong> ${service}</li>
                   <li><strong>Presupuesto:</strong> ${budget}</li>
                   <li><strong>Deadline:</strong> ${deadline || 'No especificado'}</li>
                 </ul>
                 <p><strong>Detalles:</strong><br>${details}</p>`
        })
      }) : Promise.resolve();

      await Promise.allSettled([notifyDiscord, notifyEmail]);
             
      return {
         success: true,
         message: "Request received. I'll get back to you soon."
      };
    }
  })
};