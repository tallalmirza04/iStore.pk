import mongoose from "mongoose";

const riderSchema = new mongoose.Schema({
  name: String,
  phone: String,
  status: {
    type: String,
    default: "on",
  },
});

export default mongoose.model("Rider", riderSchema);