/**
 * Created by Oleg on 16/12/2015.
 */
$(document).ready(function () {
    $('.hero').slick({
        dots: true,
        infinite: true,
        speed: 750,
        slidesToShow: 1,
        //centerMode: true,
        //adaptiveHeight: true,
        //variableWidth: true,
        autoplay: true,
        autoplaySpeed: 2000,
        rtl: true
    }).on('beforeChange', function afterSlideChange(event, slick, currentSlide, nextSlide) {
        "use strict";
        $('.slick-slide').find('.hero-content').removeClass('fadeInDown').removeClass('fadeOutUp');
        if (Math.abs(nextSlide - currentSlide) > 1) {
            $(".slick-cloned").find('.hero-content').addClass('fadeInDown');
        }
        $(".slick-slide[data-slick-index=" + currentSlide + "]").find('.hero-content').addClass('fadeOutUp');
        $(".slick-slide[data-slick-index=" + nextSlide + "]").find('.hero-content').addClass('fadeInDown');
    });
});
