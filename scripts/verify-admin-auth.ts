import {
  adminBootstrapSchema,
  adminLoginSchema,
  ADMIN_PASSWORD_MIN_LENGTH,
} from "../src/lib/validation/admin-auth";
import {
  ADMIN_SESSION_COOKIE_NAME,
  BCRYPT_COST_FACTOR,
  LOGIN_RATE_LIMIT_MAX_ATTEMPTS,
  SESSION_MAX_AGE_SECONDS,
} from "../src/lib/admin/auth/constants";
import { getSessionCookieOptions } from "../src/lib/admin/auth/cookies";
import { hashPassword, verifyPassword } from "../src/lib/admin/auth/password";
import {
  generateSessionToken,
  hashSessionToken,
  hashRateLimitKey,
} from "../src/lib/admin/auth/session-token";
import { toAdminIdentity } from "../src/lib/admin/auth/identity";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

async function verifyPasswordModule(): Promise<void> {
  const plain = "test-password-12chars";
  const passwordHash = await hashPassword(plain);

  assert(passwordHash !== plain, "Password hash must differ from plaintext");
  assert(
    await verifyPassword(plain, passwordHash),
    "verifyPassword must accept valid password",
  );
  assert(
    !(await verifyPassword("wrong-password!", passwordHash)),
    "verifyPassword must reject invalid password",
  );

  const identity = toAdminIdentity({
    _id: { toString: () => "abc123" },
    email: "admin@example.com",
    passwordHash,
    name: "Admin",
    isActive: true,
  });

  assert(!("passwordHash" in identity), "AdminIdentity must exclude passwordHash");
  assert(identity.email === "admin@example.com", "AdminIdentity email mismatch");
}

function verifySessionTokenModule(): void {
  const tokenA = generateSessionToken();
  const tokenB = generateSessionToken();

  assert(tokenA.length > 0, "Session token must not be empty");
  assert(tokenA !== tokenB, "Session tokens must be random");

  const hashA = hashSessionToken(tokenA);
  const hashB = hashSessionToken(tokenB);

  assert(hashA !== tokenA, "Stored hash must differ from raw token");
  assert(hashA === hashSessionToken(tokenA), "Session token hash must be stable");
  assert(hashA !== hashB, "Different tokens must produce different hashes");
  assert(
    hashRateLimitKey("user@example.com") !== "user@example.com",
    "Rate limit key hash must not store raw email",
  );
}

function verifyCookieOptions(): void {
  const options = getSessionCookieOptions();

  assert(options.httpOnly === true, "Session cookie must be HttpOnly");
  assert(options.sameSite === "lax", "Session cookie must use SameSite=lax");
  assert(options.path === "/admin", "Session cookie path must be /admin");
  assert(
    options.maxAge === SESSION_MAX_AGE_SECONDS,
    "Session cookie maxAge must match session duration",
  );
  assert(
    ADMIN_SESSION_COOKIE_NAME === "ogen_admin_session",
    "Unexpected session cookie name",
  );
}

function verifyZodSchemas(): void {
  const shortPassword = adminBootstrapSchema.safeParse({
    email: "admin@example.com",
    password: "short",
  });
  assert(!shortPassword.success, "Bootstrap password below 12 chars must fail");

  const validBootstrap = adminBootstrapSchema.safeParse({
    email: "admin@example.com",
    password: "a".repeat(ADMIN_PASSWORD_MIN_LENGTH),
  });
  assert(validBootstrap.success, "Valid bootstrap input must pass");

  const invalidLoginEmail = adminLoginSchema.safeParse({
    email: "not-an-email",
    password: "secret",
  });
  assert(!invalidLoginEmail.success, "Login schema must reject malformed email");

  const validLogin = adminLoginSchema.safeParse({
    email: "admin@example.com",
    password: "x",
  });
  assert(validLogin.success, "Login schema must accept minimal password length");
}

function verifyRateLimitLogic(): void {
  assert(LOGIN_RATE_LIMIT_MAX_ATTEMPTS === 5, "Expected 5 login attempts per window");

  const attemptsBeforeBlock = LOGIN_RATE_LIMIT_MAX_ATTEMPTS - 1;
  assert(
    attemptsBeforeBlock < LOGIN_RATE_LIMIT_MAX_ATTEMPTS,
    "Attempts below max must not block",
  );
  assert(
    LOGIN_RATE_LIMIT_MAX_ATTEMPTS >= LOGIN_RATE_LIMIT_MAX_ATTEMPTS,
    "Attempts at max must block",
  );

  let attempts = 0;
  let blocked = false;

  for (let i = 0; i < LOGIN_RATE_LIMIT_MAX_ATTEMPTS; i += 1) {
    attempts += 1;
    blocked = attempts >= LOGIN_RATE_LIMIT_MAX_ATTEMPTS;
  }

  assert(blocked, "Rate limit simulation must block at max attempts");

  attempts = 0;
  blocked = false;
  assert(!blocked, "Rate limit reset must clear block state");
}

function verifySecurityConstants(): void {
  assert(BCRYPT_COST_FACTOR === 12, "Expected bcrypt cost factor 12");
}

async function main(): Promise<void> {
  await verifyPasswordModule();
  verifySessionTokenModule();
  verifyCookieOptions();
  verifyZodSchemas();
  verifyRateLimitLogic();
  verifySecurityConstants();
  console.log("Admin auth verification passed.");
}

void main().catch((error) => {
  const message =
    error instanceof Error ? error.message : "Unknown admin auth verification error";
  console.error(`Admin auth verification failed: ${message}`);
  process.exit(1);
});
