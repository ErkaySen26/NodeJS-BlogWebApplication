const { engine } = require("express-handlebars");
const express = require("express");
const mongoose = require("mongoose");
const Category = require("./models/Category");

const app = express();

// Handlebars konfigürasyonu
app.engine(
  "handlebars",
  engine({
    defaultLayout: "main",
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
    },
  })
);
app.set("view engine", "handlebars");

mongoose.connect("mongodb://127.0.0.1/nodeblog_db");

async function testHandlebars() {
  try {
    console.log("🔍 Handlebars test başlıyor...\n");

    // Kategorileri getir
    const categories = await Category.find({ isActive: true }).lean();
    console.log(`📁 Kategori Sayısı: ${categories.length}`);

    categories.forEach((cat, index) => {
      console.log(`${index + 1}. Kategori:`);
      console.log(`   - name: ${cat.name}`);
      console.log(`   - _id: ${cat._id}`);
      console.log(`   - isActive: ${cat.isActive}`);
      console.log(`   - Type: ${typeof cat}`);
      console.log(`   - Constructor: ${cat.constructor.name}`);
      console.log(`   - Has own property 'name': ${cat.hasOwnProperty('name')}`);
      console.log(`   - Has own property '_id': ${cat.hasOwnProperty('_id')}`);
      console.log("");
    });

    // Test template render
    const testTemplate = `
      <h1>Kategoriler: {{categories.length}} adet</h1>
      {{#each categories}}
        <p>- {{name}} (ID: {{_id}})</p>
      {{/each}}
    `;

    console.log("📝 Template Test:");
    console.log("Template:", testTemplate);
    console.log("Data:", { categories });

    console.log("\n✅ Test tamamlandı!");
  } catch (error) {
    console.error("❌ Hata:", error.message);
  } finally {
    mongoose.connection.close();
  }
}

testHandlebars();
