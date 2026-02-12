"use client";

import { useMemo, useState } from "react";

export default function AddPage({
  searchParams
}: {
  searchParams: { url?: string };
}) {
  const initialUrl = useMemo(() => (searchParams.url ? decodeURIComponent(searchParams.url) : ""), [searchParams.url]);
  const [url, setUrl] = useState(initialUrl);
  const [tags, setTags] = useState("amazon, zozo");
  const [status, setStatus] = useState<string>("");

  async function onPasteFromClipboard() {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setUrl(text);
    } catch {
      setStatus("クリップボードが読めませんでした（iOSは許可が必要）");
    }
  }

  async function onSave() {
    setStatus("保存中…");
    const tagArr = tags
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const res = await fetch("/api/ingest", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ url, tags: tagArr })
    });
    const json = await res.json();
    if (!res.ok) {
      setStatus(`エラー: ${json.error || "unknown"}`);
      return;
    }
    setStatus("保存しました！");
    // 詳細へ
    location.href = `/item/${json.item.id}`;
  }

  return (
    <div style={{ maxWidth: 640 }}>
      <h2>追加</h2>
      <p style={{ opacity: 0.75 }}>
        商品ページのURLを貼って保存します（Amazon/ZOZO/どこでもOK）
      </p>

      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://..."
          style={{ flex: 1, padding: 10, border: "1px solid #ddd", borderRadius: 8 }}
        />
        <button onClick={onPasteFromClipboard} style={{ padding: "10px 12px" }}>
          貼り付け
        </button>
      </div>

      <div style={{ marginTop: 10 }}>
        <input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="タグ（カンマ区切り）例: zozo, 服, 欲しい"
          style={{ width: "100%", padding: 10, border: "1px solid #ddd", borderRadius: 8 }}
        />
      </div>

      <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
        <button onClick={onSave} style={{ padding: "10px 14px" }}>
          保存
        </button>
        <a href="/" style={{ padding: "10px 14px" }}>
          戻る
        </a>
      </div>

      {status && <p style={{ marginTop: 12 }}>{status}</p>}
    </div>
  );
}
