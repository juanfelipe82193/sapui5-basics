function sticky_relocate() {
        var window_top = $(window).scrollTop();
        var div_top = $('#sticky-anchor').offset().top;
        if (window_top > (div_top ) ) {
            $('.sticky').addClass('stick');
            $('.sticky').removeClass('stay');
        } else {
            $('.sticky').removeClass('stick');
            $('.sticky').addClass('stay');
        }
    }

    $(function () {
        $(window).scroll(sticky_relocate);
        sticky_relocate();
    });
