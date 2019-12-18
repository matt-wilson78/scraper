// Requiring various NPM packages that are used in this app
var express = require("express");
var logger = require("morgan");
var exphbs = require("express-handlebars")
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var request = require("request");
var router = express.Router();

// Require all models
var db = require("./models");

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));
// Use handlebars
app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");

// Connect to the Mongo DB
var PORT = process.env.PORT || 3000
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);

// Routes here
// A GET route for scraping the escapist magazine website
router.get("/scrape", function(req, res) {
  // First, we grab the body of the html with axios
  axios.get("https://www.escapistmagazine.com/v2/").then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);
    console.log(response.data);

    // Grabbing the articles within the post_text div:
    $("div.post_text").each(function(i, element) {
      // Save an empty result object
      var result = {};

      // Add the title, link, & summary of each result, and save them as properties of the result object
      result.title = $(this)
        .children("h3")
        .text().trim();
      result.link = $(this)
        .children("a")
        .attr("href");
      result.summary = $(this)
        .children("div.excerpt")
        .text().trim();

      // Create a new Article using the `result` object built from scraping
      db.Article.create(result)
        .then(function(dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch(function(err) {
          // If an error occurred, log it
          console.log(err);
        });
    });
    //res.redirect("/");
    // Send a message to the client
    res.send("Scrape Complete");
  });
});

router.get("/", function(req, res) {
  res.redirect("/articles");
})

router.get("/articles", function(req, res) {
  db.Article.find().sort({_id: -1}).exec(function(err, data) {
    if (err) {
      console.log(err);
    } else {
      var artcl = { article: data };
      res.render("index", artcl);
    }
  })
})

router.get("/articles-json", function(req, res) {
  db.Article.find({}, function(err, data) {
    if (err) {
      console.log(err);
    } else {
      res.json(data);
    }
  })
})

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}. Visit http://localhost:${PORT}/ in your browser.`)
})

module.exports = router;