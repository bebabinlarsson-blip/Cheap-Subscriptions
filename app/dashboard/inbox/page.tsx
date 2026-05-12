import { InboxClient } from "@/components/dashboard/inbox-client";
import { requireUser } from "@/lib/auth/session";
import { getInboxForUser } from "@/lib/catalog";

export default async function InboxPage() {
  const session = await requireUser("/dashboard/inbox");
  const data = await getInboxForUser(session.user.id);

  return <InboxClient messages={data.messages} keys={data.keys} />;
}
