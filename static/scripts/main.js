(function ($) {
	"use strict";
	var wind = $(window);
	var parallaxSlider;
	var parallaxSliderOptions = {
		speed: 1000,
		autoplay: true,
		parallax: true,
		loop: true,
		on: {
			init: function () {
				var swiper = this;
				for (var i = 0; i < swiper.slides.length; i++) {
					$(swiper.slides[i]).find('.bg-img').attr({
						'data-swiper-parallax': 0.75 * swiper.width
					});
				}
			},
			resize: function () {
				this.update();
			}
		},
		pagination: {
			el: '.slider-prlx .parallax-slider .swiper-pagination',
			dynamicBullets: true,
			clickable: true
		},
		navigation: {
			nextEl: '.slider-prlx .parallax-slider .next-ctrl',
			prevEl: '.slider-prlx .parallax-slider .prev-ctrl'
		}
	};
	parallaxSlider = new Swiper('.slider-prlx .parallax-slider', parallaxSliderOptions);
	// Var Background image
	var pageSection = $(".bg-img, section");
	pageSection.each(function (indx) {
		if ($(this).attr("data-background")) {
			$(this).css("background-image", "url(" + $(this).data("background") + ")");
		}
	});
	
	var nav = $('nav');
	var navHeight = nav.outerHeight();
	$('.navbar-toggler').on('click', function () {
		if (!$('#mainNav').hasClass('navbar-reduce')) {
			$('#mainNav').addClass('navbar-reduce');
		}
	});

	// Navbar Menu Reduce 
	$(window).trigger('scroll');
	$(window).on('scroll', function () {
		var pixels = 50;
		var top = 1200;
		if ($(window).scrollTop() > pixels) {
			$('.navbar-expand-lg').addClass('navbar-reduce');
			$('.navbar-expand-lg').removeClass('navbar-trans');
		} else {
			$('.navbar-expand-lg').addClass('navbar-trans');
			$('.navbar-expand-lg').removeClass('navbar-reduce');
		}
		if ($(window).scrollTop() > top) {
			$('.scrolltop-mf').fadeIn(1000, "easeInOutExpo");
		} else {
			$('.scrolltop-mf').fadeOut(1000, "easeInOutExpo");
		}
	});
	// Back to top button 
	$(function () {
		// Scroll Event
		$(window).on('scroll', function () {
			var scrolled = $(window).scrollTop();
			if (scrolled > 300) $('.back-to-top').addClass('active');
			if (scrolled < 300) $('.back-to-top').removeClass('active');
		});
		// Click Event
		$('.back-to-top').on('click', function () {
			$("html, body").animate({
				scrollTop: "0"
			}, 500);
		});
	});
	//  Star Scrolling nav
	$('a.js-scroll[href*="#"]:not([href="#"])').on("click", function () {
		if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
			var target = $(this.hash);
			target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
			if (target.length) {
				$('html, body').animate({
					scrollTop: (target.offset().top - navHeight + 30)
				}, 1000, "easeInOutExpo");
				return false;
			}
		}
	});
	// Closes responsive menu when a scroll trigger link is clicked
	$('.js-scroll').on("click", function () {
		$('.navbar-collapse').collapse('hide');
	});
	// Activate scrollspy to add active class to navbar items on scroll
	$('body').scrollspy({
		target: '#mainNav',
		offset: navHeight
	});
	
    wind.on('scroll', function () {
        $(".causes-progress .progres").each(function () {
            var bottom_of_object =
                $(this).offset().top + $(this).outerHeight();
            var bottom_of_window =
                $(window).scrollTop() + $(window).height();
            var myVal = $(this).attr('data-value');
            if (bottom_of_window > bottom_of_object) {
                $(this).css({
                    width: myVal
                });
            }
        });
    });
	
	// Partner Logo
	$('#partner-carousel').owlCarousel({
		margin: 0,
		autoplay: true,
		autoplayTimeout: 4000,
		smartSpeed: 800,
		nav: false,
		dots: false,
		autoplayHoverPause: true,
		loop: true,
		responsiveClass: true,
		responsive: {
			0: {
				items: 1
			},
			768: {
				items: 3
			},
			1000: {
				items: 5
			}
		}
	});
	
    //  POPUP VIDEO
    // $(document).ready(function() {
	// 	$('.popup-video').magnificPopup({
	// 		type: 'iframe',
	// 	});
	// 	const vid = document.getElementById('vid');
	// 	vid.addEventListener('click', () => {
	// 		vid.addClass('.video-btn');
	// 		vid.addClass('.popup-video');
	// 	})
	// });
	
	
	// WOW JS
	$(window).on('load', function () {
		if ($(".wow").length) {
			var wow = new WOW({
				boxClass: 'wow', // Animated element css class (default is wow)
				animateClass: 'animated', // Animation css class (default is animated)
				offset: 30, // Distance to the element when triggering the animation (default is 0)
				mobile: false, // Trigger animations on mobile devices (default is true)
				live: true, // Act on asynchronously loaded content (default is true)
			});
			wow.init();
		}
	});
	
	// START PRELOADED
    $(window).on('load', function () {
        $('#preloader').fadeOut('slow', function () {
            $(this).remove();
        });
    });
	
})(jQuery);

///////////////// Lazy image loading /////////////////

// const images = document.querySelectorAll('img[data-src]');

// const loadImg = function (entries, observer) {
// 	const [entry] = entries;

// 	if(!entry.isIntersecting) return;
	
// 	entry.target.src = entry.target.dataset.src;

// 	entry.target.classList.remove('lazy');
// 	// entry.target.addEventListener('load', () => {
// 	// });

// 	observer.unobserve(entry.target);
// }

// const imgObs = new IntersectionObserver(loadImg, {
// 	root: null,
// 	threshold: 0,
// 	rootMargin: '150px',
// });

// images.forEach(img => imgObs.observe(img));

const images = document.querySelectorAll('img[data-src]');
const delay = 700; // Set a delay in milliseconds

const loadImg = function (entries, observer) {
    entries.forEach((entry, index) => {
        if (!entry.isIntersecting) return;

        setTimeout(() => {
            entry.target.src = entry.target.dataset.src;
			entry.target.addEventListener('load', () => {entry.target.classList.remove('lazy');})
            // entry.target.classList.remove('lazy');
            observer.unobserve(entry.target);
        }, delay);
    });
};

const imgObs = new IntersectionObserver(loadImg, {
    root: null,
    threshold: 0,
    // rootMargin: '150px', // Adjust this value as needed
});

images.forEach(img => imgObs.observe(img));

/////////// Revealing Elements on scroll ///////////////

const allSections = document.querySelectorAll('section');

const revealSec = (entries, observer) => {
	const [entry] = entries;

	if(!entry.isIntersecting) return;

	entry.target.classList.remove('section-hidden');
	entry.target.classList.add('section-visible');
	observer.unobserve(entry, target);
}

const sectionObserver = new IntersectionObserver(revealSec, {
	root: null,
	threshold: 0.15,
});

allSections.forEach((sec) => {
	sec.classList.add('section-hidden');
	sectionObserver.observe(sec);
})
