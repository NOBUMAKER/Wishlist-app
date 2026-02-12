import * as cheerio from "cheerio";
import { getDomain } from "./utils";

export type OgResult = {
  url: string;
  title?: string;
  description?: string;
  image_url?: string;
  site_name?: string;
  domain?: string;
};

function pickMeta($: cheerio.CheerioAPI, selectors: string[]): string | undefined {
  for (const sel of selectors) {
    const v = $(sel).attr("content")?.trim();
    if (v) return v;
  }
  return undefined;
}

export async function fetchOg(url: string): Promise<OgResult> {
  const res = await fetch(url, {
    redirect: "follow",
    headers: {
      // 軽いボット対策を避けたいのでUAは最低限入れる
      "user-agent":
        "Mozilla/5.0 (compatible; WishlistApp/0.1; +https://example.com)"
    }
  });

  const html = await res.text();
  const $ = cheerio.load(html);

  const title =
    pickMeta($, ['meta[property="og:title"]', 'meta[name="twitter:title"]']) ||
    $("title").first().text().trim() ||
    undefined;

  const description =
    pickMeta($, [
      'meta[property="og:description"]',
      'meta[name="twitter:description"]',
      'meta[name="description"]'
    ]) || undefined;

  const image_url =
    pickMeta($, ['meta[property="og:image"]', 'meta[name="twitter:image"]']) ||
    undefined;

  const site_name =
    pickMeta($, ['meta[property="og:site_name"]']) || getDomain(url);

  return {
    url,
    title,
    description,
    image_url,
    site_name,
    domain: getDomain(url)
  };
}
