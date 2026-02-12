export function normalizeUrl(input: string): string {
  const u = new URL(input.trim());
  // 追跡パラメータは軽く削る（必要なら増やせる）
  const drop = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];
  drop.forEach((k) => u.searchParams.delete(k));
  return u.toString();
}

export function getDomain(input: string): string {
  try {
    const u = new URL(input);
    return u.hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}
