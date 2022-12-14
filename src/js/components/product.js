import Swiper from 'swiper';

const catalogList = document.querySelector(".catalog_products");
const catalogMore = document.querySelector(".product_btn ");
const prodModal = document.querySelector('[data-graph-target="prod-modal"] .modal-content');
const prodModalSlider = prodModal.querySelector('.modal-slider .swiper-wrapper');
const prodModalInfo = prodModal.querySelector('.modal-info');
const prodModalPreview = prodModal.querySelector('.modal-preview');
const prodModalDescr = prodModal.querySelector('.modal-prod-descr');
const prodModalChars = prodModal.querySelector('.prod-chars');
const prodModalVideo = prodModal.querySelector('.prod-video');
let prodQuantity = 5;
let dataLength = null;

const normalPrice = (str) => {
  return String(str).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
};

const prodSlider = new Swiper('.modal-slider__container', {
  slidesPerView: 1,
  spaceBetween: 20,
});

if(catalogList){
  const loadProducts = (quantity = 5) =>{
    fetch('../data.json')
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        dataLength = data.length;

        catalogList.innerHTML = '';

        for (let i = 0; i < dataLength; i++){
          if(i < quantity){
            let item = data[i];


            catalogList.innerHTML += `
             <li class="catalog_product_item">
              <div class="products_image">
                <img src="${item.mainImage}" alt="${item.title}" class="products_image_item">

                <div class="products_image_btns">
                  <button class="product_image_btn" data-graph-path="prod-modal" data-id="${item.id}">
                    <img src="img/svg/eye.svg" alt="eye">
                  </button>
                  <button class="product_image_btn product-button add-to-cart-btn" data-id="${item.id}" aria-label="Добавить товар в корзину">
                    <img src="img/svg/add_cart.svg" alt="cart">
                  </button>
                </div>
              </div>
              <div class="product_description description">${item.title}</div>
              <div class="product_price ">${normalPrice(item.price)}</div>
            </li>
            `;
          }
        }

        cartLogic();

        const modal = new GraphModal({
          isOpen: (modal) => {
            if(modal.modalContainer.classList.contains('prod-modal')){
              const openBtnId = modal.previousActiveElement.dataset.id;
              loadModalData(openBtnId)

              prodSlider.update();
            }
          },
        });
    })

  }

  loadProducts(prodQuantity);

  const loadModalData = (id = 1) => {
    fetch('../data.json')
      .then((response) => {
        return response.json();
      })

      .then((data) => {
        prodModalSlider.innerHTML = '';
        prodModalPreview.innerHTML = '';
        prodModalInfo.innerHTML = "";
        prodModalDescr.innerHTML = "";
        prodModalChars.innerHTML = "";
        prodModalVideo.innerHTML = '';

        for (let dataItem of data) {
          if (dataItem.id == id) {

            const slides = dataItem.gallery.map((image, idx) => {
              return `
                <div class="swiper-slide" data-index="${idx}">
                  <img src="${image}" alt="">
                </div>
              `;
            });

            const preview = dataItem.gallery.map((image, idx) => {
              return `
                <div class = "modal-preview__item ${idx === 0 ? 'modal-preview__item--active' : ''}" tabindex="0" data-index="${idx}">
                    <img src = "${image}" alt = "">
                </div>
              `;
            });

            const sizes = dataItem.sizes.map((size, idx) => {
              return `
               <li class="modal-sizes__item" data-index="${idx}">
                  <button class="modal-sizes__btn">${size}</button>
               </li>
              `;
            });

            prodModalSlider.innerHTML = slides.join("");
            prodModalPreview.innerHTML = preview.join("");
            prodModalInfo.innerHTML = `
             <div class="modal-info__wrapper">
                <div class="modal-info__top">
                  <span class="modal-info__vendor">Артикул: 879876</span>
                  <span class="modal-info__quantity">В наличии: <span>13 шт</span></span>
                </div>
                <h3 class="modal-info__title">${dataItem.title}</h3>
                <div class="modal-info__rate">
                  <img src="img/svg/star.svg" alt="Рейтинг 5 из 5">
                  <img src="img/svg/star.svg" alt="">
                  <img src="img/svg/star.svg" alt="">
                  <img src="img/svg/star.svg" alt="">
                  <img src="img/svg/star.svg" alt="">
                </div>
                <div class="modal-info__subtitle">Выберите размер</div>
                <ul class="list-reset modal-info__sizes-list modal-sizes">
                  ${sizes.join("")}
                </ul>
                <div class="modal-info__price">
                  <span class="modal-info__current-price">${dataItem.price} p</span>
                  <span class="modal-info__old-price">${dataItem.oldPrice ? dataItem.oldPrice + 'р' : ''}</span>
                </div>
                <button class="modal-info__order btn">Заказать</button>
                <ul class="modal-info__note modal-note">
                  <li class="modal-note_item">Бесплатная доставка до двери</li>
                  <li class="modal-note_item">Оплата заказа при получении</li>
                  <li class="modal-note_item">Обмен в течении двух недель</li>
                </ul>
             </div>
            `;
            prodModalDescr.textContent = dataItem.description;

            let charsItems = "";

            Object.keys(dataItem.chars).forEach(function eachKey(key){
              charsItems += `<p class="prod-bottom__descr prod-chars__item">${key}: ${dataItem.chars[key]}</p>`
            })
            prodModalChars.innerHTML = charsItems;

            if (dataItem.video){
              prodModalVideo.style.display = 'block';
              prodModalVideo.innerHTML = `
             <iframe src="${dataItem.video}"
             class="prod-video"
             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
             </iframe>
              `;
            } else{
              prodModalVideo.style.display = 'none';
            }
          }

        }
      })
      .then(() => {
        prodSlider.update();

        prodSlider.on('slideChangeTransitionEnd', function () {
          let idx = document.querySelector('.swiper-slide-active').dataset.index;
          document.querySelectorAll('.modal-preview__item').forEach(el => {el.classList.remove('modal-preview__item--active');});
          document.querySelector(`.modal-preview__item[data-index="${idx}"]`).classList.add('modal-preview__item--active');
        });

        document.querySelectorAll('.modal-preview__item').forEach(el => {
          el.addEventListener('click', (e) => {
            const idx = parseInt(e.currentTarget.dataset.index);
            document.querySelectorAll('.modal-preview__item').forEach(el => {el.classList.remove('modal-preview__item--active');});
            e.currentTarget.classList.add('modal-preview__item--active');

            prodSlider.slideTo(idx);
          });
        });
      });
  }

  catalogMore.addEventListener('click', (e) => {
    prodQuantity = prodQuantity + 3;

    loadProducts(prodQuantity);

    if(prodQuantity >= dataLength) {
      catalogMore.style.display = 'none'
    } else{
      catalogMore.style.display = 'block'
    }
  });
}


