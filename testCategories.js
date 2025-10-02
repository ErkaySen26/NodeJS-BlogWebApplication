const mongoose = require("mongoose");
const Category = require("./models/Category");

mongoose.connect("mongodb://127.0.0.1/nodeblog_db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function testCategories() {
  try {
    console.log("🔍 Kategori testi başlıyor...\n");

    // Tüm kategorileri getir
    const allCategories = await Category.find({});
    console.log(`📁 Toplam Kategori Sayısı: ${allCategories.length}`);
    allCategories.forEach((cat) => {
      console.log(`  - ${cat.name} (ID: ${cat._id}, isActive: ${cat.isActive})`);
    });

    // Aktif kategorileri getir
    const activeCategories = await Category.find({ isActive: true });
    console.log(`\n✅ Aktif Kategori Sayısı: ${activeCategories.length}`);
    activeCategories.forEach((cat) => {
      console.log(`  - ${cat.name} (ID: ${cat._id})`);
    });

    // Lean query ile getir
    const leanCategories = await Category.find({ isActive: true }).lean();
    console.log(`\n⚡ Lean Query Kategori Sayısı: ${leanCategories.length}`);
    leanCategories.forEach((cat) => {
      console.log(`  - ${cat.name} (ID: ${cat._id})`);
    });

    console.log("\n✅ Test tamamlandı!");
  } catch (error) {
    console.error("❌ Hata:", error.message);
  } finally {
    mongoose.connection.close();
  }
}

testCategories();
