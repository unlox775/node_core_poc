import { Link, useActionData, useNavigation } from "@remix-run/react";
import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { db } from "~/db.server";

export async function action({ request }: ActionFunctionArgs) {
  const form = await request.formData();
  const name = form.get("name") as string;
  const description = form.get("description") as string;
  const address = form.get("address") as string;
  if (!name || !description || !address) return { error: "All fields required" };
  await db.deal.create({ data: { name, description, address, status: "pending" } });
  return redirect("/thank-you");
}

export default function NewDeal() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <main>
      <h1>Ben's Cranes — Submit a New Deal</h1>
      <p><Link to="/">← Back to home</Link></p>
      <form method="post">
        <h2>Deal</h2>
        <div><label>Deal / Customer name</label><input name="name" required /></div>
        <div><label>Description</label><textarea name="description" required /></div>
        <div><label>Address</label><input name="address" required /></div>
        {actionData?.error && <p style={{ color: "red" }}>{actionData.error}</p>}
        <button type="submit" disabled={isSubmitting}>{isSubmitting ? "Submitting..." : "Submit Deal"}</button>
      </form>
    </main>
  );
}
