// Create or reset the Kulas admin login.
//
// Usage (run from the project root, with DATABASE_URL set to your database):
//   node scripts/set-admin.mjs <email> <password>
// or via env vars:
//   ADMIN_EMAIL=you@example.com ADMIN_PASSWORD=YourPass123! node scripts/set-admin.mjs
//
// It upserts a SUPER_ADMIN user with a freshly hashed password, so it works
// whether the account is missing or you just forgot the password.

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const email = (process.argv[2] || process.env.ADMIN_EMAIL || "").trim();
const password = process.argv[3] || process.env.ADMIN_PASSWORD || "";

async function main() {
  if (!email || !password) {
    console.error(
      "\n❌ Missing email or password.\n" +
        "   Run:  node scripts/set-admin.mjs your@email.com YourStrongPassword\n",
    );
    process.exit(1);
  }
  if (password.length < 8) {
    console.error("\n❌ Password must be at least 8 characters.\n");
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.upsert({
    where: { email },
    update: { role: "SUPER_ADMIN", passwordHash },
    create: {
      email,
      name: "Kulas Admin",
      role: "SUPER_ADMIN",
      passwordHash,
    },
  });

  console.log(`\n✅ Admin ready: ${user.email} (role: ${user.role})`);
  console.log("   You can now sign in at /login with this email + password.\n");
}

main()
  .catch((e) => {
    console.error("\n❌ Failed to set admin:", e.message ?? e, "\n");
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
