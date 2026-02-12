import { supabaseAdmin } from "@/lib/supabaseAdmin";

export default async function ItemPage({ params }: { params: { id: string } }) {
  const sb = supabaseAdmin();
  const { data, error } = await sb.from("items").select("*").eq("id", params.id).single();

  if (error) return <div>Not found / error: {error.message}</div>;

  return (
    <div style={{ maxWidth: 720 }}>
      <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
        {data.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={data.image_url} alt="" style={{ width: 220, height: 220, objectFit: "cover", borderRadius: 12 }} />
        ) : (
          <div style={{ width: 220, height: 220, background: "#f6f6f6", borderRadius: 12 }} />
        )}

        <div style={{ flex: 1 }}>
          <div style={{ opacity: 0.7 }}>{data.domain || data.site_name}</div>
          <h2 style={{ margin: "8px 0" }}>{data.title || "（タイトル未取得）"}</h2>
          {data.description && <p style={{ opacity: 0.85 }}>{data.description}</p>}
          {data.tags?.length ? (
            <p style={{ opacity: 0.8 }}>
              {data.tags.map((t: string) => (
                <span key={t} style={{ marginRight: 8 }}>#{t}</span>
              ))}
            </p>
          ) : null}

          <a
            href={data.url}
            target="_blank"
            rel="noreferrer"
            style={{ display: "inline-block", marginTop: 10 }}
          >
            元ページを開く →
          </a>
        </div>
      </div>
    </div>
  );
}
