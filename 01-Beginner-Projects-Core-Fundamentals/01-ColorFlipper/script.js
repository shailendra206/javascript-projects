const btn = document.querySelector('.flip-btn')
const colorCode = document.getElementById('colorCode')

function randomColor(){
    const str = '0123456789ABCDEF'
    let hexCode = '#'
    for(let i=0;i<6;i++){
        hexCode += str[Math.floor(Math.random()*16)]
    }
    return hexCode;
}

btn.addEventListener('click',()=>{
    const hexCode = randomColor()
    document.body.style.background = hexCode
    colorCode.textContent = hexCode
})