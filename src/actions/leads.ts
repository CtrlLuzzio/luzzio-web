import { defineAction } from "astro:actions";
import { z } from "astro/zod";

export const leads = {
  submitProject: defineAction({
    accept: "form",
    input: z.object({
      name: z.string().min(2, "Name is mandatory"),
      email: z.email({ message: "Invalid email" }),
      service: z.enum([
        "static_page",
        "web_app",
        "odoo_module",
        "ui_ux",
        "devops",
        "creator_tools",
        "custom"
      ]),
      budget: z.enum([
        "under_500",
        "500_1000",
        "1000_3000",
        "3000_plus"
      ]),
      deadline: z.string().optional(),
      details: z.string().min(20, "Please detail your proyect (min 20 characters)")
    }),
    handler: async (input) => {
      //TODO
      // Email sending/Discord webhook logic
      
      console.log("Nuevo lead recibido:", input);
      
      return { 
        success: true, 
        message: "Request received. I'll get back to you soon."
      };
    }
  })
};