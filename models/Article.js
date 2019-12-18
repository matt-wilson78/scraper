var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// Schema for scraped article
var ArticleSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        default: "Summary Unavailable"
    },
    isSaved: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        default: "Save Article"
    },
    created: {
        type: Date,
        default: Date.now
    },
    // reference to the Note schema
    note: [{
        type: Schema.Types.ObjectId,
        ref: "Note"
    }]
})

// Saving & exporting the Article schema
var Article = mongoose.model("Article", ArticleSchema);
module.exports = Article;