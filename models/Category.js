const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: 50,
    },
    description: {
      type: String,
      maxlength: 200,
    },
    color: {
      type: String,
      default: "#007bff", // Bootstrap primary color
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

// Kategori slug'ı oluşturma
CategorySchema.virtual("slug").get(function () {
  return this.name
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
});

// Bu kategorideki post sayısını döndüren virtual
CategorySchema.virtual("postCount", {
  ref: "Post",
  localField: "_id",
  foreignField: "category",
  count: true,
});

CategorySchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Category", CategorySchema);
