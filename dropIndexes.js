const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1/nodeblog_db");

async function dropIndexes() {
  try {
    const db = mongoose.connection.db;
    
    // Users collection'daki password index'ini sil
    await db.collection('users').dropIndex('password_1');
    console.log("✅ Password index silindi");
    
  } catch (error) {
    if (error.code === 27) {
      console.log("ℹ️  Index zaten yok");
    } else {
      console.error("❌ Hata:", error.message);
    }
  } finally {
    mongoose.connection.close();
  }
}

mongoose.connection.once('open', () => {
  dropIndexes();
});

