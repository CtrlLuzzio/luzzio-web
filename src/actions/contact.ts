import { defineAction } from "astro:actions";
import { z } from "astro/zod";

export const contact = {
  submitMessage: defineAction({
    accept: "form",
    input: z.object({
      name: z.string().min(3, "Name must be at least 3 characters"),
      email: z.email({ message: "Invalid Email" }),
      topic: z.enum([
        "dev",
        "fgc",
        "creator",
        "other"
      ]),
      message: z.string().min(10, "Message must be at least 10 characters"),
    }),
    handler: async (input) => {
      const { name, email, topic, message } = input;

      console.log(`New message received: ${name} [${topic}]`);
      return {
        success: true,
        message: "Message sent successfully. I'll get back to you soon!",
      };
    },
  }),
};