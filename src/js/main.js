$(document).ready(function() {
	
	// Console log anchor links on click
	$('.js-link').click(function(){
		console.log($(this).data('link'));
	});
	
	
	// Fade in on scroll
    AOS.init();
	    
});

