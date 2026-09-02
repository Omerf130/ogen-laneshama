import { ZodError } from "zod";
import { MapperValidationError } from "@/lib/db/mappers/errors";

export class MissingRequiredContentError extends Error {
  constructor(
    public readonly domain: string,
    public readonly key: string,
  ) {
    super(`Required CMS content missing: ${domain} (${key})`);
    this.name = "MissingRequiredContentError";
  }
}

export type DbReadErrorKind =
  | "infrastructure"
  | "missing"
  | "validation"
  | "other";

export function classifyDbReadError(error: unknown): DbReadErrorKind {
  if (error instanceof MissingRequiredContentError) {
    return "missing";
  }

  if (error instanceof MapperValidationError || error instanceof ZodError) {
    return "validation";
  }

  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    const name = error.name.toLowerCase();

    if (
      name.includes("mongo") ||
      name.includes("mongoose") ||
      message.includes("mongodb") ||
      message.includes("connection failed") ||
      message.includes("connection refused") ||
      message.includes("timed out") ||
      message.includes("timeout") ||
      message.includes("network") ||
      message.includes("server selection") ||
      message.includes("mongoserverselectionerror") ||
      message.includes("mongonetworkerror") ||
      message.includes("mongo_timeout") ||
      message.includes("mongodb_uri is not set")
    ) {
      return "infrastructure";
    }
  }

  return "other";
}
