import { Link, useLoaderData, useFetcher } from "@remix-run/react";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { db } from "~/db.server";
import { getAdminSession, isAdminLoggedIn, destroySession, commitSession } from "~/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
  if (!(await isAdminLoggedIn(request))) return redirect("/admin");
  const deals = await db.deal.findMany({ orderBy: { createdAt: "desc" } });
  return { deals };
}

export async function action({ request }: ActionFunctionArgs) {
  if (!(await isAdminLoggedIn(request))) return redirect("/admin");
  const form = await request.formData();
  const intent = form.get("intent");
  if (intent === "logout") {
    const session = await getAdminSession(request);
    return redirect("/admin", { headers: { "Set-Cookie": await destroySession(session) } });
  }
  if (intent === "delete") {
    const id = form.get("id") as string;
    if (id) await db.deal.delete({ where: { id } });
  }
  return redirect("/admin/deals");
}

export default function AdminDeals() {
  const { deals } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();

  return (
    <main>
      <h1>Admin — Deals</h1>
      <p><Link to="/admin">← Back to admin</Link> | <Link to="/">Home</Link></p>
      <fetcher.Form method="post"><input type="hidden" name="intent" value="logout" /><button type="submit">Log out</button></fetcher.Form>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {deals.map((d) => (
          <li key={d.id} style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "0.5rem", borderRadius: 4 }}>
            <strong>{d.name}</strong>
            <p>{d.description}</p>
            <p><small>{d.address} · Status: {d.status}</small></p>
            <p>
              <Link to={`/admin/deals/${d.id}`}>Edit</Link>
              {" · "}
              <fetcher.Form method="post" style={{ display: "inline" }}>
                <input type="hidden" name="intent" value="delete" />
                <input type="hidden" name="id" value={d.id} />
                <button type="submit" style={{ background: "#c00", padding: "0.25rem 0.5rem", fontSize: "0.875rem" }}>Delete</button>
              </fetcher.Form>
            </p>
          </li>
        ))}
      </ul>
    </main>
  );
}
