export async function resolve(specifier, context, nextResolve) {
  if (specifier === "server-only") {
    return {
      url: new URL("./empty-module.mjs", import.meta.url).href,
      shortCircuit: true,
    };
  }

  return nextResolve(specifier, context);
}
