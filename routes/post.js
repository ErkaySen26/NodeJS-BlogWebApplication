const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const Category = require("../models/Category");
const User = require("../models/User");
const Comment = require("../models/Comment");
const path = require("path");
const { createSummary } = require("../helpers/textHelpers");

// Yeni post ekleme formu
router.get("/new", async (req, res) => {
  if (!req.session.userId) {
    return res.redirect("/users/login");
  }
  try {
    console.log("=== GET /posts/new DEBUG ===");
    console.log("Session userId:", req.session.userId);

    const categories = await Category.find({ isActive: true }).lean();
    console.log("Categories found:", categories.length);
    console.log(
      "Categories:",
      categories.map((c) => ({ id: c._id, name: c.name }))
    );

    res.render("site/addpost_fixed", {
      categories,
      categoriesJson: JSON.stringify(categories, null, 2),
    });
  } catch (err) {
    console.error("Error fetching categories:", err);
    res.render("site/addpost_fixed", { categories: [], categoriesJson: "[]" });
  }
});

// Dinamik id ile post detay (ör: /posts/123)
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("category", "name color")
      .populate("author", "username avatar")
      .lean();

    if (!post) {
      return res.status(404).render("site/404", {
        message: "Post bulunamadı",
      });
    }

    // Görüntülenme sayısını artır
    await Post.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });

    // Yorumları getir
    const comments = await Comment.find({ post: req.params.id })
      .populate("author", "username avatar")
      .sort({ createdAt: -1 })
      .lean();

    // İlgili postları getir (aynı kategoriden)
    const relatedPosts = await Post.find({
      category: post.category._id,
      _id: { $ne: post._id },
      status: "published",
    })
      .populate("category", "name")
      .populate("author", "username")
      .limit(3)
      .lean();

    res.render("site/post", {
      post: post,
      comments: comments,
      commentCount: comments.length,
      relatedPosts: relatedPosts,
    });
  } catch (error) {
    console.error("Post detail error:", error);
    res.status(500).render("site/error", {
      message: "Post yüklenirken hata oluştu",
    });
  }
});

// Yorum ekleme
router.post("/:id/comment", async (req, res) => {
  try {
    if (!req.session.userId) {
      req.session.sessionFlash = {
        type: "alert alert-danger",
        message: "Yorum yapmak için giriş yapmalısınız",
      };
      return res.redirect("/users/login");
    }

    const { content } = req.body;

    if (!content || content.trim().length < 3) {
      req.session.sessionFlash = {
        type: "alert alert-danger",
        message: "Yorum en az 3 karakter olmalıdır",
      };
      return res.redirect(`/posts/${req.params.id}`);
    }

    await Comment.create({
      post: req.params.id,
      author: req.session.userId,
      content: content.trim(),
    });

    req.session.sessionFlash = {
      type: "alert alert-success",
      message: "Yorumunuz başarıyla eklendi",
    };

    res.redirect(`/posts/${req.params.id}`);
  } catch (error) {
    console.error("Comment creation error:", error);
    req.session.sessionFlash = {
      type: "alert alert-danger",
      message: "Yorum eklenirken hata oluştu",
    };
    res.redirect(`/posts/${req.params.id}`);
  }
});

// Post ekleme (formdan gelen veriyi kaydetme)
router.post("/create", async (req, res) => {
  try {
    // Kullanıcı giriş kontrolü
    if (!req.session.userId) {
      req.session.sessionFlash = {
        type: "alert alert-danger",
        message: "Post oluşturmak için giriş yapmalısınız",
      };
      return res.redirect("/users/login");
    }

    console.log("=== POST CREATE DEBUG ===");
    console.log("req.body:", req.body);
    console.log("req.files:", req.files);
    console.log("Session userId:", req.session.userId);

    const { title, content, category } = req.body;

    console.log("Extracted values:");
    console.log("- title:", title);
    console.log("- content:", content);
    console.log("- category:", category);

    // Validasyon
    if (!title || !content || !category) {
      console.log("Validation failed:");
      console.log("- title empty:", !title);
      console.log("- content empty:", !content);
      console.log("- category empty:", !category);

      req.session.sessionFlash = {
        type: "alert alert-danger",
        message: "Lütfen tüm alanları doldurun",
      };
      return res.redirect("/posts/new");
    }

    // Resim yükleme kontrolü
    if (!req.files || !req.files.post_image) {
      req.session.sessionFlash = {
        type: "alert alert-danger",
        message: "Lütfen bir resim yükleyin",
      };
      return res.redirect("/posts/new");
    }

    const post_image = req.files.post_image;

    // Resim formatı kontrolü
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    if (!allowedTypes.includes(post_image.mimetype)) {
      req.session.sessionFlash = {
        type: "alert alert-danger",
        message: "Sadece JPG, PNG ve GIF formatları desteklenir",
      };
      return res.redirect("/posts/new");
    }

    // Resim boyutu kontrolü (5MB)
    if (post_image.size > 5 * 1024 * 1024) {
      req.session.sessionFlash = {
        type: "alert alert-danger",
        message: "Resim boyutu 5MB'dan küçük olmalıdır",
      };
      return res.redirect("/posts/new");
    }

    // Benzersiz dosya adı oluştur
    const timestamp = Date.now();
    const fileName = `${timestamp}_${post_image.name}`;
    const uploadPath = path.resolve(
      __dirname,
      "../public/img/postimages",
      fileName
    );

    // Resmi kaydet
    await post_image.mv(uploadPath);

    // Özet oluştur
    const summary = createSummary(content, 200);

    // Post'u veritabanına kaydet
    const newPost = await Post.create({
      title,
      content,
      summary,
      category,
      author: req.session.userId,
      post_image: `/img/postimages/${fileName}`,
      status: "published", // Açıkça published olarak ayarla
    });

    console.log("Post created successfully:", newPost._id);

    req.session.sessionFlash = {
      type: "alert alert-success",
      message: "Postunuz başarılı bir şekilde oluşturuldu",
    };

    res.redirect("/blog");
  } catch (error) {
    console.error("Post creation error:", error);
    req.session.sessionFlash = {
      type: "alert alert-danger",
      message: "Post oluşturulurken hata oluştu: " + error.message,
    };
    res.redirect("/posts/new");
  }
});

module.exports = router;
