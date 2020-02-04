// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finshed loading. 
let quotes = []
let allLikes = []

document.addEventListener('DOMContentLoaded', (event) => {
    getLikes()
    getQuotes()
    formSubmit()
});

function getQuotes() {
    fetch('http://localhost:3000/quotes')
        .then(resp => resp.json())
        .then(json => {
            quotes = json
            renderAllQuotes()
        })
}

function getLikes() {
    fetch('http://localhost:3000/likes')
        .then(resp => resp.json())
        .then(json => {
            allLikes = json
        })
}

function formSubmit() {
    const form = document.getElementById("new-quote-form")
    form.addEventListener('submit', onSubmit)
}

function onSubmit(event) {
    event.preventDefault()
    const quote = event.target['new-quote'].value
    const author = event.target.author.value
    const newQuote = { quote, author }
    fetch('http://localhost:3000/quotes', {
        method: 'POST',
        headers:
        {
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify(newQuote)
    })

    const ul = document.getElementById('quote-list');
    renderQuote(ul, newQuote)
    event.target.reset()
}

function renderAllQuotes() {
    console.log(quotes)
    const ul = document.getElementById('quote-list');
    quotes.forEach(quote => {
        renderQuote(ul, quote)
    })
}

function renderQuote(ul, quote) {
    const likes = allLikes.filter(like => like.quoteId === quote.id).length
    const li = document.createElement('li')
    li.classList.add('quote-card')
    li.innerHTML = `
        <blockquote class="blockquote" data-id=${quote.id}>
            <p class="mb-0">${quote.quote}</p>
            <footer class="blockquote-footer">${quote.author}</footer>
            <br>
            <button class='btn-success'>Likes: <span>${likes}</span></button>
            <button class='btn-danger'>Delete</button>
        </blockquote>
    `
    const buttons = li.getElementsByTagName('button')
    buttons[0].addEventListener('click', likeButton)
    buttons[1].addEventListener('click', deleteButton)
    ul.appendChild(li)
}

function likeButton(event) {
    const likeButton = event.target.parentElement.children[3]
    likeButton.innerText = `Likes: ${parseInt(likeButton.innerText.split(' ')[1]) + 1}`
    const id = event.target.parentElement.dataset.id
    fetch('http://localhost:3000/likes', {
        method: 'POST',
        headers:
        {
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify({
            quoteId: parseInt(id),
            createdAt: Date.now()
        })
    })
}

function deleteButton(event) {
    const id = event.target.parentElement.dataset.id
    fetch(`http://localhost:3000/quotes/${id}`, {
        method: 'DELETE'
    })
    event.target.parentElement.parentElement.remove()
}