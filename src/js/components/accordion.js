document.addEventListener('DOMContentLoaded', () => {
  const accordions = document.querySelectorAll('.accordion_item');

  accordions.forEach(e1 =>{
    e1.addEventListener('click', (e) => {
      const self = e.currentTarget;
      const control = self.querySelector('.accordion_item_control')
      const content = self.querySelector('.accordion_item_content')

      self.classList.toggle('open');

      if(self.classList.contains('open')) {
        control.setAttribute('aria-expended', true);
        content.setAttribute('aria-hidden', false);
        content.style.maxHeight = content.scrollHeight + "px";
      }else{
        control.setAttribute('aria-expended', false);
        content.setAttribute('aria-hidden', true);
        content.style.maxHeight = null;
      }
    });
  });
});
