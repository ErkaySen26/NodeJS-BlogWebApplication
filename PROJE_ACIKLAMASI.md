# 📚 NODE BLOG PROJESİ - DETAYLI AÇIKLAMA

## 🎯 Feynman Tekniği ile Proje Anlatımı

Bu doküman, Node Blog projesini **Feynman Tekniği** kullanarak açıklar. Feynman tekniği, karmaşık konuları basit bir dille anlatarak öğrenmeyi kolaylaştırır.

---

## 📖 İçindekiler

1. [Proje Nedir?](#proje-nedir)
2. [Node.js ve Express.js Mimarisi](#nodejs-ve-expressjs-mimarisi)
3. [Proje Yapısı](#proje-yapısı)
4. [Veritabanı ve Mongoose](#veritabanı-ve-mongoose)
5. [Routes (Yollar)](#routes-yollar)
6. [Views (Görünümler)](#views-görünümler)
7. [Middleware'ler](#middlewareler)
8. [Önemli Özellikler](#önemli-özellikler)

---

## 🚀 Proje Nedir?

**Node Blog**, modern web teknolojileri kullanılarak geliştirilmiş bir blog platformudur. Kullanıcılar:
- Blog yazıları yazabilir
- Kategoriler oluşturabilir
- Yazıları düzenleyebilir ve silebilir
- Arama yapabilir
- İletişim formu gönderebilir

### Kullanılan Teknolojiler

- **Node.js**: JavaScript'i sunucu tarafında çalıştıran platform
- **Express.js**: Web uygulamaları için framework
- **MongoDB**: NoSQL veritabanı
- **Mongoose**: MongoDB için ORM (Object Relational Mapping)
- **Handlebars**: Template engine (şablon motoru)
- **Bootstrap**: CSS framework

---

## 🏗️ Node.js ve Express.js Mimarisi

### Node.js Nedir?

Basit bir benzetme ile anlatırsak:

**Restoran Benzetmesi:**
- **Node.js** = Restoran binası
- **Express.js** = Restoranın organizasyon sistemi
- **Routes** = Menü (hangi yemek nerede)
- **Controllers** = Aşçılar (işi yapanlar)
- **Database** = Depo (malzemeler)
- **Views** = Tabaklar (sunulan yemekler)

### Express.js Nasıl Çalışır?

```javascript
// 1. Express uygulaması oluştur
const express = require('express');
const app = express();

// 2. Middleware'leri ekle (ara katman işlemleri)
app.use(express.json()); // JSON verilerini oku
app.use(express.urlencoded({ extended: true })); // Form verilerini oku

// 3. Route'ları tanımla (yolları belirle)
app.get('/', (req, res) => {
  res.send('Merhaba Dünya!');
});

// 4. Sunucuyu başlat
app.listen(3000, () => {
  console.log('Sunucu 3000 portunda çalışıyor');
});
```

**Adım Adım Ne Oluyor?**

1. **İstek Gelir (Request)**: Kullanıcı tarayıcıda `http://localhost:3000/` yazar
2. **Express Yakalar**: Express bu isteği yakalar
3. **Route Bulur**: `/` route'unu bulur
4. **İşlemi Yapar**: Callback fonksiyonu çalışır
5. **Cevap Gönderir (Response)**: `res.send()` ile cevap döner

---

## 📁 Proje Yapısı

```
nodeblog/
├── app.js                 # Ana uygulama dosyası
├── package.json           # Proje bağımlılıkları
├── models/                # Veritabanı modelleri
│   ├── Post.js           # Post modeli
│   ├── Category.js       # Kategori modeli
│   └── User.js           # Kullanıcı modeli
├── routes/                # Route dosyaları
│   ├── main.js           # Ana sayfa route'ları
│   ├── post.js           # Post route'ları
│   └── admin/            # Admin route'ları
│       └── index.js
├── views/                 # Handlebars şablonları
│   ├── layouts/          # Ana layout'lar
│   ├── partials/         # Tekrar kullanılan parçalar
│   ├── site/             # Site sayfaları
│   └── admin/            # Admin sayfaları
├── helpers/               # Yardımcı fonksiyonlar
│   ├── textHelpers.js    # Metin işleme
│   └── paginationHelper.js # Sayfalama
├── config/                # Yapılandırma dosyaları
│   └── mailer.js         # Mail ayarları
└── public/                # Statik dosyalar (CSS, JS, resimler)
```

### Her Klasörün Görevi

#### 1. **models/** - Veritabanı Şemaları

Modeller, veritabanındaki verilerin yapısını tanımlar.

**Örnek: Post.js**
```javascript
const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  views: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', PostSchema);
```

**Basit Açıklama:**
- `title`: Yazının başlığı (zorunlu)
- `content`: Yazının içeriği (zorunlu)
- `category`: Hangi kategoriye ait (referans)
- `author`: Kim yazdı (referans)
- `views`: Kaç kez görüntülendi
- `createdAt`: Ne zaman oluşturuldu

**Referans Nedir?**
Referans, başka bir koleksiyona işaret eder. Örneğin:
- Post'un `category` alanı → Category koleksiyonundaki bir ID
- Bu sayede post'u çekerken kategorisini de alabiliriz

#### 2. **routes/** - URL Yönetimi

Route'lar, hangi URL'de ne olacağını belirler.

**Örnek: main.js**
```javascript
const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// Ana sayfa
router.get('/', (req, res) => {
  res.render('site/index');
});

// Blog sayfası
router.get('/blog', async (req, res) => {
  const posts = await Post.find({}).populate('category author');
  res.render('site/blog', { posts });
});

module.exports = router;
```

**Ne Oluyor?**
1. `/` → Ana sayfayı göster
2. `/blog` → Tüm postları veritabanından çek ve blog sayfasını göster
3. `populate()` → Referansları doldur (category ve author bilgilerini getir)

#### 3. **views/** - HTML Şablonları

Handlebars kullanarak dinamik HTML oluşturur.

**Örnek: blog.handlebars**
```handlebars
<div class="container">
  <h1>Blog Yazıları</h1>
  {{#each posts}}
    <div class="post">
      <h2>{{this.title}}</h2>
      <p>{{this.content}}</p>
      <span>Kategori: {{this.category.name}}</span>
      <span>Yazar: {{this.author.username}}</span>
    </div>
  {{/each}}
</div>
```

**Nasıl Çalışır?**
- `{{#each posts}}` → posts dizisindeki her eleman için döngü
- `{{this.title}}` → Mevcut post'un başlığı
- `{{this.category.name}}` → İlişkili kategorinin adı

---

## 🗄️ Veritabanı ve Mongoose

### MongoDB Nedir?

**Dosya Dolabı Benzetmesi:**
- **MongoDB** = Dosya dolabı
- **Database** = Dolap
- **Collection** = Çekmece (örn: posts, categories, users)
- **Document** = Dosya (her bir kayıt)

### Mongoose Nedir?

Mongoose, MongoDB ile JavaScript arasında köprü görevi görür.

**Örnek İşlemler:**

```javascript
// 1. Yeni post oluştur
const newPost = new Post({
  title: 'İlk Yazım',
  content: 'Merhaba dünya!',
  category: '507f1f77bcf86cd799439011', // Category ID
  author: '507f191e810c19729de860ea'    // User ID
});
await newPost.save();

// 2. Tüm postları getir
const posts = await Post.find({});

// 3. Belirli bir post bul
const post = await Post.findById('507f1f77bcf86cd799439011');

// 4. Post güncelle
await Post.findByIdAndUpdate('507f1f77bcf86cd799439011', {
  title: 'Güncellenmiş Başlık'
});

// 5. Post sil
await Post.findByIdAndDelete('507f1f77bcf86cd799439011');
```

### İlişkiler (Relationships)

**1. One-to-Many (Bir-Çok)**
- Bir kategori → Birçok post
- Bir kullanıcı → Birçok post

```javascript
// Post modelinde
category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }

// Kullanırken
const posts = await Post.find({}).populate('category');
// Artık her post'un category bilgisi dolu gelir
```

---

## 🛣️ Routes (Yollar)

### HTTP Metodları

- **GET**: Veri al (okuma)
- **POST**: Veri gönder (oluşturma)
- **PUT/PATCH**: Veri güncelle
- **DELETE**: Veri sil

### RESTful API Yapısı

```javascript
// CRUD İşlemleri (Create, Read, Update, Delete)

// CREATE - Yeni post oluştur
router.post('/posts', async (req, res) => {
  const post = new Post(req.body);
  await post.save();
  res.redirect('/blog');
});

// READ - Tüm postları listele
router.get('/posts', async (req, res) => {
  const posts = await Post.find({});
  res.render('posts', { posts });
});

// READ - Tek post göster
router.get('/posts/:id', async (req, res) => {
  const post = await Post.findById(req.params.id);
  res.render('post-detail', { post });
});

// UPDATE - Post güncelle
router.put('/posts/:id', async (req, res) => {
  await Post.findByIdAndUpdate(req.params.id, req.body);
  res.redirect('/posts');
});

// DELETE - Post sil
router.delete('/posts/:id', async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  res.redirect('/posts');
});
```

---

## 🎨 Views (Görünümler)

### Handlebars Template Engine

Handlebars, HTML içine dinamik veri yerleştirmeyi sağlar.

### Layout Sistemi

**main.handlebars** (Ana şablon)
```handlebars
<!DOCTYPE html>
<html>
<head>
  <title>Node Blog</title>
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
  {{>site-nav}}  <!-- Navbar partial'ı -->
  
  {{{body}}}     <!-- Sayfa içeriği buraya gelir -->
  
  {{>site-footer}} <!-- Footer partial'ı -->
</body>
</html>
```

### Partials (Parçalar)

Tekrar kullanılan HTML parçaları:

**site-nav.handlebars**
```handlebars
<nav>
  <a href="/">Ana Sayfa</a>
  <a href="/blog">Blog</a>
  <a href="/contact">İletişim</a>
</nav>
```

### Helpers (Yardımcılar)

Handlebars içinde kullanılan özel fonksiyonlar:

```javascript
// textHelpers.js
module.exports = {
  truncateText: (text, length) => {
    if (text.length > length) {
      return text.substring(0, length) + '...';
    }
    return text;
  },
  
  generateDate: (date, format) => {
    // Tarihi formatla
    return new Date(date).toLocaleDateString('tr-TR');
  }
};

// Kullanımı
{{truncateText this.content 100}}
{{generateDate this.createdAt}}
```

---

## ⚙️ Middleware'ler

Middleware, istek ve cevap arasında çalışan fonksiyonlardır.

**Restoran Benzetmesi:**
- Müşteri sipariş verir (Request)
- Garson siparişi alır (Middleware 1)
- Aşçı yemeği hazırlar (Middleware 2)
- Garson servisi yapar (Response)

### Örnekler

```javascript
// 1. Logger Middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next(); // Bir sonraki middleware'e geç
});

// 2. Authentication Middleware
const isAuthenticated = (req, res, next) => {
  if (req.session.userId) {
    next(); // Giriş yapmış, devam et
  } else {
    res.redirect('/login'); // Giriş yapmamış, login'e yönlendir
  }
};

// Kullanımı
router.get('/admin', isAuthenticated, (req, res) => {
  res.render('admin/index');
});

// 3. File Upload Middleware
const fileUpload = require('express-fileupload');
app.use(fileUpload());

// 4. Session Middleware
const session = require('express-session');
app.use(session({
  secret: 'gizli-anahtar',
  resave: false,
  saveUninitialized: false
}));
```

---

## 🔥 Önemli Özellikler

### 1. Sayfalama (Pagination)

```javascript
const page = req.query.page || 1;
const limit = 10;
const skip = (page - 1) * limit;

const posts = await Post.find({})
  .skip(skip)
  .limit(limit);

const totalPosts = await Post.countDocuments();
const totalPages = Math.ceil(totalPosts / limit);
```

**Nasıl Çalışır?**
- Sayfa 1: 0-9 arası kayıtlar
- Sayfa 2: 10-19 arası kayıtlar
- Sayfa 3: 20-29 arası kayıtlar

### 2. Arama (Search)

```javascript
const searchQuery = req.query.search;
const posts = await Post.find({
  $or: [
    { title: { $regex: searchQuery, $options: 'i' } },
    { content: { $regex: searchQuery, $options: 'i' } }
  ]
});
```

**Ne Yapıyor?**
- `$regex`: Düzenli ifade ile arama
- `$options: 'i'`: Büyük/küçük harf duyarsız
- `$or`: Title VEYA content'te ara

### 3. Populate (İlişkileri Doldurma)

```javascript
// Populate olmadan
const post = await Post.findById(id);
console.log(post.category); // Sadece ID: "507f1f77bcf86cd799439011"

// Populate ile
const post = await Post.findById(id).populate('category author');
console.log(post.category); // Tüm kategori bilgisi: { _id, name, slug, ... }
console.log(post.author);   // Tüm yazar bilgisi: { _id, username, email, ... }
```

### 4. Method Override

HTML formları sadece GET ve POST destekler. PUT ve DELETE için:

```javascript
// app.js
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

// HTML
<form action="/posts/{{id}}?_method=DELETE" method="POST">
  <button type="submit">Sil</button>
</form>

// Route
router.delete('/posts/:id', async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  res.redirect('/posts');
});
```

---

## 🎓 Özet

Bu proje şu şekilde çalışır:

1. **Kullanıcı** tarayıcıda bir URL yazar
2. **Express** bu isteği yakalar
3. **Route** uygun fonksiyonu bulur
4. **Middleware'ler** devreye girer (auth, session, vb.)
5. **Controller** veritabanından veri çeker
6. **Mongoose** MongoDB ile iletişim kurar
7. **View** (Handlebars) HTML oluşturur
8. **Response** kullanıcıya gönderilir

**Veri Akışı:**
```
Kullanıcı → Express → Route → Middleware → Controller → Model → MongoDB
                                                                    ↓
Kullanıcı ← HTML ← View ← Controller ← Model ← MongoDB
```

---

## 📚 Daha Fazla Öğrenmek İçin

- [Node.js Resmi Dokümantasyon](https://nodejs.org/docs)
- [Express.js Rehberi](https://expressjs.com/guide)
- [MongoDB Üniversitesi](https://university.mongodb.com)
- [Mongoose Dokümantasyonu](https://mongoosejs.com/docs)

---

**Hazırlayan:** Node Blog Projesi  
**Tarih:** 2025  
**Versiyon:** 1.0

