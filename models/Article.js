var mongoose = require("mongoose");
var Schem = mongoose.Schema;

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
    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    }
})

var Article = mongoose.model("Article", ArticleSchema);
module.exports = Article;