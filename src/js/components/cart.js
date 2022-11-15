import SimpleBar from "simplebar";

const cartBtn = document.querySelector('.cart__btn');
const miniCart = document.querySelector('.mini-cart');

cartBtn.addEventListener('click', () => {
  miniCart.classList.add("mini-cart--visible");
})


new SimpleBar(document.getElementById('mini-cart__top'));

document.addEventListener('click', (e) => {
  if (!e.target.classList.contains('mini-cart') && !e.target.closest('.mini-cart') && !e.target.closest('.add-to-cart-btn') && !e.target.closest('.mini-product__delete') && !e.target.closest('.cart__btn') && !e.target.classList.contains('cart__btn')) {
    miniCart.classList.remove('mini-cart--visible');
  }
});
