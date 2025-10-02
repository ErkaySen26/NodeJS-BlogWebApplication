const express = require("express");
const router = express.Router();
const Post = require("../models/Post.js");
const Category = require("../models/Category.js");
const {
  parseQueryParams,
  calculatePagination,
  createSearchQuery,
  createSortObject,
} = require("../helpers/paginationHelper");
router.get("/", (req, res) => {
  console.log(req.session);
  res.render("site/index");
});

/* router.get("/admin", (req, res) => {
  res.render("admin/index");
});
 */
router.get("/blog", async (req, res) => {
  try {
    const params = parseQueryParams(req.query);
    const query = createSearchQuery(params);
    const sort = createSortObject(params.sort);

    // Sadece yayınlanmış postları göster
    query.status = "published";

    const totalPosts = await Post.countDocuments(query);
    const pagination = calculatePagination(
      params.page,
      totalPosts,
      params.limit
    );

    const posts = await Post.find(query)
      .populate("category", "name color")
      .populate("author", "username avatar")
      .sort(sort)
      .skip(pagination.skip)
      .limit(params.limit)
      .lean();

    const categories = await Category.find({ isActive: true }).lean();

    // Son postlar (sidebar için)
    const recentPosts = await Post.find({ status: "published" })
      .populate("category", "name")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    // Popüler postlar (sidebar için)
    const popularPosts = await Post.find({ status: "published" })
      .populate("category", "name")
      .sort({ views: -1 })
      .limit(5)
      .lean();

    res.render("site/blog", {
      posts: posts,
      categories: categories,
      recentPosts: recentPosts,
      popularPosts: popularPosts,
      pagination: pagination,
      query: params,
    });
  } catch (error) {
    console.error("Blog page error:", error);
    res.render("site/blog", {
      posts: [],
      categories: [],
      recentPosts: [],
      popularPosts: [],
      pagination: {},
      query: {},
    });
  }
});

router.get("/contact", (req, res) => {
  res.render("site/contact");
});

// İletişim formu gönderimi
router.post("/contact", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Basit validasyon
    if (!name || !email || !subject || !message) {
      req.session.sessionFlash = {
        type: "alert alert-danger",
        message: "Lütfen tüm alanları doldurun!",
      };
      return res.redirect("/contact");
    }

    // Mail gönderme (opsiyonel - mail ayarları yapılmışsa)
    try {
      const { sendMail, contactMailTemplate } = require("../config/mailer");
      const mailContent = contactMailTemplate({
        name,
        email,
        subject,
        message,
      });

      await sendMail({
        to: process.env.CONTACT_EMAIL || "admin@example.com",
        subject: mailContent.subject,
        html: mailContent.html,
        text: mailContent.text,
      });
    } catch (mailError) {
      console.log(
        "Mail gönderilemedi (ayarlar yapılmamış olabilir):",
        mailError.message
      );
    }

    req.session.sessionFlash = {
      type: "alert alert-success",
      message:
        "Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.",
    };
    res.redirect("/contact");
  } catch (error) {
    console.error("Contact form error:", error);
    req.session.sessionFlash = {
      type: "alert alert-danger",
      message: "Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyin.",
    };
    res.redirect("/contact");
  }
});

router.get("/posts/new", (req, res) => {
  Category.find({}).then((categories) => {
    res.render("site/addpost", { categories });
  });
});

// Kategoriye göre post filtreleme
router.get("/category/:slug", async (req, res) => {
  try {
    const category = await Category.findOne({
      $or: [
        { slug: req.params.slug },
        { name: { $regex: new RegExp(req.params.slug, "i") } },
      ],
    }).lean();

    if (!category) {
      return res.status(404).render("site/404", {
        message: "Kategori bulunamadı",
      });
    }

    const params = parseQueryParams(req.query);
    params.category = category._id;

    const query = createSearchQuery(params);
    const sort = createSortObject(params.sort);

    const totalPosts = await Post.countDocuments(query);
    const pagination = calculatePagination(
      params.page,
      totalPosts,
      params.limit
    );

    const posts = await Post.find(query)
      .populate("category", "name color")
      .populate("author", "username avatar")
      .sort(sort)
      .skip(pagination.skip)
      .limit(params.limit)
      .lean();

    const categories = await Category.find({ isActive: true }).lean();

    res.render("site/blog", {
      posts: posts,
      categories: categories,
      pagination: pagination,
      query: params,
      currentCategory: category,
      pageTitle: `${category.name} Kategorisi`,
    });
  } catch (error) {
    console.error("Category page error:", error);
    res.status(500).render("site/error", {
      message: "Kategori sayfası yüklenirken hata oluştu",
    });
  }
});

// Ana sayfa - son postları göster
router.get("/", async (req, res) => {
  try {
    console.log(req.session);

    // Son 6 postu getir
    const recentPosts = await Post.find({ status: "published" })
      .populate("category", "name color")
      .populate("author", "username")
      .sort({ createdAt: -1 })
      .limit(6)
      .lean();

    // Popüler postlar
    const popularPosts = await Post.find({ status: "published" })
      .populate("category", "name color")
      .sort({ views: -1 })
      .limit(3)
      .lean();

    // Kategoriler
    const categories = await Category.find({ isActive: true }).limit(6).lean();

    res.render("site/index", {
      recentPosts,
      popularPosts,
      categories,
    });
  } catch (error) {
    console.error("Homepage error:", error);
    res.render("site/index", {
      recentPosts: [],
      popularPosts: [],
      categories: [],
    });
  }
});

module.exports = router;
