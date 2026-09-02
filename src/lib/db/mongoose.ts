import mongoose from "mongoose";

const MONGODB_URI_ENV = "MONGODB_URI";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache ?? {
  conn: null,
  promise: null,
};

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

function getMongoDbUri(): string {
  const uri = process.env[MONGODB_URI_ENV]?.trim();

  if (!uri) {
    throw new Error(
      `${MONGODB_URI_ENV} is not set. Add it to .env.local for local development.`,
    );
  }

  if (!/^mongodb(\+srv)?:\/\//.test(uri)) {
    throw new Error(
      `${MONGODB_URI_ENV} must start with mongodb:// or mongodb+srv://`,
    );
  }

  return uri;
}

function sanitizeConnectionError(error: unknown): Error {
  if (error instanceof Error) {
    if (
      error.message.includes(MONGODB_URI_ENV) ||
      error.message.startsWith("Invalid scheme")
    ) {
      return error;
    }

    return new Error(`MongoDB connection failed: ${error.message}`);
  }

  return new Error("MongoDB connection failed due to an unknown error.");
}

export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  const uri = getMongoDbUri();

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, {
      bufferCommands: false,
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw sanitizeConnectionError(error);
  }

  return cached.conn;
}

export async function pingDatabase(): Promise<void> {
  const mongooseInstance = await connectDB();
  const db = mongooseInstance.connection.db;

  if (!db) {
    throw new Error("MongoDB connection is not ready.");
  }

  await db.admin().ping();
}