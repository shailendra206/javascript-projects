const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot')
const currentSlide = document.getElementById('currentSlide')


let currentIndex = 0;
let slider

function showNextSlide() {
  slides[currentIndex].classList.remove('active');
  dots[currentIndex].classList.remove('active')
  currentIndex++;

  if (currentIndex === slides.length) {
    currentIndex = 0;
  }
  currentSlide.textContent = `0${currentIndex + 1}`
  slides[currentIndex].classList.add('active');
  dots[currentIndex].classList.add('active')
}
slider =  setInterval(showNextSlide, 5000);
