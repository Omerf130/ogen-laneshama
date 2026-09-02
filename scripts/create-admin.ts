import { input, password } from "@inquirer/prompts";
import mongoose from "mongoose";
import { loadEnvLocal } from "./lib/load-env-local";
import { connectDB } from "../src/lib/db/mongoose";
import { adminBootstrapSchema } from "../src/lib/validation/admin-auth";
import { normalizeAdminEmail } from "../src/lib/admin/auth/constants";
import { hashPassword } from "../src/lib/admin/auth/password";
import {
  createAdminUser,
  findAdminUserByEmail,
} from "../src/lib/db/repositories/admin-user.repository";

type BootstrapInput = {
  email: string;
  password: string;
  name?: string;
};

function readBootstrapFromEnv(): BootstrapInput | null {
  const email = process.env.ADMIN_CREATE_EMAIL?.trim();
  const passwordValue = process.env.ADMIN_CREATE_PASSWORD;
  const name = process.env.ADMIN_CREATE_NAME?.trim();

  if (!email && !passwordValue && !name) {
    return null;
  }

  if (!email || !passwordValue) {
    console.error(
      "ADMIN_CREATE_EMAIL and ADMIN_CREATE_PASSWORD must both be set for non-interactive bootstrap.",
    );
    process.exit(1);
  }

  return {
    email,
    password: passwordValue,
    ...(name ? { name } : {}),
  };
}

async function readBootstrapInteractive(): Promise<BootstrapInput> {
  const nameInput = await input({
    message: "שם (אופציונלי)",
    default: "",
  });

  const email = await input({
    message: "דוא\"ל",
    validate: (value) => {
      const parsed = adminBootstrapSchema.shape.email.safeParse(value);
      return parsed.success ? true : "כתובת דוא\"ל אינה תקינה";
    },
  });

  const passwordValue = await password({
    message: "סיסמה (מינימום 12 תווים)",
    mask: "*",
    validate: (value) => {
      if (value.length < 12) {
        return "הסיסמה חייבת להכיל לפחות 12 תווים";
      }

      return true;
    },
  });

  const passwordConfirm = await password({
    message: "אשרו סיסמה",
    mask: "*",
    validate: (value) =>
      value === passwordValue || "הסיסמאות אינן תואמות",
  });

  if (passwordConfirm !== passwordValue) {
    throw new Error("Password confirmation failed.");
  }

  return {
    email,
    password: passwordValue,
    ...(nameInput.trim() ? { name: nameInput.trim() } : {}),
  };
}

async function main(): Promise<void> {
  loadEnvLocal();

  const rawInput =
    readBootstrapFromEnv() ?? (await readBootstrapInteractive());

  const parsed = adminBootstrapSchema.safeParse(rawInput);

  if (!parsed.success) {
    console.error("Invalid admin bootstrap input.");
    process.exit(1);
  }

  const email = normalizeAdminEmail(parsed.data.email);

  await connectDB();

  try {
    const existing = await findAdminUserByEmail(email);

    if (existing) {
      console.error(`Admin user already exists for ${email}. Refusing to overwrite.`);
      process.exit(1);
    }

    const passwordHash = await hashPassword(parsed.data.password);

    await createAdminUser({
      email,
      passwordHash,
      ...(parsed.data.name ? { name: parsed.data.name } : {}),
      isActive: true,
    });

    console.log(`Admin user created successfully for ${email}.`);
  } finally {
    await mongoose.disconnect();
  }
}

void main().catch((error) => {
  const message =
    error instanceof Error ? error.message : "Unknown admin bootstrap error";
  console.error(`Admin bootstrap failed: ${message}`);
  process.exit(1);
});
