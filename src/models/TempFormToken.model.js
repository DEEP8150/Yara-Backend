import mongoose from "mongoose";

const TempFormTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  projectNumber: {
    type: String,
    required: true
  },
  formName: {
    type: String,
    required: true
  },
  used: {
    type: Boolean,
    default: false
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: "10m" }
  }
});

export const TempFormToken = mongoose.model("TempFormToken", TempFormTokenSchema);
