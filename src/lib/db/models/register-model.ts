import mongoose, { type Model, type Schema } from "mongoose";

export function registerModel<T>(
  name: string,
  schema: Schema<T>,
): Model<T> {
  if (mongoose.models[name]) {
    return mongoose.models[name] as Model<T>;
  }

  return mongoose.model<T>(name, schema);
}
