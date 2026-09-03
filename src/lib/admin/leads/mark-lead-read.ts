import "server-only";

import { updateLeadById } from "@/lib/db/repositories/lead.repository";

export async function markLeadReadIfUnread(leadId: string, isRead: boolean): Promise<void> {
  if (isRead) {
    return;
  }

  await updateLeadById(leadId, { isRead: true });
}
