// Requiring various NPM packages that are used in this app
var express = require("express");
var logger = require("morgan");
var exphbs = require("express-handlebars")
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");

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

app.get("/", (req, res) => {
  db.Article.find({ isSaved: false })
    .then(dbArticle => {
      res.render("article"), { article: dbArticle }
    })
    .catch((err) => {
      return res.json(err)
    })
})

// A GET route for scraping the escapist magazine website
app.get("/scrape", (req, res) => {
  // First, we grab the body of the html with axios
  axios.get("https://www.escapistmagazine.com/v2/").then((response) => {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);
    //console.log(response.data);

    // Grabbing the articles within the post_text div:
    $("div.post_text").each((i, element) => {
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
      result.isSaved = false;

      // Create a new Article using the `result` object built from scraping
      db.Article.create(result)
        .then((dbArticle) => {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch((err) => {
          // If an error occurred, log it
          res.json(err);
        });
    });
    // Send a message to the client
    res.send("Scrape Complete");
  });
});

// Find all articles
app.get("/article", (req, res) => {
  db.Article.find({})
    .then((dbArticle) => {
      res.json(dbArticle);
    })
    .catch((err) => {
      res.json(err);
    })
})

// Find article by id, populate with note
app.get("/article/:id", (req, res) => {
  db.Article.findOne({_id: req.params.id})
    .populate("note")
    .then( dbArticle => {
      res.json(dbArticle)
    })
    .catch( err => {
      res.json(err)
    })
})

// Create/ update a note
app.post("/article/:id", (req, res) => {
  db.Note.create(req.body)
    .then(dbNote => {
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then( dbArticle => {
      res.json(dbArticle)
    })
    .catch( err => {
      res.json(err)
    })
})

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}. Visit http://localhost:${PORT}/ in your browser.`)
})

