import { createCookieSessionStorage } from "@remix-run/node";

const { getSession, commitSession, destroySession } = createCookieSessionStorage({
  cookie: { name: "admin", secrets: ["bens-cranes-secret"], path: "/", httpOnly: true, maxAge: 60 * 60 * 24 },
});

export async function getAdminSession(request: Request) {
  return getSession(request.headers.get("Cookie"));
}

export async function setAdminLoggedIn(session: { get: (k: string) => string | undefined; set: (k: string, v: string) => void }) {
  session.set("admin", "1");
  return session;
}

export async function isAdminLoggedIn(request: Request): Promise<boolean> {
  const session = await getAdminSession(request);
  return session.get("admin") === "1";
}

export { getSession, commitSession, destroySession };
