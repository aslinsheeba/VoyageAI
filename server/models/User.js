import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  name: String,
  email: String,
  photoURL: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("User", userSchema);
