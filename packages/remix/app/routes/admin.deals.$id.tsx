import { Link, useLoaderData, useParams, useFetcher } from "@remix-run/react";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { db } from "~/db.server";
import { isAdminLoggedIn } from "~/session.server";

export async function loader({ request, params }: LoaderFunctionArgs) {
  if (!(await isAdminLoggedIn(request))) return redirect("/admin");
  const deal = await db.deal.findUnique({ where: { id: params.id! } });
  if (!deal) throw new Response("Not found", { status: 404 });
  return { deal };
}

export async function action({ request, params }: ActionFunctionArgs) {
  if (!(await isAdminLoggedIn(request))) return redirect("/admin");
  const form = await request.formData();
  const intent = form.get("intent");
  const dealId = params.id!;

  if (intent === "save") {
    const name = form.get("name") as string;
    const description = form.get("description") as string;
    const address = form.get("address") as string;
    const status = form.get("status") as string;
    await db.deal.update({
      where: { id: dealId },
      data: { name, description, address, status },
    });
    return redirect("/admin/deals");
  }
  return redirect(`/admin/deals/${dealId}`);
}

export default function AdminEditDeal() {
  const { deal } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();

  return (
    <main>
      <h1>Edit Deal</h1>
      <p><Link to="/admin/deals">← Back to deals</Link></p>
      <form method="post">
        <input type="hidden" name="intent" value="save" />
        <div><label>Name</label><input name="name" defaultValue={deal.name} required /></div>
        <div><label>Description</label><textarea name="description" defaultValue={deal.description} required /></div>
        <div><label>Address</label><input name="address" defaultValue={deal.address} required /></div>
        <div>
          <label>Status</label>
          <select name="status" defaultValue={deal.status}>
            <option value="pending">pending</option>
            <option value="accepted">accepted</option>
            <option value="completed">completed</option>
          </select>
        </div>
        <button type="submit">Save</button>
      </form>
    </main>
  );
}