//Корзина

const miniCartList = document.querySelector('.mini-cart__list');
const fullPrice = document.querySelector('.mini-cart__summ');
const cartCount = document.querySelector('.cart_count')
let price = 0;

const priceWithoutSpaces = (str) => {
  return str.replace(/\s/g, '');
};

const plusFullPrice = (currentPrice) => {
  return price += currentPrice;
};

const minusFullPrice = (currentPrice) => {
  return price -= currentPrice;
};

const printFullPrice = () => {
  fullPrice.textContent = `${normalPrice(price)} р`;
};

const printQuantity = (num) => {
  cartCount.textContent = num;
};

const loadCartData = (id = 1) => {
  fetch('../data.json')
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      for (let dataItem of data) {
        if (dataItem.id == id) {
          console.log(dataItem);
          miniCartList.insertAdjacentHTML('afterbegin', `
             <li class="mini-cart__item" data-id="${dataItem.id}">
                <article class="mini-cart__product mini-product">
                  <div class="mini-product__image">
                    <img src="${dataItem.mainImage}" alt="${dataItem.title}">
                  </div>
                  <div class="mini-product__content">
                    <div class="mini-product__text">
                      <h3 class="mini-product__title">${dataItem.title}</h3>
                      <span class="mini-product__price">${normalPrice(dataItem.price)}</span>
                    </div>
                  </div>
                  <button class="mini-product__delete" aria-label="Удалить товар"></button>
                </article>
              </li>
          `);

          return dataItem;
        }
      }
    })
    .then((item) => {
      plusFullPrice(item.price);
      printFullPrice();
      let num = document.querySelectorAll('.mini-cart__item').length;

      if (num > 0){
        cartCount.classList.add('cart_count--visible')
      }
      printQuantity(num)
    })
}


const cartLogic = () => {
  const productBtn = document.querySelectorAll('.product-button');

  productBtn.forEach(el => {
    el.addEventListener('click', (e) => {
      const id = e.currentTarget.dataset.id;
      loadCartData(id)

      e.currentTarget.classList.add('product-button--disabled');
    });
  });
    miniCartList.addEventListener('click', (e) => {
      if (e.target.classList.contains('mini-product__delete')) {
        const self = e.target;
        const parent = self.closest('.mini-cart__item');
        const price = parseInt(priceWithoutSpaces(parent.querySelector('.mini-product__price').textContent));
        const id = parent.dataset.id;

        document.querySelector(`.product-button[data-id="${id}"]`).classList.remove('product-button--disabled');


        parent.remove();

        minusFullPrice(price);
        printFullPrice();

        let num = document.querySelectorAll('.mini-cart__list .mini-cart__item').length;

        if (num == 0) {
          cartCount.classList.remove('cart_count--visible');
          // miniCart.classList.remove('mini-cart--visible');
          document.querySelector('.cart__btn').classList.add('cart__btn--inactive');
        }

        printQuantity(num);
    }
  })
}

const openOrderModal = document.querySelector('.cart__btn');
const orderModalList = document.querySelector(".ordering_list");
const orderModalQuantity = document.querySelector('.ordering_var');
const orderModalSumm = document.querySelector('.ordering_var__summ');


openOrderModal.addEventListener('click', () =>{
  const productsHtml = document.querySelector('.mini-cart__list').innerHTML;
  orderModalList.innerHTML = productsHtml;

  orderModalQuantity.textContent = `${document.querySelectorAll('.mini-cart__list .mini-cart__item').length} шт`;
  orderModalSumm.textContent = fullPrice.textContent;

})
