const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    avatar: {
      type: String,
      default: "/img/default-avatar.png",
    },
    bio: {
      type: String,
      maxlength: 500,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Şifre hash'leme middleware'i (şimdilik basit, sonra bcrypt ekleyeceğiz)
UserSchema.pre("save", function (next) {
  if (!this.isModified("password")) return next();
  // Şimdilik basit, sonra bcrypt ile hash'leyeceğiz
  next();
});

// Kullanıcının tam adını döndüren virtual
UserSchema.virtual("fullName").get(function () {
  return this.username;
});

// JSON'a dönüştürürken şifreyi gizle
UserSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model("User", UserSchema);
