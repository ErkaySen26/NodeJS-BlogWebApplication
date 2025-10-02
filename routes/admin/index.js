const express = require("express");
const router = express.Router();
const Category = require("../../models/Category");
const Post = require("../../models/Post");
const User = require("../../models/User");
const {
  parseQueryParams,
  calculatePagination,
  createSearchQuery,
  createSortObject,
} = require("../../helpers/paginationHelper");

router.get("/", async (req, res) => {
  try {
    // Dashboard istatistikleri
    const totalPosts = await Post.countDocuments();
    const publishedPosts = await Post.countDocuments({ status: "published" });
    const draftPosts = await Post.countDocuments({ status: "draft" });
    const totalCategories = await Category.countDocuments();
    const totalUsers = await User.countDocuments();

    // Son eklenen postlar
    const recentPosts = await Post.find()
      .populate("category", "name")
      .populate("author", "username")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    // En çok görüntülenen postlar
    const popularPosts = await Post.find({ status: "published" })
      .populate("category", "name")
      .populate("author", "username")
      .sort({ views: -1 })
      .limit(5)
      .lean();

    res.render("admin/index", {
      stats: {
        totalPosts,
        publishedPosts,
        draftPosts,
        totalCategories,
        totalUsers,
      },
      recentPosts,
      popularPosts,
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);
    res.render("admin/index", {
      stats: {
        totalPosts: 0,
        publishedPosts: 0,
        draftPosts: 0,
        totalCategories: 0,
        totalUsers: 0,
      },
      recentPosts: [],
      popularPosts: [],
    });
  }
});

router.get("/categories", async (req, res) => {
  try {
    const categories = await Category.find({}).lean();
    res.render("admin/categories", { categories: categories });
  } catch (error) {
    console.error("Categories fetch error:", error);
    res.render("admin/categories", { categories: [] });
  }
});

router.post("/categories", async (req, res) => {
  try {
    await Category.create(req.body);
    req.session.sessionFlash = {
      type: "alert alert-success",
      message: "Kategori başarılı bir şekilde oluşturuldu",
    };
    res.redirect("/admin/categories");
  } catch (error) {
    console.error("Category creation error:", error);
    req.session.sessionFlash = {
      type: "alert alert-danger",
      message: "Kategori oluşturulurken hata oluştu: " + error.message,
    };
    res.redirect("/admin/categories");
  }
});

// Kategori silme route'u - RESTful DELETE method
router.delete("/categories/:id", async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    req.session.sessionFlash = {
      type: "alert alert-success",
      message: "Kategori başarılı bir şekilde silindi",
    };
  } catch (error) {
    console.error("Category deletion error:", error);
    req.session.sessionFlash = {
      type: "alert alert-danger",
      message: "Kategori silinirken hata oluştu: " + error.message,
    };
  }
  res.redirect("/admin/categories");
});

// ============ POST YÖNETİMİ ============

// Tüm postları listele
router.get("/posts", async (req, res) => {
  try {
    const params = parseQueryParams(req.query);
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
      .populate("author", "username")
      .sort(sort)
      .skip(pagination.skip)
      .limit(params.limit)
      .lean();

    const categories = await Category.find({}).lean();

    res.render("admin/posts", {
      posts,
      categories,
      pagination,
      query: params,
    });
  } catch (error) {
    console.error("Admin posts error:", error);
    res.render("admin/posts", {
      posts: [],
      categories: [],
      pagination: {},
      query: {},
    });
  }
});

// Post düzenleme formu
router.get("/posts/edit/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("category")
      .populate("author")
      .lean();

    if (!post) {
      req.session.sessionFlash = {
        type: "alert alert-danger",
        message: "Post bulunamadı",
      };
      return res.redirect("/admin/posts");
    }

    const categories = await Category.find({}).lean();

    res.render("admin/post-edit", {
      post,
      categories,
    });
  } catch (error) {
    console.error("Post edit form error:", error);
    req.session.sessionFlash = {
      type: "alert alert-danger",
      message: "Post yüklenirken hata oluştu",
    };
    res.redirect("/admin/posts");
  }
});

// Post güncelleme
router.put("/posts/:id", async (req, res) => {
  try {
    const { title, content, category, status } = req.body;

    const updateData = {
      title,
      content,
      category,
      status,
      summary: require("../../helpers/textHelpers").createSummary(content, 200),
    };

    await Post.findByIdAndUpdate(req.params.id, updateData);

    req.session.sessionFlash = {
      type: "alert alert-success",
      message: "Post başarıyla güncellendi",
    };
  } catch (error) {
    console.error("Post update error:", error);
    req.session.sessionFlash = {
      type: "alert alert-danger",
      message: "Post güncellenirken hata oluştu",
    };
  }
  res.redirect("/admin/posts");
});

// Post silme
router.delete("/posts/:id", async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    req.session.sessionFlash = {
      type: "alert alert-success",
      message: "Post başarıyla silindi",
    };
  } catch (error) {
    console.error("Post delete error:", error);
    req.session.sessionFlash = {
      type: "alert alert-danger",
      message: "Post silinirken hata oluştu",
    };
  }
  res.redirect("/admin/posts");
});

module.exports = router;
