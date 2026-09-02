import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
import { ZodError } from "zod";
import { loadEnvLocal } from "./lib/load-env-local";
import {
  resetContentSourceCacheForTests,
} from "../src/lib/content/content-source";
import {
  classifyDbReadError,
  MissingRequiredContentError,
} from "../src/lib/content/internal/db-errors";
import {
  readContent,
  readContentOptional,
} from "../src/lib/content/internal/read-content";
import { MapperValidationError } from "../src/lib/db/mappers/errors";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

function runGetterSection(mode: "static" | "db"): void {
  const scriptPath = resolve(
    process.cwd(),
    "scripts/verify-content-source-getters.ts",
  );
  const stubPath = resolve(
    process.cwd(),
    "scripts/lib/register-server-only-stub.cjs",
  );
  const tsxCli = resolve(process.cwd(), "node_modules/tsx/dist/cli.mjs");
  const result = spawnSync(
    process.execPath,
    [tsxCli, "--require", stubPath, scriptPath, mode],
    {
      env: {
        ...process.env,
        CONTENT_SOURCE: mode,
      },
      stdio: "inherit",
    },
  );

  assert(
    result.status === 0,
    `${mode} mode getter verification exited with code ${String(result.status)}`,
  );
}

async function testClassifyDbReadError(): Promise<void> {
  assert(
    classifyDbReadError(new MissingRequiredContentError("Homepage", "homepage")) ===
      "missing",
    "MissingRequiredContentError should classify as missing",
  );

  assert(
    classifyDbReadError(
      new MapperValidationError("SiteSettings", "mainNav", ["invalid"]),
    ) === "validation",
    "MapperValidationError should classify as validation",
  );

  assert(
    classifyDbReadError(
      new ZodError([
        {
          code: "custom",
          message: "invalid",
          path: [],
        },
      ]),
    ) === "validation",
    "ZodError should classify as validation",
  );

  assert(
    classifyDbReadError(new Error("MongoServerSelectionError: connection timed out")) ===
      "infrastructure",
    "Mongo timeout should classify as infrastructure",
  );

  assert(
    classifyDbReadError(new Error("MONGODB_URI is not set")) ===
      "infrastructure",
    "Missing URI should classify as infrastructure",
  );

  assert(
    classifyDbReadError(new TypeError("Cannot read properties of undefined")) ===
      "other",
    "Programming errors should classify as other",
  );

  console.log("  ✓ classifyDbReadError");
}

async function withContentSource<T>(
  source: "static" | "db" | "db-with-fallback",
  fn: () => Promise<T>,
): Promise<T> {
  const previous = process.env.CONTENT_SOURCE;
  process.env.CONTENT_SOURCE = source;
  resetContentSourceCacheForTests();

  try {
    return await fn();
  } finally {
    if (previous === undefined) {
      delete process.env.CONTENT_SOURCE;
    } else {
      process.env.CONTENT_SOURCE = previous;
    }
    resetContentSourceCacheForTests();
  }
}

