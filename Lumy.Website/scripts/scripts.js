$(document).ready(function() {

	/***************** Waypoints ******************/

	$('.wp1').waypoint(function() {
		$('.wp1').addClass('animated fadeInLeft');
	}, {
		offset: '75%'
	});
	$('.wp2').waypoint(function() {
		$('.wp2').addClass('animated fadeInDown');
	}, {
		offset: '75%'
	});
	$('.wp3').waypoint(function() {
		$('.wp3').addClass('animated bounceInDown');
	}, {
		offset: '75%'
	});
	$('.wp4').waypoint(function() {
		$('.wp4').addClass('animated fadeInDown');
	}, {
		offset: '75%'
	});

});

$('.menu-toggler').click(function() {
	"use strict";
	$('.home').toggleClass('js-menu-open');
	$('.menu-flower').toggleClass('js-close');
});

/* When user clicks a link */
$("a.menu-item").click(function() {
    $('.home').toggleClass('js-menu-open');
    $('.menu-flower').toggleClass('js-close');
});

/***************** Smooth Scrolling ******************/

$('a[href*=#]:not([href=#])').click(function() {
	if (location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') && location.hostname === this.hostname) {

		var target = $(this.hash);
		target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
		if (target.length) {
			$('html,body').animate({
				scrollTop: target.offset().top
			}, 2000);
			return false;
		}
	}
});


/***************** Contact Us **********************/

$(document).ready(function () {
	var fullName, phone, email, date, hour, place, description;
	$("#send_email").click(function () {
		fullName = $("#fullName").val();
		phone = $("#phone").val();
		email = $("#email").val();
		date = $("#date").val();
		hour = $("#hour").val();
		place = $("#place").val();
		description = $("#description").val();
		$("#message").text("פנייתך נשלחת ללומי...");
		$.get("http://www.lumyflowers.com/send", {
			fullName: fullName,
			phone: phone,
			email: email,
			date: date,
			hour: hour,
			place: place,
			description: description
		}, function (data) {
			if (data == "sent") {
				$("#message").empty().html("נשלח!");
			}
		}, function() {
			$("#message").empty().html("שגיאה!");
		});
	});
});