const fs = require("fs");

(async () => {
  const base = process.env.BASE || "http://localhost:3088";
  const email = "admin@reverse.biz.id";
  const password = "reverse787";

  const login = await fetch(`${base}/api/users/login`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  const loginBody = await login.json();
  const token = loginBody.token;
  if (!token) throw new Error("Login failed: " + JSON.stringify(loginBody));
  console.log("login ok");

  const newTitle = "REVALIDATED " + new Date().toISOString();
  const newBody = "Konten ini ditest dari script revalidasi.";

  const update = await fetch(`${base}/api/globals/site-settings`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `JWT ${token}`
    },
    body: JSON.stringify({ aboutTitle: newTitle, aboutBody: newBody })
  });
  console.log("update status", update.status);
  const updateBody = await update.json();
  console.log("update body", JSON.stringify(updateBody).slice(0, 200));

  await new Promise((r) => setTimeout(r, 1500));

  const landing = await fetch(`${base}/`, { cache: "no-store" });
  const html = await landing.text();
  fs.writeFileSync(".tmp/landing-after-update.html", html);
  const titleMatch = html.match(/<h2[^>]*>([^<]*REVALIDATED[^<]*)<\/h2>/);
  console.log("landing has new title?", Boolean(titleMatch), titleMatch && titleMatch[1]);
  const bodyMatch = html.includes("ditest dari script revalidasi");
  console.log("landing has new body?", bodyMatch);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
