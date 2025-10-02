const mongoose = require("mongoose");
const User = require("./models/User");
const Category = require("./models/Category");
const Post = require("./models/Post");

// MongoDB bağlantısı
mongoose.connect("mongodb://127.0.0.1/nodeblog_db");

async function seedData() {
  try {
    console.log("🌱 Test verisi ekleniyor...");

    // Mevcut verileri temizle
    await User.deleteMany({});
    await Category.deleteMany({});
    await Post.deleteMany({});

    // Test kullanıcıları oluştur
    const users = await User.create([
      {
        username: "admin",
        email: "admin@test.com",
        password: "123456",
        role: "admin"
      },
      {
        username: "yazar1",
        email: "yazar1@test.com",
        password: "123456",
        role: "user"
      },
      {
        username: "yazar2",
        email: "yazar2@test.com",
        password: "123456",
        role: "user"
      }
    ]);

    console.log("✅ Kullanıcılar oluşturuldu");

    // Test kategorileri oluştur
    const categories = await Category.create([
      {
        name: "Teknoloji",
        description: "Teknoloji ile ilgili yazılar",
        color: "#007bff"
      },
      {
        name: "Yazılım",
        description: "Yazılım geliştirme konuları",
        color: "#28a745"
      },
      {
        name: "Web Tasarım",
        description: "Web tasarım ve UI/UX",
        color: "#dc3545"
      },
      {
        name: "Mobil",
        description: "Mobil uygulama geliştirme",
        color: "#ffc107"
      },
      {
        name: "Veritabanı",
        description: "Veritabanı yönetimi",
        color: "#6f42c1"
      }
    ]);

    console.log("✅ Kategoriler oluşturuldu");

    // Test postları oluştur
    const posts = [];
    const postTitles = [
      "Node.js ile Modern Web Uygulamaları",
      "MongoDB Veritabanı Yönetimi",
      "Express.js Framework Kullanımı",
      "React ile Frontend Geliştirme",
      "JavaScript ES6+ Özellikleri",
      "CSS Grid ve Flexbox Kullanımı",
      "Responsive Web Tasarım İpuçları",
      "API Geliştirme Best Practices",
      "Docker ile Konteynerleştirme",
      "Git Version Control Sistemi",
      "Agile Yazılım Geliştirme",
      "Cybersecurity Temelleri"
    ];

    const postContents = [
      "Node.js, JavaScript'i sunucu tarafında çalıştırmamızı sağlayan güçlü bir platform. Bu yazıda Node.js ile modern web uygulamaları nasıl geliştirileceğini öğreneceksiniz.",
      "MongoDB, NoSQL veritabanı dünyasının en popüler temsilcilerinden biri. Esnek yapısı ve yüksek performansı ile modern uygulamalarda tercih ediliyor.",
      "Express.js, Node.js için minimalist ve esnek bir web framework'ü. Hızlı ve kolay API geliştirme imkanı sunar.",
      "React, kullanıcı arayüzleri oluşturmak için Facebook tarafından geliştirilen popüler bir JavaScript kütüphanesi.",
      "JavaScript ES6+ ile gelen yeni özellikler, kod yazımını daha kolay ve okunabilir hale getiriyor.",
      "CSS Grid ve Flexbox, modern web tasarımında layout oluşturmanın en etkili yolları.",
      "Responsive tasarım, web sitelerinin farklı cihazlarda mükemmel görünmesini sağlar.",
      "API geliştirirken dikkat edilmesi gereken en önemli noktalar ve best practice'ler.",
      "Docker, uygulamaları konteynerleştirerek deployment sürecini kolaylaştırır.",
      "Git, yazılım geliştirmede version control için vazgeçilmez bir araç.",
      "Agile metodoloji ile daha verimli yazılım geliştirme süreçleri.",
      "Siber güvenlik temellerini öğrenerek güvenli uygulamalar geliştirin."
    ];

    for (let i = 0; i < postTitles.length; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      
      posts.push({
        title: postTitles[i],
        content: postContents[i] + " Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        summary: postContents[i],
        category: randomCategory._id,
        author: randomUser._id,
        post_image: `/img/post${(i % 3) + 1}.jpg`, // post1.jpg, post2.jpg, post3.jpg döngüsü
        views: Math.floor(Math.random() * 1000) + 10,
        status: "published"
      });
    }

    await Post.create(posts);
    console.log("✅ Postlar oluşturuldu");

    console.log("\n🎉 Test verisi başarıyla eklendi!");
    console.log(`👥 ${users.length} kullanıcı`);
    console.log(`📁 ${categories.length} kategori`);
    console.log(`📝 ${posts.length} post`);
    
    console.log("\n🔑 Test Kullanıcıları:");
    console.log("Admin: admin@test.com / 123456");
    console.log("Yazar1: yazar1@test.com / 123456");
    console.log("Yazar2: yazar2@test.com / 123456");

  } catch (error) {
    console.error("❌ Hata:", error);
  } finally {
    mongoose.connection.close();
  }
}

seedData();
