import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { fetchOg } from "@/lib/og";
import { normalizeUrl } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const rawUrl = String(body.url || "");
    const tags = Array.isArray(body.tags) ? body.tags.map(String) : [];

    if (!rawUrl) {
      return NextResponse.json({ error: "url is required" }, { status: 400 });
    }

    const url = normalizeUrl(rawUrl);
    const og = await fetchOg(url);

    const sb = supabaseAdmin();

    // Upsert（同じURLなら更新）
    const { data, error } = await sb
      .from("items")
      .upsert(
        {
          url: og.url,
          title: og.title,
          description: og.description,
          image_url: og.image_url,
          site_name: og.site_name,
          domain: og.domain,
          tags
        },
        { onConflict: "url" }
      )
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ item: data }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "unknown error" },
      { status: 500 }
    );
  }
}
