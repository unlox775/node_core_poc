import { Link, useActionData } from "@remix-run/react";
import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import * as bcrypt from "bcryptjs";
import { db } from "~/db.server";
import { getAdminSession, setAdminLoggedIn, commitSession } from "~/session.server";

export async function action({ request }: ActionFunctionArgs) {
  const form = await request.formData();
  const username = form.get("username") as string;
  const password = form.get("password") as string;
  const admin = await db.adminUser.findUnique({ where: { username } });
  if (!admin || !(await bcrypt.compare(password, admin.password))) {
    return { error: "Invalid credentials" };
  }
  const session = await getAdminSession(request);
  await setAdminLoggedIn(session);
  return redirect("/admin/deals", { headers: { "Set-Cookie": await commitSession(session) } });
}

export default function AdminLogin() {
  const actionData = useActionData<typeof action>();
  return (
    <main>
      <h1>Admin Login</h1>
      <p><Link to="/">← Back to home</Link></p>
      <form method="post">
        <div><label>Username</label><input name="username" required /></div>
        <div><label>Password</label><input type="password" name="password" required /></div>
        {actionData?.error && <p style={{ color: "red" }}>{actionData.error}</p>}
        <button type="submit">Log in</button>
      </form>
      <p><small>Demo: ethan / 123qwe</small></p>
    </main>
  );
}
