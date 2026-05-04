import mongoose from "mongoose";

async function connectDatabase() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGODB_URI is missing. Add it in backend/.env");
  }

  await mongoose.connect(mongoUri);
}

export default connectDatabase;
