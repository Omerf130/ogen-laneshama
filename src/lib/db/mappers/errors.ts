import { ZodError } from "zod";

export class MapperValidationError extends Error {
  constructor(
    public readonly domain: string,
    public readonly key: string,
    public readonly issues: string[],
  ) {
    super(
      `Mapper validation failed for ${domain} (${key}): ${issues.join("; ")}`,
    );
    this.name = "MapperValidationError";
  }
}

function formatZodIssues(error: ZodError): string[] {
  return error.issues.map((issue) => {
    const path = issue.path.length > 0 ? issue.path.join(".") : "(root)";
    return `${path}: ${issue.message}`;
  });
}

export function parseWithMapperValidation<T>(
  domain: string,
  key: string,
  schema: { parse: (value: unknown) => T },
  value: unknown,
): T {
  try {
    return schema.parse(value);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new MapperValidationError(domain, key, formatZodIssues(error));
    }

    throw error;
  }
}
