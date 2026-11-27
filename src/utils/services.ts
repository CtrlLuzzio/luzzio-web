export const SERVICE_IDS = [
  "static_page",
  "web_app",
  "odoo_module",
  "devops",
  "creator_tools",
  "custom",
] as const;

export type ServiceId = (typeof SERVICE_IDS)[number];