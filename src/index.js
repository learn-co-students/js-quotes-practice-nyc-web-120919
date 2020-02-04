// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finshed loading. 
document.addEventListener("DOMContentLoaded", function (){


fetch('http://localhost:3000/quotes?_embed=likes')
    .then(response => response.json())
.then(quotesList => quotesList.forEach(quote => getQuote(quote)))


const ul = document.getElementById('quote-list');

function getQuote(quote) {
    const li = document.createElement('li');
    li.className = 'quote-card'
    li.dataset.id = quote.id
    if (quote.likes) {
      quoteLikes = quote.likes.length
    } else {
      quoteLikes = 0
    }
    li.innerHTML = `
      <blockquote class="blockquote">
        <p class="mb-0">${quote.quote}</p>
        <footer class="blockquote-footer">${quote.author}</footer>
        <br>
        <button class='btn-success'>Likes: <span>${quoteLikes}</span></button>
        <button class='btn-danger'>Delete</button>
      </blockquote>`
    ul.append(li);
}

const newQuoteForm = document.getElementById('new-quote-form')
newQuoteForm.addEventListener('submit', function(e) {
  e.preventDefault()
  let newQuote = document.getElementById('new-quote').value;
  let newAuthor = document.getElementById('author').value;
  let quotation = {quote: newQuote, author: newAuthor}
  fetch('http://localhost:3000/quotes', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(quotation)      
  })
  .then(response => response.json())
  .then(receivedQuotation => getQuote(receivedQuotation));
  newQuoteForm.reset();
});

ul.addEventListener('click', function(e){
  const li = e.target.parentNode.parentNode
  if (e.target.className === 'btn-danger') {
    fetch(`http://localhost:3000/quotes/${li.dataset.id}`, {
      method: "delete"
    })
    li.remove();
  } else if (e.target.className === 'btn-success') {
    let liId = parseInt(li.dataset.id)
    let like = {quoteId: liId, created_at: Date.now()}
    let targetSpan = li.querySelector('span')
    let currentScore = parseInt(targetSpan.innerText)
    let newScore = currentScore + 1
    targetSpan.innerText = newScore
    fetch('http://localhost:3000/likes', {
      method: "post",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(like)
    })

  }
})



})