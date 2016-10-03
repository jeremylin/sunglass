(function($){
  $(function(){
		var scroll = $(document).scrollTop();
		var headerHeight = $('.moNaviWrap').outerHeight();

		$(window).scroll(function() {
			var scrolled = $(document).scrollTop();
			if (scrolled > headerHeight){
				$('.moNaviWrap').addClass('off-canvas');
			} else {
				$('.moNaviWrap').removeClass('off-canvas');
			}

		    if (scrolled > scroll){
				$('.moNaviWrap').removeClass('fixed');
		    } else {
				$('.moNaviWrap').addClass('fixed');
		    }

			scroll = $(document).scrollTop();
		});
	});
})(jQuery);