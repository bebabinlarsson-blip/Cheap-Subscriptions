export function getOwnerEmails() {
  return (process.env.OWNER_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isOwnerEmail(email?: string | null) {
  if (!email) return false;
  return getOwnerEmails().includes(email.toLowerCase());
}
