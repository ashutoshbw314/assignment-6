const imagesFinder = document.querySelector("#images-finder");
const gallery = document.querySelector('.gallery');
const galleryHeader = document.querySelector('.gallery-header');
const searchInput = document.getElementById("search");
const searchBtn = document.getElementById('search-btn');

const sliderArea = document.getElementById("slider-area");
const sliderBtn = document.getElementById('create-slider');
const sliderContainer = document.getElementById('sliders');
const closeSlidersButton = document.getElementById("close-sliders-btn");
const durationInput = document.getElementById("duration");
// selected image 
let sliders = [];


// If this key doesn't work
// Find the name in the url and go to their website
// to create your own api key
const KEY = '15674931-a9d714b6e9d654524df198e00&q';

// show images 
const showImages = (images) => {
  gallery.innerHTML = '';
  galleryHeader.style.display = 'none';
  if (!images.length) {
    gallery.innerHTML = "<p class='message'>No images found. Please try something else.</p>";
    return;
  }
  // show gallery title
  galleryHeader.style.display = 'flex';
  images.forEach(image => {
    let div = document.createElement('div');
    div.className = 'col-lg-3 col-md-4 col-xs-6 img-item mb-2';
    div.innerHTML = ` <img class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">`;
    gallery.appendChild(div)
  })

}

const getImages = (query) => {
  gallery.innerHTML = `<div id="spinner" class="spinner-grow mt-5" role="status"></div>`;
  fetch(`https://pixabay.com/api/?key=${KEY}=${query}&image_type=photo&pretty=true`)
    .then(response => response.json())
    .then(data => showImages(data.hits))
    .catch(err => console.log(err))
}

let slideIndex = 0;
const selectItem = (event, img) => {
  let element = event.target;
  element.classList.toggle('added');
 
  let item = sliders.indexOf(img);
  if (item === -1) {
    sliders.push(img);
  } else {
    sliders.splice(item, 1);
  }
}
var timer
const createSlider = () => {
  // check slider image length
  if (sliders.length < 2) {
    alert('Select at least 2 image.')
    return;
  }
  // crate slider previous next area
  sliderContainer.innerHTML = '';
  const prevNext = document.createElement('div');
  prevNext.className = "prev-next d-flex w-100 justify-content-between align-items-center";
  prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

  sliderContainer.appendChild(prevNext)
  sliderArea.style.display = 'flex';
  // hide image aria
  imagesFinder.style.display = 'none';
  const duration = Math.abs(+durationInput.value || 1);
  durationInput.value = duration;
  sliders.forEach(slide => {
    let item = document.createElement('div')
    item.className = "slider-item";
    item.innerHTML = `<img class="w-100"
    src="${slide}"
    alt="">`;
    sliderContainer.appendChild(item)
  })
  changeSlide(0)
  timer = setInterval(function () {
    slideIndex++;
    changeSlide(slideIndex);
  }, duration * 1000);
}

// change slider index 
const changeItem = index => {
  changeSlide(slideIndex += index);
}

// change slide item
const changeSlide = (index) => {

  const items = document.querySelectorAll('.slider-item');
  if (index < 0) {
    slideIndex = items.length - 1
    index = slideIndex;
  };

  if (index >= items.length) {
    index = 0;
    slideIndex = 0;
  }

  items.forEach(item => {
    item.style.display = "none"
  })

  items[index].style.display = "block"
}

const search = () => {
  sliders.length = 0;
  getImages(searchInput.value)
}

searchBtn.addEventListener('click', search);

searchInput.onkeydown = event => {
  if (event.key == "Enter") search();
};

sliderBtn.addEventListener('click', function () {
  createSlider()
});

closeSlidersButton.onclick = event => {
  sliderArea.style.display = 'none';
  imagesFinder.style.display = 'block';
  clearInterval(timer);
}
