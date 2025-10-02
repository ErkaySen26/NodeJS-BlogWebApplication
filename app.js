// Ortam değişkenlerini yükle
require("dotenv").config();

const path = require("path");
const express = require("express");
const { engine } = require("express-handlebars"); // DÜZELTME 1: Doğru import
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const session = require("express-session");
const methodOverride = require("method-override"); // Method override eklendi
const generateDate = require("./helpers/generateDate").generateDate;
const {
  truncateText,
  stripHtml,
  createSummary,
  wordCount,
  readingTime,
} = require("./helpers/textHelpers");
const expressSession = require("express-session");
const connectMongo = require("connect-mongo");
const app = express();
const port = 3000;
const hostname = "127.0.0.1";

mongoose.connect("mongodb://127.0.0.1/nodeblog_db");

// Statik dosyalar
const MongoStore = require("connect-mongo");
app.use(
  expressSession({
    secret: "testotesto",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: "mongodb://127.0.0.1/nodeblog_db",
    }),
  })
);
app.use(express.static("public"));

// DÜZELTME 2: exphbs.create() yerine direkt engine() kullanın
app.engine(
  "handlebars",
  engine({
    defaultLayout: "main",
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
    },
    helpers: {
      generateDate: generateDate,
      truncateText: truncateText,
      stripHtml: stripHtml,
      createSummary: createSummary,
      wordCount: wordCount,
      readingTime: readingTime,
      // Koşullu helper'lar
      eq: (a, b) => a === b,
      ne: (a, b) => a !== b,
      gt: (a, b) => a > b,
      lt: (a, b) => a < b,
      // Matematik helper'ları
      add: (a, b) => a + b,
      subtract: (a, b) => a - b,
      multiply: (a, b) => a * b,
      // String helper'ları
      capitalize: (str) =>
        str ? str.charAt(0).toUpperCase() + str.slice(1) : "",
      lowercase: (str) => (str ? str.toLowerCase() : ""),
      uppercase: (str) => (str ? str.toUpperCase() : ""),
    },
  })
);

app.set("view engine", "handlebars");

// Body parsers
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Method override middleware - HTML formlarında DELETE, PUT metodları için
app.use(methodOverride("_method"));

//Flash messages middleware
app.use((req, res, next) => {
  res.locals.sessionFlash = req.session.sessionFlash;
  delete req.session.sessionFlash;
  next();
});

// fileUpload middleware
app.use(fileUpload());

//Display Link Middleware
app.use((req, res, next) => {
  const { userId } = req.session;
  res.locals.displayLink = userId ? true : false;
  res.locals.userId = userId;
  next();
});

// Routers
const main = require("./routes/main");
const post = require("./routes/post");
const users = require("./routes/users");
const admin = require("./routes/admin");
app.use("/", main);
app.use("/posts", post);
app.use("/users", users);
app.use("/admin", admin);
app.listen(port, hostname, () => {
  console.log(`Server  Çalışıyor, http://${hostname}:${port}/`);
});
