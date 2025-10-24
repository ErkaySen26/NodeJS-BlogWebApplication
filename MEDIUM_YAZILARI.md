# 📝 Medium Yazı Konuları ve İçerikleri

## 🎯 Yazı Konuları

### 1. Teknik Derinlemesine Yazılar

#### A. "Node.js ve Express ile RESTful Blog API Geliştirme"

- RESTful API prensipleri
- Express routing yapısı
- Middleware kullanımı
- Error handling
- Validation

#### B. "MongoDB İlişkisel Veri Modelleme: Populate ve Referencing"

- MongoDB'de ilişkiler
- Populate kullanımı
- Performance optimizasyonu
- Best practices

#### C. "Express Session Yönetimi ve Authentication"

- Session nedir?
- express-session kullanımı
- MongoDB session store
- Security best practices

#### D. "Node.js'de File Upload: Güvenlik ve Validation"

- express-fileupload kullanımı
- File type validation
- Size limiting
- Security considerations

### 2. Proje Tabanlı Yazılar

#### E. "Sıfırdan Blog Platformu Geliştirme: Full-Stack Journey"

- Proje planlama
- Teknoloji seçimi
- Mimari tasarım
- Implementation
- Deployment

#### F. "MVC Pattern ile Node.js Uygulaması Geliştirme"

- MVC nedir?
- Folder structure
- Code organization
- Best practices

### 3. Problem Çözme Yazıları

#### G. "Node.js Projemde Karşılaştığım 5 Zorluk ve Çözümleri"

- Real-world problems
- Solutions
- Lessons learned

#### H. "MongoDB Performance Optimization: Pagination ve Indexing"

- Pagination strategies
- Index kullanımı
- Query optimization

---

## 📄 ÖRNEK MEDIUM YAZISI 1

# Node.js ve Express ile RESTful Blog API Geliştirme

## Giriş

Modern web uygulamalarının kalbi API'lerdir. Bu yazıda, Node.js ve Express kullanarak nasıl RESTful bir blog API'si geliştirebileceğinizi adım adım anlatacağım.

## RESTful API Nedir?

REST (Representational State Transfer), web servisleri için bir mimari stildir. RESTful API'ler, HTTP metodlarını (GET, POST, PUT, DELETE) kullanarak CRUD işlemlerini gerçekleştirir.

### HTTP Metodları ve CRUD İlişkisi

```
GET    → Read   (Veri okuma)
POST   → Create (Veri oluşturma)
PUT    → Update (Veri güncelleme)
DELETE → Delete (Veri silme)
```

## Proje Yapısı

```
blog-api/
├── models/
│   ├── Post.js
│   ├── User.js
│   └── Category.js
├── routes/
│   ├── post.js
│   ├── user.js
│   └── category.js
├── middleware/
│   ├── auth.js
│   └── validation.js
└── app.js
```

## 1. Model Oluşturma

İlk olarak, Mongoose kullanarak Post modelimizi oluşturalım:

```javascript
const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Başlık gereklidir"],
      trim: true,
      minlength: [5, "Başlık en az 5 karakter olmalıdır"],
    },
    content: {
      type: String,
      required: [true, "İçerik gereklidir"],
      minlength: [50, "İçerik en az 50 karakter olmalıdır"],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Post", PostSchema);
```

### Önemli Noktalar:

1. **Validation**: `required`, `minlength` gibi built-in validatorler
2. **References**: `ObjectId` ile diğer modellere referans
3. **Timestamps**: `createdAt` ve `updatedAt` otomatik eklenir
4. **Enum**: Belirli değerler arasından seçim

## 2. Route Oluşturma

Express router kullanarak endpoint'lerimizi oluşturalım:

```javascript
const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

// GET /posts - Tüm postları listele
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find({ status: "published" })
      .populate("author", "username email")
      .populate("category", "name")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: posts.length,
      data: posts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// GET /posts/:id - Tek post getir
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "username email")
      .populate("category", "name");

    if (!post) {
      return res.status(404).json({
        success: false,
        error: "Post bulunamadı",
      });
    }

    // Görüntülenme sayısını artır
    post.views += 1;
    await post.save();

    res.json({
      success: true,
      data: post,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// POST /posts - Yeni post oluştur
router.post("/", async (req, res) => {
  try {
    const post = await Post.create(req.body);

    res.status(201).json({
      success: true,
      data: post,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// PUT /posts/:id - Post güncelle
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        error: "Post bulunamadı",
      });
    }

    res.json({
      success: true,
      data: post,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// DELETE /posts/:id - Post sil
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        error: "Post bulunamadı",
      });
    }

    res.json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
```

### Best Practices:

1. **Async/Await**: Promise'leri daha okunabilir hale getirir
2. **Error Handling**: Try-catch ile hata yakalama
3. **Status Codes**: Doğru HTTP status kodları kullanma
4. **Populate**: İlişkili verileri getirme
5. **Validation**: Mongoose validatorleri kullanma

## 3. Middleware Kullanımı

Authentication middleware örneği:

```javascript
// middleware/auth.js
const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new Error();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: "Lütfen giriş yapın",
    });
  }
};
```

