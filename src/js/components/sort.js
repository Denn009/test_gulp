const sort = document.querySelector(".sort")
const catalog_left = document.querySelector(".catalog_left")

sort.addEventListener("click", () => {
  sort.classList.toggle('sort--active');
  catalog_left.classList.toggle('catalog_left--active');
})
