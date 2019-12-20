$(document).ready( () => {
    getArticles() => {
        $.get("/scrape").then(data => {
            console.log(data)
        })
    }
})

getArticles();

renderArticles() => {
    $.getJSON("/article", data => {
        for (let i = 0; i < array.length; i++) {
            $("#articles-container").append("<p data-id'" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>")
        }
    })
}

renderArticles();