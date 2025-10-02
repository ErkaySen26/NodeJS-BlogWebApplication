const mongoose = require('mongoose');
const Category = require('./models/Category');
const Post = require('./models/Post');
const User = require('./models/User');

mongoose.connect('mongodb://127.0.0.1/nodeblog_db');

async function checkData() {
  try {
    console.log('🔍 Veritabanı Kontrolü Başlıyor...\n');

    // Kategorileri kontrol et
    const categories = await Category.find({});
    console.log(`📁 Kategori Sayısı: ${categories.length}`);
    if (categories.length > 0) {
      console.log('Kategoriler:');
      categories.forEach(cat => {
        console.log(`  - ${cat.name} (ID: ${cat._id})`);
      });
    } else {
      console.log('⚠️  Hiç kategori yok!');
    }

    console.log('');

    // Kullanıcıları kontrol et
    const users = await User.find({});
    console.log(`👤 Kullanıcı Sayısı: ${users.length}`);
    if (users.length > 0) {
      console.log('Kullanıcılar:');
      users.forEach(user => {
        console.log(`  - ${user.username} (${user.email}) - Role: ${user.role}`);
      });
    } else {
      console.log('⚠️  Hiç kullanıcı yok!');
    }

    console.log('');

    // Postları kontrol et
    const posts = await Post.find({}).populate('category author');
    console.log(`📝 Post Sayısı: ${posts.length}`);
    if (posts.length > 0) {
      console.log('Postlar:');
      posts.forEach(post => {
        console.log(`  - ${post.title}`);
        console.log(`    Kategori: ${post.category ? post.category.name : 'YOK'}`);
        console.log(`    Yazar: ${post.author ? post.author.username : 'YOK'}`);
      });
    } else {
      console.log('⚠️  Hiç post yok!');
    }

    console.log('\n✅ Kontrol tamamlandı!');
    
    if (categories.length === 0 || users.length === 0) {
      console.log('\n💡 Öneri: Test verisi oluşturmak için "node seedData.js" komutunu çalıştırın.');
    }

  } catch (error) {
    console.error('❌ Hata:', error);
  } finally {
    mongoose.connection.close();
  }
}

checkData();

