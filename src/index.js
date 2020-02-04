// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finshed loading. 
document.addEventListener("DOMContentLoaded", function (){


    fetch("http://localhost:3000/quotes?_embed=likes")
    .then(response => response.json())
    .then(quotesList => quotesList.forEach(quote => getQuote(quote)))

    const ul = document.getElementById('quote-list')

    const getQuote = (quote) => {
        const li = document.createElement('li')
        li.dataset.id = quote.id
        if (quote.likes) {
            quoteLikes = quote.likes.length
        } else {quoteLikes = 0}
        li.className = "quote-card"
        li.innerHTML = `<blockquote class="blockquote">
        <p class="mb-0">${quote.quote}</p>
        <footer class="blockquote-footer">${quote.author}</footer>
        <br>
        <button class='btn-success'>Likes: <span>${quoteLikes}</span></button>
        <button class='btn-danger'>Delete</button>
        </blockquote>`
        ul.append(li)
    }

    const newQuoteForm = document.getElementById("new-quote-form")
    newQuoteForm.addEventListener("submit", function(event){
        event.preventDefault()
        let quote = document.getElementById("new-quote").value
        let author = event.target.author.value
        let newQuote = {quote, author}
        fetch("http://localhost:3000/quotes", {
            method: 'post',
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify(newQuote)
        })
        .then(response => response.json())
        .then(receivedQuote => getQuote(receivedQuote))
        newQuoteForm.reset()
    })

    ul.addEventListener("click", function(event){
        li = event.target.parentNode.parentNode
        if (event.target.className === 'btn-danger'){
            fetch (`http://localhost:3000/quotes/${li.dataset.id}`, {
                method: "delete"
            })
            li.remove()
        } else if (event.target.className === 'btn-success'){
            let quoteId = parseInt(event.target.parentNode.parentNode.dataset.id)
            let createdAt = Date.now()
            let newLike = {quoteId, createdAt}
            let oldScoreSpan = li.querySelector('span')
            let newScore = parseInt(oldScoreSpan.innerText) + 1
            oldScoreSpan.innerText = newScore
            fetch(`http://localhost:3000/likes`, {
                method: "post",
                headers: {
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify(newLike)
            })   
        }
    })
})

