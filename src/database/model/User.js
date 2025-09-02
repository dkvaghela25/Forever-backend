const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  phone_no: {
    type: BigInt,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add auto-increment plugin for userId
UserSchema.plugin(AutoIncrement, { inc_field: "userId" });

// Export model
module.exports = mongoose.model("User", UserSchema);
