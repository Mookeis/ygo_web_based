$(function() {
    let $el = $('.parallax-window');
    $(window).on('scroll', function () {
        let scroll = $(document).scrollTop();
        $el.css({
            'background-position':'50% '+(-.4*scroll)+'px'
        });
    });
});