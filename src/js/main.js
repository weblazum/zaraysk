// Баннер на главной


const thumbSlides = document.querySelectorAll('.slider-thumbs .slider__item')

const swiperGalleryThumbs = new Swiper('.slider-thumbs', {
  spaceBetween: 15,
  slidesPerView: (thumbSlides.length > 7) ? 7 : thumbSlides.length,
  freeMode: true,
  watchSlidesVisibility: true,
  watchSlidesProgress: true,
  loop: true,
  allowTouchMove: false
})

const swiperSlider = new Swiper('.slider', {
	slidesPerView: 1,
  autoplay: {
    delay: 5000,
    disableOnInteraction: false
  },
	loop: true,
  navigation: {
    nextEl: '.slider__navbutton--next',
    prevEl: '.slider__navbutton--prev',
  },
  pagination: {
    el: '.slider__pagination',
    type: "fraction"
  },
  if (thumbSlides) {
    thumbs: {
      swiper: swiperGalleryThumbs
    }
  },
  on: {
    // init: function() {
      // const _self = this;
      
      // _self.el.style.setProperty('--delay', _self.params.autoplay.delay);
      
      // _self.el.addEventListener('mouseenter', function() {
      //   _self.el.classList.add('swiper--pause');
      //   _self.autoplay.stop();
      // });

      // _self.el.addEventListener('mouseleave', function() {
      //   _self.el.classList.remove('swiper--pause');
      //   _self.autoplay.start();
      // });
    // }, 
    slideChange: function () {
      // Убедитесь, что класс .swiper-navigation существует
      const navigationElement = document.querySelector('.swiper-navigation');
      if (navigationElement) {
        // Удалить существующий активный класс
        navigationElement.classList.remove('swiper-navigation-active');
        // Добавить активный класс к элементу навигации
        setTimeout(() => {
          navigationElement.classList.add('swiper-navigation-active');
        }, 10); // небольшая задержка для надежного добавления класса
      }
    }
  }
})



const swiperPartners = new Swiper('.swiper-partners', {
	slidesPerView: 5,
	autoplay: true,
})


const historyTimes = document.querySelectorAll('.history__slide')

const swiperHistory = new Swiper('.swiper-history', {
  slidesPerView: 1,
  pagination: {
    el: '.history__pagination',
    type: "bullets",
    bulletClass: 'btn history__bullet',
		bulletActiveClass: 'btn-selected history__bullet--active',
    clickable: true,
    renderBullet: function (index, className) {
      return `<button class="${className}">${historyTimes[index].dataset.name}</button>`;
    },
  },
})

// аккордеон
const 
  accordeonList = document.querySelectorAll('.accordeon'),
  accordeonBtn = document.querySelectorAll('.accordeon-btn'),
  accordeonBody = document.querySelectorAll('.accordeon-body')

if (accordeonList) {
  accordeonBtn.forEach((item, index) => {
    item.addEventListener('click', (e) => {
      e.preventDefault()
      
      item.classList.toggle('active')
      accordeonBody[index].classList.toggle('visible')
      
    })
  })
}

// Уведомления
const noticeWindow = document.querySelectorAll('.notice')

if(noticeWindow) {
  noticeWindow.forEach(() => {
    const noticeCloseBtn = document.querySelectorAll('.notice__close')

    noticeCloseBtn.forEach((item, index) => {
      item.addEventListener('click', (e) => {
        e.preventDefault()

        noticeWindow[index].style.display = 'none'
      })
    })
  })
}