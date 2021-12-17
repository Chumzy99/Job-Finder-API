import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt = require("jsonwebtoken");

export interface IUser extends mongoose.Document {
  fullname: any;
  email: string;
  role: string;
  password: string;
  comparePasswords(
    candidatePassword: string,
    next: (err: Error | null, same: boolean | null) => void
  ): void;
}

const UserSchema: mongoose.Schema<IUser> = new mongoose.Schema({
  fullname: {
    type: String,
    required: [true, "Please provide name"],
  },
  email: {
    type: String,
    required: [true, "Please provide email"],
    lowercase: true,
    trim: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide a valid email",
    ],
    unique: true,
  },
  role: {
    type: String,
    enum: ["job-seeker", "employer"],
    required: [true, "Please provide a user role"],
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
    minlength: 6,
    trim: true,
  },
});

UserSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// UserSchema.methods.getName = function <IUser>() {
//   return this.fullname;
// };

UserSchema.methods.createJWT = function () {
  return jwt.sign(
    {
      userId: this._id,
      fullname: this.fullname,
      role: this.role,
    },
    process.env.JWT_SECRET as string,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

UserSchema.methods.comparePassword = async function (incomingPassword: string) {
  const isMatch = await bcrypt.compare(incomingPassword, this.password);
  return isMatch;
};

export default mongoose.model("User", UserSchema);