Kullanımı:

```javascript
const auth = require("../middleware/auth");

router.post("/", auth, async (req, res) => {
  // Sadece giriş yapmış kullanıcılar erişebilir
});
```

## 4. Gelişmiş Özellikler

### Pagination

```javascript
router.get("/", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const posts = await Post.find().skip(skip).limit(limit);

  const total = await Post.countDocuments();

  res.json({
    success: true,
    data: posts,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});
```

### Filtering

```javascript
router.get("/", async (req, res) => {
  const { category, author, status } = req.query;

  const filter = {};
  if (category) filter.category = category;
  if (author) filter.author = author;
  if (status) filter.status = status;

  const posts = await Post.find(filter);

  res.json({
    success: true,
    data: posts,
  });
});
```

### Sorting

```javascript
router.get("/", async (req, res) => {
  const sortBy = req.query.sortBy || "createdAt";
  const order = req.query.order === "asc" ? 1 : -1;

  const posts = await Post.find().sort({ [sortBy]: order });

  res.json({
    success: true,
    data: posts,
  });
});
```

## 5. Error Handling

Global error handler:

```javascript
// app.js
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(err.status || 500).json({
    success: false,
    error: err.message || "Sunucu hatası",
  });
});
```

## 6. Testing

Postman veya cURL ile test:

```bash
# Tüm postları getir
curl http://localhost:3000/api/posts

# Tek post getir
curl http://localhost:3000/api/posts/123

# Yeni post oluştur
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","content":"Test content"}'

# Post güncelle
curl -X PUT http://localhost:3000/api/posts/123 \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated"}'

# Post sil
curl -X DELETE http://localhost:3000/api/posts/123
```

## Sonuç

Bu yazıda, Node.js ve Express kullanarak RESTful bir blog API'si nasıl geliştirebileceğinizi öğrendik. Önemli noktalar:

✅ RESTful prensiplere uygun endpoint tasarımı
✅ Mongoose ile veri modelleme
✅ Async/await ile asenkron işlemler
✅ Error handling ve validation
✅ Pagination, filtering, sorting
✅ Middleware kullanımı

## Kaynaklar

- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [REST API Best Practices](https://restfulapi.net/)

---

**Sorularınız için yorumlarda buluşalım! 👇**

#NodeJS #ExpressJS #MongoDB #API #WebDevelopment #Backend #JavaScript

---

## 📄 ÖRNEK MEDIUM YAZISI 2

# MongoDB İlişkisel Veri Modelleme: Populate ve Referencing Rehberi

## Giriş

MongoDB bir NoSQL veritabanı olmasına rağmen, gerçek dünya uygulamalarında veriler arasında ilişkiler kurmamız gerekir. Bu yazıda, MongoDB'de ilişkisel veri modelleme, populate ve referencing kavramlarını detaylıca inceleyeceğiz.

## İlişki Türleri

### 1. One-to-One (Bir-Bir)

Bir kullanıcının bir profili vardır.

### 2. One-to-Many (Bir-Çok)

Bir kullanıcının birden fazla postu vardır.

### 3. Many-to-Many (Çok-Çok)

Bir post birden fazla etikete sahip olabilir, bir etiket birden fazla postta kullanılabilir.

## Referencing vs Embedding

### Embedding (Gömme)

```javascript
// Kullanıcı ve profil bilgisi aynı dokümanda
{
  _id: ObjectId("..."),
  username: "johndoe",
  email: "john@example.com",
  profile: {
    bio: "Developer",
    avatar: "avatar.jpg",
    location: "Istanbul"
  }
}
```

**Avantajları:**

- Tek query ile tüm veri gelir
- Daha hızlı okuma işlemleri
- Atomik güncellemeler

**Dezavantajları:**

- Doküman boyutu limiti (16MB)
- Veri tekrarı
- Güncelleme zorluğu

### Referencing (Referans)

```javascript
// User collection
{
  _id: ObjectId("user123"),
  username: "johndoe",
  email: "john@example.com"
}

// Post collection
{
  _id: ObjectId("post456"),
  title: "My Post",
  content: "...",
  author: ObjectId("user123")  // Referans
}
```

**Avantajları:**

- Veri tekrarı yok
- Doküman boyutu küçük
- Kolay güncelleme

**Dezavantajları:**

- Birden fazla query gerekebilir
- Populate overhead'i

## Mongoose ile Referencing

### Model Tanımlama

```javascript
// User Model
const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
});

const User = mongoose.model("User", UserSchema);

// Post Model
const PostSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // User modeline referans
  },
});

const Post = mongoose.model("Post", PostSchema);
```

### Veri Oluşturma

```javascript
// Önce kullanıcı oluştur
const user = await User.create({
  username: "johndoe",
  email: "john@example.com",
});

// Sonra post oluştur
const post = await Post.create({
  title: "My First Post",
  content: "Hello World!",
  author: user._id, // Kullanıcı ID'sini referans olarak ver
});
```

### Populate Kullanımı

```javascript
// Basit populate
const post = await Post.findById(postId).populate("author");

console.log(post.author.username); // 'johndoe'

// Seçici populate (sadece belirli alanlar)
const post = await Post.findById(postId).populate("author", "username email");

// Çoklu populate
const post = await Post.findById(postId)
  .populate("author")
  .populate("category");

// İç içe populate
const comment = await Comment.findById(commentId).populate({
  path: "post",
  populate: {
    path: "author",
    select: "username",
  },
});
```

## Gerçek Dünya Örneği: Blog Sistemi

### Model Yapısı

```javascript
// User Model
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
});

// Category Model
const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: String,
  description: String,
});

// Post Model
const PostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag",
      },
    ],
    views: { type: Number, default: 0 },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
  },
  { timestamps: true }
);

// Comment Model
const CommentSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: { type: String, required: true },
  },
  { timestamps: true }
);
```

### Kullanım Örnekleri

#### 1. Blog Listesi (Yazar ve Kategori ile)

```javascript
const posts = await Post.find({ status: "published" })
  .populate("author", "username email")
  .populate("category", "name slug")
  .sort({ createdAt: -1 })
  .limit(10);
```

#### 2. Post Detay (Tüm İlişkiler ile)

```javascript
const post = await Post.findById(postId)
  .populate("author", "username email role")
  .populate("category", "name description")
  .populate("tags", "name");

// Yorumları ayrı query ile getir
const comments = await Comment.find({ post: postId })
  .populate("author", "username")
  .sort({ createdAt: -1 });
```

#### 3. Kullanıcının Tüm Postları

```javascript
const userPosts = await Post.find({ author: userId })
  .populate("category", "name")
  .select("title createdAt views status");
```

## Performance Optimization

### 1. Sadece Gerekli Alanları Seç

```javascript
// ❌ Kötü
const posts = await Post.find().populate("author");

// ✅ İyi
const posts = await Post.find()
  .populate("author", "username avatar")
  .select("title summary createdAt");
```

### 2. Limit ve Pagination Kullan

```javascript
const page = 1;
const limit = 10;
const skip = (page - 1) * limit;

const posts = await Post.find()
  .populate("author", "username")
  .skip(skip)
  .limit(limit);
```

### 3. Lean Kullan

```javascript
// Mongoose document yerine plain JavaScript object döner
const posts = await Post.find().populate("author", "username").lean();
```

### 4. Index Oluştur

```javascript
// Post modelinde
PostSchema.index({ author: 1, createdAt: -1 });
PostSchema.index({ category: 1, status: 1 });
```

## Virtual Populate

Ters yönde populate için:

```javascript
// User modelinde
UserSchema.virtual("posts", {
  ref: "Post",
  localField: "_id",
  foreignField: "author",
});

// Kullanım
const user = await User.findById(userId).populate("posts");

console.log(user.posts); // Kullanıcının tüm postları
```

## Aggregate ile İlişkiler

Daha karmaşık sorgular için:

```javascript
const stats = await Post.aggregate([
  {
    $lookup: {
      from: "users",
      localField: "author",
      foreignField: "_id",
      as: "authorInfo",
    },
  },
  {
    $unwind: "$authorInfo",
  },
  {
    $group: {
      _id: "$authorInfo.username",
      postCount: { $sum: 1 },
      totalViews: { $sum: "$views" },
    },
  },
  {
    $sort: { postCount: -1 },
  },
]);
```

## Best Practices

### 1. Doğru İlişki Türünü Seç

```javascript
// One-to-Few: Embedding kullan
{
  user: "john",
  addresses: [
    { street: "123 Main St", city: "NYC" },
    { street: "456 Oak Ave", city: "LA" }
  ]
}

// One-to-Many: Referencing kullan
{
  post: ObjectId("..."),
  comments: [ObjectId("..."), ObjectId("...")]
}

// One-to-Squillions: Parent referencing
{
  comment: "...",
  post: ObjectId("...")  // Her comment post'u referans eder
}
```

### 2. Populate Zincirleme

```javascript
const post = await Post.findById(postId)
  .populate({
    path: "author",
    select: "username email",
    populate: {
      path: "profile",
      select: "bio avatar",
    },
  })
  .populate("category", "name");
```

### 3. Conditional Populate

```javascript
const query = Post.findById(postId);

if (includeAuthor) {
  query.populate("author", "username");
}

if (includeCategory) {
  query.populate("category", "name");
}

const post = await query;
```

## Sonuç

MongoDB'de ilişkisel veri modelleme, doğru yaklaşımla çok güçlü olabilir. Önemli noktalar:

✅ Embedding vs Referencing'i doğru seç
✅ Populate'i akıllıca kullan
✅ Performance'ı optimize et
✅ Index'leri unutma
✅ Lean kullanarak memory tasarrufu yap

## Kaynaklar

- [Mongoose Populate Documentation](https://mongoosejs.com/docs/populate.html)
- [MongoDB Data Modeling](https://docs.mongodb.com/manual/core/data-modeling-introduction/)

---

**Sorularınız için yorumlarda buluşalım! 👇**

#MongoDB #Mongoose #NodeJS #Database #DataModeling #Backend
