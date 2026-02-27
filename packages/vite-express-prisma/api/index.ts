import "dotenv/config";
import express from "express";
import cors from "cors";
import session from "express-session";
import * as bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

declare module "express-session" {
  interface SessionData {
    adminId: string;
  }
}

const app = express();
const prisma = new PrismaClient();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "demo-secret-change-in-production",
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, secure: false, maxAge: 24 * 60 * 60 * 1000 },
  })
);

// Require admin session for protected routes
function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  if (!req.session?.adminId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

// Admin login
app.post("/api/admin/login", async (req, res) => {
  const { username, password } = req.body;
  const admin = await prisma.adminUser.findUnique({ where: { username } });
  if (!admin || !(await bcrypt.compare(password, admin.password))) {
    return res.json({ success: false });
  }
  req.session.adminId = admin.id;
  res.json({ success: true });
});

// Admin logout
app.post("/api/admin/logout", (req, res) => {
  req.session.destroy(() => {});
  res.json({ ok: true });
});

// PUBLIC: Submit new deal (contact form — anyone can submit)
app.post("/api/deals", async (req, res) => {
  const { name, description, address } = req.body;
  const deal = await prisma.deal.create({ data: { name, description, address, status: "pending" } });
  res.json(deal);
});

// ADMIN: List deals (protected)
app.get("/api/deals", requireAdmin, async (_req, res) => {
  const deals = await prisma.deal.findMany({ orderBy: { createdAt: "desc" } });
  res.json(deals);
});

app.put("/api/deals/:id", requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { name, description, address, status } = req.body;
  const deal = await prisma.deal.update({ where: { id }, data: { name, description, address, status } });
  res.json(deal);
});

app.delete("/api/deals/:id", requireAdmin, async (req, res) => {
  await prisma.deal.delete({ where: { id: req.params.id } });
  res.json({ ok: true });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API on http://localhost:${PORT}`));
