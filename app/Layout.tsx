export const metadata = {
  title: "Wishlist",
  description: "Save items from anywhere"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body style={{ fontFamily: "system-ui", margin: 0 }}>
        <header
          style={{
            padding: "14px 16px",
            borderBottom: "1px solid #eee",
            display: "flex",
            gap: 12,
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <a href="/" style={{ textDecoration: "none", color: "black" }}>
            <strong>Wishlist</strong>
          </a>
          <nav style={{ display: "flex", gap: 12 }}>
            <a href="/add">＋Add</a>
          </nav>
        </header>
        <main style={{ padding: 16, maxWidth: 960, margin: "0 auto" }}>
          {children}
        </main>
      </body>
    </html>
  );
}
