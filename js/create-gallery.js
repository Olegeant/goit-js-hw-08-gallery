import gallery from './gallery-items.js';

const makeGalleryItemMarkup = ({ preview, original, description }) => {
  return `<li class="gallery__item">
            <a class="gallery__link" href="${original}">
              <img
                class="gallery__image"
                src="${preview}"
                data-source="${original}"
                alt="${description}"
              />
            </a>
          </li>`;
};

const LightBoxOpen = photo => {
  lightBoxImgRef.src = photo.dataset.source;
  lightBoxImgRef.alt = photo.alt;

  lightBoxRef.classList.add('is-open');
  lightBoxRef.dataset.index = galleryImagesList.indexOf(photo);

  window.addEventListener('keydown', onKeyPressed);
};

const LightBoxClose = () => {
  lightBoxRef.classList.remove('is-open');
  lightBoxRef.removeAttribute('data-index');

  lightBoxImgRef.src = '';
  lightBoxImgRef.alt = '';

  window.removeEventListener('keydown', onKeyPressed);
};

const LightBoxImageSwipe = offset => {
  let nextIndex = Number(lightBoxRef.dataset.index) + offset;

  if (nextIndex < 0) {
    nextIndex = galleryImagesList.length - 1;
  }
  if (nextIndex > galleryImagesList.length - 1) {
    nextIndex = 0;
  }

  lightBoxRef.dataset.index = nextIndex;
  lightBoxImgRef.src = galleryImagesList[nextIndex].dataset.source;
  lightBoxImgRef.alt = galleryImagesList[nextIndex].alt;
};

const onPhotoClick = event => {
  event.preventDefault();

  const targetPhoto = event.target;
  if (!targetPhoto.classList.contains('gallery__image')) {
    return;
  }

  LightBoxOpen(targetPhoto);
};

const onKeyPressed = event => {
  if (
    event.key !== 'Escape' &&
    event.key !== 'ArrowLeft' &&
    event.key !== 'ArrowRight'
  ) {
    return;
  }

  let offset;

  switch (event.key) {
    case 'Escape':
      LightBoxClose();
      return;

    case 'ArrowRight':
      offset = 1;
      LightBoxImageSwipe(offset);
      return;

    case 'ArrowLeft':
      offset = -1;
      LightBoxImageSwipe(offset);
      return;
  }
};

const galleryMarkup = gallery.map(item => makeGalleryItemMarkup(item)).join('');

const galleryRef = document.querySelector('.js-gallery');
const lightBoxRef = document.querySelector('.js-lightbox');
const lightBoxOverlayRef = lightBoxRef.querySelector('.lightbox__overlay');
const lightBoxImgRef = lightBoxRef.querySelector('.lightbox__image');
const lightBoxCloseBtn = lightBoxRef.querySelector(
  'button[data-action="close-lightbox"]',
);

galleryRef.insertAdjacentHTML('afterbegin', galleryMarkup);

const galleryImagesList = [...galleryRef.querySelectorAll('.gallery__image')];

galleryRef.addEventListener('click', onPhotoClick);
lightBoxCloseBtn.addEventListener('click', LightBoxClose);
lightBoxOverlayRef.addEventListener('click', LightBoxClose);
