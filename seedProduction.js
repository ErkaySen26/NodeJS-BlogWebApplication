require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");
const Category = require("./models/Category");
const Post = require("./models/Post");

// MongoDB bağlantısı
const mongoUrl = process.env.MONGODB_URI || "mongodb://127.0.0.1/nodeblog_db";

async function seedProduction() {
  try {
    console.log("🌱 Production seed başlıyor...");
    console.log("MongoDB URL:", mongoUrl.includes('mongodb.net') ? 'MongoDB Atlas' : 'Local MongoDB');
    
    await mongoose.connect(mongoUrl);
    console.log("✅ MongoDB bağlantısı başarılı");

    // Mevcut verileri kontrol et
    const userCount = await User.countDocuments();
    const categoryCount = await Category.countDocuments();
    const postCount = await Post.countDocuments();

    console.log(`\n📊 Mevcut veriler:`);
    console.log(`- Kullanıcılar: ${userCount}`);
    console.log(`- Kategoriler: ${categoryCount}`);
    console.log(`- Postlar: ${postCount}`);

    // Eğer veri yoksa seed et
    if (userCount === 0) {
      console.log("\n👤 Kullanıcılar oluşturuluyor...");
      
      const users = await User.create([
        {
          username: "admin",
          email: "admin@nodeblog.com",
          password: "123456",
          role: "admin"
        },
        {
          username: "yazar1",
          email: "yazar1@nodeblog.com", 
          password: "123456",
          role: "user"
        },
        {
          username: "yazar2",
          email: "yazar2@nodeblog.com",
          password: "123456", 
          role: "user"
        }
      ]);
      
      console.log(`✅ ${users.length} kullanıcı oluşturuldu`);
    }

    if (categoryCount === 0) {
      console.log("\n📁 Kategoriler oluşturuluyor...");
      
      const categories = await Category.create([
        {
          name: "Teknoloji",
          description: "Teknoloji haberleri ve gelişmeleri",
          color: "#007bff",
          isActive: true
        },
        {
          name: "Yazılım",
          description: "Yazılım geliştirme konuları",
          color: "#28a745",
          isActive: true
        },
        {
          name: "Web Tasarım",
          description: "Web tasarım ve UI/UX",
          color: "#dc3545",
          isActive: true
        },
        {
          name: "Mobil",
          description: "Mobil uygulama geliştirme",
          color: "#ffc107",
          isActive: true
        },
        {
          name: "Yapay Zeka",
          description: "AI ve Machine Learning",
          color: "#6f42c1",
          isActive: true
        }
      ]);
      
      console.log(`✅ ${categories.length} kategori oluşturuldu`);
    }

    if (postCount === 0) {
      console.log("\n📝 Örnek postlar oluşturuluyor...");
      
      const users = await User.find();
      const categories = await Category.find();
      
      const posts = await Post.create([
        {
          title: "Node.js ile Modern Web Uygulamaları",
          content: "Node.js, JavaScript'i sunucu tarafında çalıştırmamızı sağlayan güçlü bir platform. Bu yazıda Node.js ile modern web uygulamaları geliştirme konusunu ele alacağız. Express.js framework'ü kullanarak RESTful API'ler oluşturabilir, MongoDB ile veritabanı işlemlerini gerçekleştirebilir ve modern web uygulamaları geliştirebiliriz.",
          summary: "Node.js ile modern web uygulamaları geliştirme rehberi",
          category: categories[1]._id, // Yazılım
          author: users[0]._id, // admin
          post_image: "/img/postimages/nodejs.jpg",
          status: "published",
          views: 150
        },
        {
          title: "React ile Frontend Geliştirme",
          content: "React, Facebook tarafından geliştirilen ve günümüzde en popüler frontend kütüphanelerinden biri. Component-based yapısı sayesinde yeniden kullanılabilir UI bileşenleri oluşturabiliriz. Bu yazıda React'in temel kavramlarını, hooks yapısını ve modern React uygulamaları geliştirme tekniklerini inceleyeceğiz.",
          summary: "React ile modern frontend uygulamaları geliştirme",
          category: categories[0]._id, // Teknoloji
          author: users[1]._id, // yazar1
          post_image: "/img/postimages/react.jpg",
          status: "published",
          views: 200
        },
        {
          title: "MongoDB Veritabanı Yönetimi",
          content: "MongoDB, NoSQL veritabanları arasında en popüler olanlardan biri. Doküman tabanlı yapısı sayesinde esnek veri modelleme imkanı sunar. Bu yazıda MongoDB'nin temel kavramlarını, CRUD işlemlerini, indexleme stratejilerini ve performans optimizasyonlarını ele alacağız.",
          summary: "MongoDB ile veritabanı yönetimi ve optimizasyon teknikleri",
          category: categories[1]._id, // Yazılım
          author: users[2]._id, // yazar2
          post_image: "/img/postimages/mongodb.jpg",
          status: "published",
          views: 120
        },
        {
          title: "Responsive Web Tasarım İpuçları",
          content: "Günümüzde web siteleri farklı cihazlarda mükemmel görünmelidir. Responsive tasarım, web sitelerinin mobil, tablet ve masaüstü cihazlarda optimal kullanıcı deneyimi sunmasını sağlar. Bu yazıda CSS Grid, Flexbox ve media queries kullanarak responsive tasarım teknikleri paylaşacağız.",
          summary: "Modern responsive web tasarım teknikleri ve ipuçları",
          category: categories[2]._id, // Web Tasarım
          author: users[0]._id, // admin
          post_image: "/img/postimages/responsive.jpg",
          status: "published",
          views: 180
        },
        {
          title: "Yapay Zeka ve Geleceği",
          content: "Yapay zeka teknolojisi hızla gelişiyor ve hayatımızın her alanında etkisini gösteriyor. Machine Learning, Deep Learning ve Natural Language Processing gibi konular artık günlük hayatımızın parçası. Bu yazıda AI'ın mevcut durumu, gelecek potansiyeli ve etik boyutlarını inceleyeceğiz.",
          summary: "Yapay zeka teknolojilerinin günümüzdeki durumu ve geleceği",
          category: categories[4]._id, // Yapay Zeka
          author: users[1]._id, // yazar1
          post_image: "/img/postimages/ai.jpg",
          status: "published",
          views: 300
        }
      ]);
      
      console.log(`✅ ${posts.length} post oluşturuldu`);
    }

    console.log("\n🎉 Production seed tamamlandı!");
    
    // Final durum
    const finalUserCount = await User.countDocuments();
    const finalCategoryCount = await Category.countDocuments();
    const finalPostCount = await Post.countDocuments();

    console.log(`\n📊 Final durum:`);
    console.log(`- Kullanıcılar: ${finalUserCount}`);
    console.log(`- Kategoriler: ${finalCategoryCount}`);
    console.log(`- Postlar: ${finalPostCount}`);

  } catch (error) {
    console.error("❌ Seed hatası:", error);
  } finally {
    mongoose.connection.close();
  }
}

// Eğer bu dosya direkt çalıştırılıyorsa seed'i başlat
if (require.main === module) {
  seedProduction();
}

module.exports = seedProduction;
