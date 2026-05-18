const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    sessionToken: {
      type: String,
      required: true,
      unique: true
    },
    deviceInfo: {
      type: String,
      default: "Unknown Device"
    },
    ipAddress: {
      type: String,
      default: "Unknown IP"
    },
    userAgent: {
      type: String,
      default: "Unknown"
    },
    isActive: {
      type: Boolean,
      default: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    expiresAt: {
      type: Date,
      required: true
    }
  }
);

sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Session = mongoose.model("Session", sessionSchema);

module.exports = Session;
