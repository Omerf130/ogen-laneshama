import "server-only";

export class AuthUnavailableError extends Error {
  constructor(message = "Authentication unavailable") {
    super(message);
    this.name = "AuthUnavailableError";
  }
}

export class InvalidCredentialsError extends Error {
  constructor(message = "Invalid credentials") {
    super(message);
    this.name = "InvalidCredentialsError";
  }
}

export class RateLimitExceededError extends Error {
  constructor(message = "Rate limit exceeded") {
    super(message);
    this.name = "RateLimitExceededError";
  }
}
