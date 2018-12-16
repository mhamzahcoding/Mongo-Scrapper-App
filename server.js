// ==============================================================================
// DEPENDENCIES
// Series of npm packages that we will use to give our server useful functionality
// ==============================================================================

// Parses our HTML and helps us find elements
var cheerio = require("cheerio");
// Makes HTTP request for HTML page
var axios = require("axios");

var express = require("express");
var mongoose = require("mongoose");

var PORT = process.env.PORT || 8080;

var app = express();

var db = require("./models");

// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static("public"));

// Parse application body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set Handlebars.
//var exphbs = require("express-handlebars");

//app.engine("handlebars", exphbs({ defaultLayout: "main" }));
//app.set("view engine", "handlebars");

//Import routes and give the server access to them.
//var routes = require("./controllers/catsController.js");

//app.use(routes);

// Start our server so that it can begin listening to client requests.
app.listen(PORT, function () {
    // Log (server-side) when our server has started
    console.log("Server listening on: http://localhost:" + PORT);
});

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/cnnlive";

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

console.log("working");



var results = [];
// Making a request via axios for reddit's "webdev" board. The page's HTML is passed as the callback's third argument
axios.get("http://www.cnn.com").then(function(response) {

  // Load the HTML into cheerio and save it to a variable
  // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
  var $ = cheerio.load(response.data);

  // An empty array to save the data that we'll scrape
  //var result = {};

  // With cheerio, find each p-tag with the "title" class
  // (i: iterator. element: the current element)
  $("cd--article").each(function(i, element) {

    // Save the text of the element in a "title" variable
    var link = $(element).find("h3").find("a").attr("href");

    // In the currently selected element, look at its child elements (i.e., its a-tags),
    // then save the values for any "href" attributes that the child elements may have    
    var title = $(this).find("div").find("h3").text();

    var headline = $(this).find("div").find("span").text();

    result = {
        headline: headline,
        title: title,
        link: link
    };

   // results.push(result);
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

      // Create a new Article using the `result` object built from scraping

  // Log the results once you've looped through each of the elements found with cheerio
  //console.log(results);
//   db.Article.create(results)
//   .then(function(dbArticle) {
//     // View the added result in the console
//     console.log(dbArticle);
//   })
//   .catch(function(err) {
//     // If an error occurred, log it
//     console.log(err);
//   });
});

    // Log the results once you've looped through each of the elements found with cheerio
  //  console.log(result);