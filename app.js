const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema = {
  title: String,
  content: String
};

const Article = mongoose.model("article", articleSchema);

/*************** Requests Targetting All Articles **************/

app.route("/articles")

.get((req, res) => {
  Article.find({}, (err, articles) => {
    if (!err) {
      res.send(articles);
    } else {
      res.send(err);
    }
  });
})

.post((req, res) => {
  const articleTitle = req.body.title;

  Article.find({title: articleTitle}, (err, article) => {
    if (!err) {
      if (article === null) {
        const newArticle  = new Article ({
          title: req.body.title,
          content: req.body.content
        });
        newArticle.save((err) => {
          if (!err) {
            res.send("Successfully added a new article") ;
          } else {
            res.send(err);
          }
        });
      } else {
        res.send("There is already an article with that title, please change the title and try again");
      }
    }
  });
})

.delete((req, res) => {
  Article.deleteMany({}, (err) => {
    if (!err) {
      res.send("Successfully deleted all articles");
    } else {
      res.send(err);
    }
  });
});

/*************** Requests Targetting A Specific Article **************/

app.route("/articles/:articleTitle")

.get((req, res) => {
  Article.findOne({title: req.params.articleTitle}, (err, article) => {
    if (article) {
      res.send(article);
    } else {
      res.send("No articles matching that title");
    }
  });
})

.put((req, res) => {
  Article.updateOne(
    {title: req.params.articleTitle},
    {title: req.body.title, content: req.body.content},
    (err) => {
      if (!err) {
        res.send("Successfully updated article");
      } else {
        res.send(err);
      }
    }
  );
})

.delete((req, res) => {
  Article.deleteOne({title: req.params.articleTitle}, (err) => {
    if (!err) {
      res.send("Successfully deleted article");
    } else {
      res.send(err);
    }
  });
});


app.listen(3000, () => {
  console.log("Server is up and running");
});
