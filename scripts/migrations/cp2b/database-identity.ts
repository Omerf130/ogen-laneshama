export interface MongoDatabaseIdentity {
  host: string;
  database: string;
  scheme: "mongodb" | "mongodb+srv";
}

export function getMongoDatabaseIdentityFromEnv(): MongoDatabaseIdentity {
  const uri = process.env.MONGODB_URI?.trim();

  if (!uri) {
    throw new Error("MONGODB_URI is not set.");
  }

  return parseMongoDatabaseIdentity(uri);
}

export function parseMongoDatabaseIdentity(uri: string): MongoDatabaseIdentity {
  const scheme = uri.startsWith("mongodb+srv://")
    ? "mongodb+srv"
    : uri.startsWith("mongodb://")
      ? "mongodb"
      : (() => {
          throw new Error("MONGODB_URI must start with mongodb:// or mongodb+srv://");
        })();

  const withoutScheme = uri.replace(/^mongodb(\+srv)?:\/\//, "");
  const atIndex = withoutScheme.lastIndexOf("@");
  const hostAndRest =
    atIndex >= 0 ? withoutScheme.slice(atIndex + 1) : withoutScheme;

  const slashIndex = hostAndRest.indexOf("/");
  const hostPart =
    slashIndex >= 0
      ? hostAndRest.slice(0, slashIndex)
      : hostAndRest.split("?")[0] ?? hostAndRest;

  let database = "";
  if (slashIndex >= 0) {
    database = hostAndRest.slice(slashIndex + 1).split("?")[0]?.trim() ?? "";
  }

  if (!hostPart) {
    throw new Error("Could not parse MongoDB host from MONGODB_URI.");
  }

  return {
    scheme,
    host: hostPart,
    database: database || "(default)",
  };
}

export function formatDatabaseIdentity(identity: MongoDatabaseIdentity): string {
  return `${identity.scheme}://${identity.host}/${identity.database}`;
}
