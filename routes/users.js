const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Register GET
router.get("/register", (req, res) => {
  res.render("site/register");
});

// Register POST
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Boş alan kontrolü
    if (!username || !email || !password) {
      return res.render("site/register", {
        error: "Lütfen tüm alanları doldurun.",
      });
    }

    // Email formatı kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.render("site/register", {
        error: "Geçerli bir email adresi girin.",
      });
    }

    // Şifre uzunluk kontrolü
    if (password.length < 6) {
      return res.render("site/register", {
        error: "Şifre en az 6 karakter olmalıdır.",
      });
    }

    await User.create(req.body);
    req.session.sessionFlash = {
      type: "alert alert-success",
      message:
        "Kullanıcı başarılı bir şekilde oluşturuldu. Giriş yapabilirsiniz.",
    };
    res.redirect("/users/login");
  } catch (error) {
    console.error("Register error:", error);
    let errorMessage = "Kayıt sırasında hata oluştu.";

    // MongoDB duplicate key error
    if (error.code === 11000) {
      if (error.keyPattern.email) {
        errorMessage = "Bu email adresi zaten kullanılıyor.";
      } else if (error.keyPattern.password) {
        errorMessage = "Bu şifre zaten kullanılıyor.";
      }
    }

    res.render("site/register", { error: errorMessage });
  }
});

// Login GET
router.get("/login", (req, res) => {
  res.render("site/login");
});

// Login POST
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Boş alan kontrolü
    if (!email || !password) {
      return res.render("site/login", {
        error: "Lütfen email ve şifre alanlarını doldurun.",
      });
    }

    const user = await User.findOne({ email });

    if (user) {
      if (user.password === password) {
        req.session.userId = user._id;
        req.session.sessionFlash = {
          type: "alert alert-success",
          message: "Başarıyla giriş yaptınız!",
        };
        res.redirect("/");
      } else {
        res.render("site/login", {
          error: "Şifre yanlış. Lütfen tekrar deneyin.",
        });
      }
    } else {
      res.render("site/login", {
        error: "Bu email adresi ile kayıtlı kullanıcı bulunamadı.",
      });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.render("site/login", {
      error: "Giriş sırasında bir hata oluştu. Lütfen tekrar deneyin.",
    });
  }
});

// Logout
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
