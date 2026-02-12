import { supabaseAdmin } from "@/lib/supabaseAdmin";

type Item = {
  id: string;
  url: string;
  title: string | null;
  description: string | null;
  image_url: string | null;
  site_name: string | null;
  domain: string | null;
  tags: string[] | null;
  created_at: string;
};

export default async function Home({
  searchParams
}: {
  searchParams: { q?: string; tag?: string };
}) {
  const q = (searchParams.q || "").trim().toLowerCase();
  const tag = (searchParams.tag || "").trim().toLowerCase();

  const sb = supabaseAdmin();
  const { data, error } = await sb
    .from("items")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return <div>DB error: {error.message}</div>;
  }

  let items = (data || []) as Item[];

  if (q) {
    items = items.filter((it) => {
      const hay = `${it.title || ""} ${it.description || ""} ${it.domain || ""}`.toLowerCase();
      return hay.includes(q);
    });
  }
  if (tag) {
    items = items.filter((it) => (it.tags || []).map((t) => t.toLowerCase()).includes(tag));
  }

  const allTags = Array.from(
    new Set(items.flatMap((it) => it.tags || []).map((t) => t.trim()).filter(Boolean))
  ).slice(0, 30);

  return (
    <div>
      <form action="/" method="get" style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input
          name="q"
          placeholder="検索（例: zozo / coat / amazon）"
          defaultValue={searchParams.q || ""}
          style={{ flex: 1, padding: 10, border: "1px solid #ddd", borderRadius: 8 }}
        />
        <button style={{ padding: "10px 12px" }}>検索</button>
      </form>

      {allTags.length > 0 && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
          {allTags.map((t) => (
            <a
              key={t}
              href={`/?tag=${encodeURIComponent(t)}`}
              style={{
                border: "1px solid #eee",
                padding: "6px 10px",
                borderRadius: 999,
                textDecoration: "none"
              }}
            >
              #{t}
            </a>
          ))}
          {tag && <a href="/" style={{ marginLeft: 8 }}>タグ解除</a>}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 12 }}>
        {items.map((it) => (
          <a
            key={it.id}
            href={`/item/${it.id}`}
            style={{
              display: "block",
              border: "1px solid #eee",
              borderRadius: 12,
              overflow: "hidden",
              textDecoration: "none",
              color: "inherit"
            }}
          >
            {it.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={it.image_url} alt="" style={{ width: "100%", height: 180, objectFit: "cover" }} />
            ) : (
              <div style={{ height: 180, background: "#f6f6f6" }} />
            )}
            <div style={{ padding: 12 }}>
              <div style={{ fontSize: 13, opacity: 0.7 }}>{it.domain || it.site_name || ""}</div>
              <div style={{ fontWeight: 700, marginTop: 6, lineHeight: 1.3 }}>
                {it.title || "（タイトル未取得）"}
              </div>
              {it.tags && it.tags.length > 0 && (
                <div style={{ marginTop: 8, display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {it.tags.slice(0, 4).map((t) => (
                    <span key={t} style={{ fontSize: 12, opacity: 0.75 }}>
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
