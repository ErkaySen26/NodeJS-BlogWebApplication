const mongoose = require("mongoose");

mongoose.set("strictQuery", true);

const Post = require("./models/Post");

mongoose.connect("mongodb://127.0.0.1/nodeblog_test_db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

/* Post.findByIdAndDelete('5da4b5a1cad7592ca409e701')
  .then(post => {
    console.log(post);
  })
  .catch(error => {
    console.error(error);
  });
 */

/* Post.findByIdAndUpdate(
  "68ca56fbe673bfa626a2771a",
  { title: "Benim 1. Postum" },
  { new: true }
)
  .then((post) => {
    console.log(post);
  })
  .catch((error) => {
    console.error(error);
  }); */

/* Post.find({})
  .then((posts) => {
    console.log(posts);
  })
  .catch((error) => {
    console.error(error);
  }); */

/* Post.create({
  title: "Benim ikinci Post Başlığım.",
  content: "Post içeriği, lorem ipsum.",
})
  .then((post) => {
    console.log(post);
  })
  .catch((err) => {
    console.error(err);
  });
 */
