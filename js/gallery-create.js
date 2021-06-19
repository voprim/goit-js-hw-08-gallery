import itemsDefault from './gallery-items.js';

const refs = {
  galleryList: document.querySelector('.js-gallery'), //общий родитель картинок
  modal: document.querySelector('.js-lightbox'), //модальное окно
  modalCloseBtn: document.querySelector('button[data-action="close-lightbox"]'), //кнопка закрытия модального окна
  modalImage: document.querySelector('.lightbox__image'),
  modalOverlay: document.querySelector('.lightbox__overlay'), //серый фон в модалке
};

// Создание и рендер разметки по массиву данных и предоставленному шаблону.

const galleryMarkup = createGalleryMarkup(itemsDefault);
refs.galleryList.insertAdjacentHTML('beforeend', galleryMarkup);

function createGalleryMarkup(elements) {
  return elements
    .map(({ preview, original, description }) => {
      return `
    <li class="gallery__item">
  <a
    class="gallery__link"
    href="${original}"
  >
    <img
      class="gallery__image"
      src="${preview}"
      data-source="${original}"
      alt="${description}"
    />
  </a>
</li>
    `;
    })
    .join('');
}

// Реализация делегирования на галерее ul.js-gallery и получение url большого изображения.

refs.galleryList.addEventListener('click', onOpenModal);

function onOpenModal(evt) {
  if (evt.target.nodeName !== 'IMG') {
    return;
  }
  evt.preventDefault(); //отмена перехода по ссылке

  refs.modal.classList.add('is-open'); // Открытие модального окна по клику на элементе галереи.
  refs.modalImage.src = evt.target.dataset.source; // Подмена значения атрибута src элемента img.lightbox__image.
  refs.modalImage.alt = evt.target.alt;

  window.addEventListener('keydown', onEscKeyPress);
  window.addEventListener('keydown', onArrowLeftPress);
  window.addEventListener('keydown', onArrowRightPress);
}

// Закрытие модального окна по клику на кнопку button[data-action="close-lightbox"].
refs.modalCloseBtn.addEventListener('click', onCloseModal);

function onCloseModal() {
  refs.modal.classList.remove('is-open');
  refs.modalImage.src = ''; // Очистка значения атрибута src элемента img.lightbox__image.
  refs.modalImage.alt = '';
  window.removeEventListener('keydown', onEscKeyPress);
  window.removeEventListener('keydown', onArrowLeftPress);
  window.removeEventListener('keydown', onArrowRightPress);
}

// Закрытие модального окна по клику на div.lightbox__overlay.

refs.modalOverlay.addEventListener('click', onBOverlayClick);

function onBOverlayClick(evt) {
  if (evt.currentTarget === evt.target) {
    onCloseModal();
  }
}

// Закрытие модального окна по нажатию клавиши ESC.

function onEscKeyPress(event) {
  const ESC_KEY_CODE = 'Escape';
  const isEscKey = event.code === ESC_KEY_CODE;

  if (isEscKey) {
    onCloseModal();
  }
}

// Пролистывание изображений галереи в открытом модальном окне клавишами "влево" и "вправо".
//ArrowLeft

function onArrowLeftPress(evt) {
  const ARR_LEFT_KEY_CODE = 'ArrowLeft';
  const isArrLeftKey = evt.code === ARR_LEFT_KEY_CODE;

  if (isArrLeftKey) {
    const sources = itemsDefault.map(({ original }) => original);
    let indexOfCurrentImg = sources.indexOf(refs.modalImage.src);

    if (indexOfCurrentImg === 0) {
      indexOfCurrentImg = sources.length;
    }
    refs.modalImage.src = sources[indexOfCurrentImg - 1];
    console.log(indexOfCurrentImg);
  }
}

//ArrowRight

function onArrowRightPress(evt) {
  const ARR_RIGHT_KEY_CODE = 'ArrowRight';
  const isArrRightKey = evt.code === ARR_RIGHT_KEY_CODE;

  if (isArrRightKey) {
    const sources = itemsDefault.map(({ original }) => original);
    let indexOfCurrentImg = sources.indexOf(refs.modalImage.src);

    if (indexOfCurrentImg + 1 > sources.length - 1) {
      indexOfCurrentImg = -1;
    }
    refs.modalImage.src = sources[indexOfCurrentImg + 1];
    console.log(indexOfCurrentImg + 1);
  }
}

/* 2 вариант создания разметки createElement
---------------------------------------------
const createGalleryMarkup = elements => {
  return elements.map(element => {
    const listEl = document.createElement('li');
    listEl.classList.add('gallery__item');
    const linkEl = document.createElement('a');
    linkEl.classList.add('gallery__link');
    linkEl.href = element.original;
    const imageEl = document.createElement('img');
    imageEl.classList.add('gallery__image');
    imageEl.src = element.preview;
    imageEl.dataset.source = element.original;
    imageEl.alt = element.description;
    linkEl.append(imageEl);
    listEl.append(linkEl);
    return listEl;
  });
};
const itemsOfGallery = createGalleryMarkup(itemsDefault);
galleryList.append(...itemsOfGallery);*/
