"use server";
import { adminClient } from "@/utils/supabase/admin";

export async function submitContactMessage(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<{ error?: string; success?: boolean }> {
  const { name, email, subject, message } = data;

  if (!name.trim() || !email.trim() || !subject || !message.trim()) {
    return { error: "Completează toate câmpurile obligatorii." };
  }

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRe.test(email)) {
    return { error: "Adresa de email nu este validă." };
  }

  const { error } = await adminClient
    .from("contact_messages")
    .insert({ name: name.trim(), email: email.trim(), subject, message: message.trim() });

  if (error) {
    console.error("contact insert error:", error);
    return { error: "A apărut o eroare. Încearcă din nou." };
  }

  return { success: true };
}