async function testReadContentFallbackBehavior(): Promise<void> {
  await withContentSource("static", async () => {
    let dbCalled = false;
    const result = await readContent({
      getter: "testStatic",
      domain: "test",
      staticRead: () => "static-value",
      dbRead: async () => {
        dbCalled = true;
        return "db-value";
      },
      allowFallbackOnMissing: true,
    });

    assert(result === "static-value", "Static mode must return staticRead result");
    assert(!dbCalled, "Static mode must not invoke dbRead");
  });

  await withContentSource("db-with-fallback", async () => {
    const infraResult = await readContent({
      getter: "testInfra",
      domain: "test",
      staticRead: () => ({ ok: "static" }),
      dbRead: async () => {
        throw new Error("MongoNetworkError: connection refused");
      },
      allowFallbackOnMissing: false,
    });

    assert(
      infraResult.ok === "static",
      "Infrastructure error should fallback in db-with-fallback",
    );
  });

  await withContentSource("db-with-fallback", async () => {
    const missingResult = await readContent({
      getter: "testMissing",
      domain: "homepage",
      staticRead: () => ({ title: "static homepage" }),
      dbRead: async () => {
        throw new MissingRequiredContentError("Homepage", "homepage");
      },
      allowFallbackOnMissing: true,
    });

    assert(
      missingResult.title === "static homepage",
      "Missing singleton should fallback when allowed",
    );
  });

  await withContentSource("db-with-fallback", async () => {
    let threw = false;

    try {
      await readContent({
        getter: "testMissingNoFallback",
        domain: "treatments",
        staticRead: () => [],
        dbRead: async () => {
          throw new MissingRequiredContentError("Treatment", "missing-slug");
        },
        allowFallbackOnMissing: false,
      });
    } catch (error) {
      threw = error instanceof MissingRequiredContentError;
    }

    assert(threw, "Missing content must not fallback when allowFallbackOnMissing=false");
  });

  await withContentSource("db-with-fallback", async () => {
    let threw = false;

    try {
      await readContent({
        getter: "testValidation",
        domain: "site-settings",
        staticRead: () => ({}),
        dbRead: async () => {
          throw new MapperValidationError("SiteSettings", "mainNav", ["bad nav"]);
        },
        allowFallbackOnMissing: true,
      });
    } catch (error) {
      threw = error instanceof MapperValidationError;
    }

    assert(threw, "MapperValidationError must rethrow without fallback");
  });

  await withContentSource("db", async () => {
    const emptyFaq = await readContent({
      getter: "testEmptyFaq",
      domain: "faq",
      staticRead: () => [{ id: "static-faq", question: "q", answer: "a" }],
      dbRead: async () => [],
      allowFallbackOnMissing: false,
    });

    assert(
      emptyFaq.length === 0,
      "Empty FAQ DB result must return [] without static fallback",
    );
  });

  await withContentSource("db", async () => {
    const emptyTestimonials = await readContent({
      getter: "testEmptyTestimonials",
      domain: "testimonials",
      staticRead: () => [{ id: "1", quote: "static" }],
      dbRead: async () => [],
      allowFallbackOnMissing: false,
    });

    assert(
      emptyTestimonials.length === 0,
      "Empty testimonials DB result must return [] without static fallback",
    );
  });

  await withContentSource("db", async () => {
    const missingTreatment = await readContentOptional({
      getter: "testMissingTreatment",
      domain: "treatment:inactive",
      staticRead: () => treatmentsStaticStub(),
      dbRead: async () => undefined,
      allowFallbackOnMissing: false,
    });

    assert(
      missingTreatment === undefined,
      "Missing/inactive treatment must return undefined without fallback",
    );
  });

  await withContentSource("db-with-fallback", async () => {
    let threw = false;

    try {
      await readContent({
        getter: "testValidationDbMode",
        domain: "site-settings",
        staticRead: () => ({}),
        dbRead: async () => {
          throw new MapperValidationError("SiteSettings", "mainNav", ["bad nav"]);
        },
      });
    } catch (error) {
      threw = error instanceof MapperValidationError;
    }

    assert(threw, "Validation errors must throw in db-with-fallback mode");
  });

  console.log("  ✓ readContent fallback policies");
}

function treatmentsStaticStub() {
  return {
    slug: "psychotherapy",
    title: "static-only",
  };
}

async function testInvalidContentSource(): Promise<void> {
  const previous = process.env.CONTENT_SOURCE;
  process.env.CONTENT_SOURCE = "invalid-mode";
  resetContentSourceCacheForTests();

  let threw = false;

  try {
    await readContent({
      getter: "testInvalidSource",
      domain: "test",
      staticRead: () => "ok",
      dbRead: async () => "db",
    });
  } catch (error) {
    threw =
      error instanceof Error &&
      error.message.includes('Invalid CONTENT_SOURCE "invalid-mode"');
  } finally {
    if (previous === undefined) {
      delete process.env.CONTENT_SOURCE;
    } else {
      process.env.CONTENT_SOURCE = previous;
    }
    resetContentSourceCacheForTests();
  }

  assert(threw, "Invalid CONTENT_SOURCE must fail fast");
  console.log("  ✓ invalid CONTENT_SOURCE rejected");
}

async function main(): Promise<void> {
  loadEnvLocal();

  console.log("Content source verification...");

  console.log("\n1. Fallback unit tests");
  await testClassifyDbReadError();
  await testReadContentFallbackBehavior();
  await testInvalidContentSource();

  console.log("\n2. Static mode getter integration (child process)");
  runGetterSection("static");

  console.log("\n3. DB mode getter integration (child process)");
  runGetterSection("db");

  console.log("\nContent source verification passed.");
  process.exit(0);
}

void main().catch((error: unknown) => {
  const message =
    error instanceof Error
      ? error.message
      : "Unknown content source verification error.";
  console.error(`Content source verification failed: ${message}`);
  process.exit(1);
});
