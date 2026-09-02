/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Allows CLI verification scripts to import modules that use `import "server-only"`.
 */
const Module = require("node:module");

const originalLoad = Module._load;
let serverOnlyPath;

try {
  serverOnlyPath = require.resolve("server-only");
} catch {
  serverOnlyPath = "server-only";
}

Module._load = function loadWithServerOnlyStub(request, parent, isMain) {
  if (
    request === "server-only" ||
    request === serverOnlyPath ||
    (typeof request === "string" && request.includes(`${Module.pathSep}server-only${Module.pathSep}`))
  ) {
    return {};
  }

  return originalLoad.call(this, request, parent, isMain);
};
