var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// Schema for article notes
var NoteSchema = new Schema({
    title: {
        type: String
    },
    body: {
        type: String
    }
})

// Saving & exporting the Note schema
var Note = mongoose.model("Note", NoteSchema);
module.exports = Note;