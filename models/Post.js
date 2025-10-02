const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    summary: { type: String, maxlength: 200 }, // Özet için
    date: { type: Date, default: Date.now },
    post_image: { type: String, required: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    views: { type: Number, default: 0 }, // Görüntülenme sayısı
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "published",
    },
  },
  {
    timestamps: true, // createdAt ve updatedAt otomatik eklenir
  }
);

// Post başlığından slug oluşturma
PostSchema.virtual("slug").get(function () {
  return this.title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "") // Özel karakterleri kaldır
    .replace(/\s+/g, "-") // Boşlukları tire ile değiştir
    .replace(/-+/g, "-"); // Çoklu tireleri tek tire yap
});

// JSON'a dönüştürürken virtual alanları dahil et
PostSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Post", PostSchema);
