import {
  shouldSyncBaselineOnSaveComplete,
} from "../src/components/admin/forms/useAdminCmsSubmit";
import { serializeAdminFormSnapshot } from "../src/components/admin/forms/useAdminFormState";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

function verifySaveCompletionPredicate(): void {
  assert(
    shouldSyncBaselineOnSaveComplete(true, false, "saved"),
    "Baseline sync must run when pending completes with success",
  );
  assert(
    !shouldSyncBaselineOnSaveComplete(false, false, "saved"),
    "Baseline sync must not run without a pending transition",
  );
  assert(
    !shouldSyncBaselineOnSaveComplete(true, true, "saved"),
    "Baseline sync must not run while still pending",
  );
  assert(
    !shouldSyncBaselineOnSaveComplete(true, false, undefined),
    "Baseline sync must not run on failed save",
  );
}

function verifyDirtyAfterBaselineReset(): void {
  const baseline = { title: "A", image: { src: "/a.webp", alt: "a" } };
  const snapshot = serializeAdminFormSnapshot(baseline);
  const edited = { title: "B", image: { src: "/a.webp", alt: "a" } };
  assert(
    serializeAdminFormSnapshot(edited) !== snapshot,
    "Text edit must mark form dirty after baseline reset",
  );
  const imageEdit = {
    title: "A",
    image: { src: "/b.webp", alt: "a", mediaId: "1" },
  };
  assert(
    serializeAdminFormSnapshot(imageEdit) !== snapshot,
    "Image edit must mark form dirty after baseline reset",
  );
}

function verifyRepeatedSaveCycle(): void {
  let baseline = serializeAdminFormSnapshot({ count: 1 });
  let values = { count: 1 };
  assert(
    serializeAdminFormSnapshot(values) === baseline,
    "Clean after first baseline",
  );

  values = { count: 2 };
  assert(
    serializeAdminFormSnapshot(values) !== baseline,
    "Dirty after edit",
  );

  baseline = serializeAdminFormSnapshot(values);
  assert(
    serializeAdminFormSnapshot(values) === baseline,
    "Clean after save baseline sync",
  );

  values = { count: 3 };
  assert(
    serializeAdminFormSnapshot(values) !== baseline,
    "Dirty again after second edit",
  );
}

function main(): void {
  console.log("Admin form state verification...");
  verifySaveCompletionPredicate();
  console.log("  ✓ save completion baseline predicate");
  verifyDirtyAfterBaselineReset();
  console.log("  ✓ dirty detection after baseline");
  verifyRepeatedSaveCycle();
  console.log("  ✓ repeated edit/save cycle snapshots");
  console.log("Admin form state verification passed.");
}

main();
