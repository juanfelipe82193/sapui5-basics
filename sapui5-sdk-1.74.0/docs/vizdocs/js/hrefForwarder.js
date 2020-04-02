$(document).ready(function() {
    $('a').bind("click", function(e) {
        if (this.href.indexOf('#') === -1 && this.getAttribute('href').charAt(0) === '/') {
            e.preventDefault();
            parent._switchPage(this.href)
        }
    });
});
