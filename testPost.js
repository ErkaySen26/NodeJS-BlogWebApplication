const mongoose = require("mongoose");
const Post = require("./models/Post");
const Category = require("./models/Category");
const User = require("./models/User");

mongoose.connect("mongodb://127.0.0.1/nodeblog_db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function testPostCreation() {
  try {
    console.log("🔍 Test başlıyor...\n");

    // Kategorileri kontrol et
    const categories = await Category.find({}).lean();
    console.log(`📁 Kategori Sayısı: ${categories.length}`);
    categories.forEach((cat) => {
      console.log(`  - ${cat.name} (ID: ${cat._id})`);
    });

    // Kullanıcıları kontrol et
    const users = await User.find({}).lean();
    console.log(`\n👤 Kullanıcı Sayısı: ${users.length}`);
    users.forEach((user) => {
      console.log(`  - ${user.username} (${user.email})`);
    });

    // Postları kontrol et
    const posts = await Post.find({ status: "published" })
      .populate("category", "name")
      .populate("author", "username")
      .lean();

    console.log(`\n📝 Yayınlanmış Post Sayısı: ${posts.length}`);
    posts.forEach((post) => {
      console.log(
        `  - ${post.title} | Kategori: ${post.category?.name || "YOK"} | Yazar: ${post.author?.username || "YOK"}`
      );
    });

    // Test post oluştur
    if (categories.length > 0 && users.length > 0) {
      console.log("\n✨ Test post oluşturuluyor...");

      const testPost = await Post.create({
        title: "Test Post - " + new Date().toLocaleString("tr-TR"),
        content:
          "Bu bir test post'udur. Post ekleme sisteminin çalışıp çalışmadığını kontrol etmek için oluşturulmuştur. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        summary: "Bu bir test post'udur. Post ekleme sisteminin çalışıp çalışmadığını kontrol etmek için oluşturulmuştur.",
        category: categories[0]._id,
        author: users[0]._id,
        post_image: "/img/postimages/test.jpg",
        status: "published",
      });

      console.log(`✅ Test post oluşturuldu: ${testPost._id}`);

      // Yeni post sayısını kontrol et
      const newPostCount = await Post.countDocuments({ status: "published" });
      console.log(`\n📊 Toplam yayınlanmış post sayısı: ${newPostCount}`);
    }

    console.log("\n✅ Test tamamlandı!");
  } catch (error) {
    console.error("❌ Hata:", error.message);
  } finally {
    mongoose.connection.close();
  }
}

testPostCreation();

