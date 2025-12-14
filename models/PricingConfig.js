import mongoose from "mongoose";

const PricingConfigSchema = new mongoose.Schema(
  {
    userType: {
      type: String,
      enum: ["user", "admin"],
      required: true,
      unique: true,
    },

    slabs: [
      {
        min: Number,     // inclusive
        max: Number,     // exclusive
        percent: Number // markup %
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.PricingConfig ||
  mongoose.model("PricingConfig", PricingConfigSchema);
