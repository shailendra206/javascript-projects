// const API_URL = 'https://api.quotable.io/random';

const newQuoteBtn = document.getElementById('newQuoteBtn')
const quoteText = document.getElementById('quoteText')
const authorName = document.getElementById('authorName')
const copyText = document.getElementById('copyText')
const copyBtn = document.querySelector('.btn-secondary')
const toast = document.getElementById('toast')

let quoteStr = ''
let authorStr = ''

newQuoteBtn.addEventListener('click',()=>{
    getQuote()
})

copyText.addEventListener('click',()=>{
    const textToCopy = `“${quoteStr}”
— ${authorStr}`;
    navigator.clipboard.writeText(textToCopy);
})

async function getQuote(){
    try{
        showLoadingOverlay()
        const res = await fetch("https://dummyjson.com/quotes/random")
        const data = await res.json();
        quoteStr = data.quote
        authorStr = data.author
        // quoteText.textContent = `"${data.quote}"`
        // authorName.textContent = `"${data.author}"`
        quoteText.textContent = quoteStr
        authorName.textContent = authorStr
    }catch{
        quoteText.textContent = "Failed to load quote.";
        authorName.textContent = "";
    }finally{
        hideLoadingOverlay()
    }
}

copyBtn.addEventListener('click',()=>{
    toast.classList.add('show')
    setTimeout(() => {
      toast.classList.remove('show')
    }, 2000);
})

const loadingOverlay = document.querySelector('.loading-overlay')

function showLoadingOverlay(){
    loadingOverlay.classList.add('show')
}
function hideLoadingOverlay(){
    loadingOverlay.classList.remove('show')
}