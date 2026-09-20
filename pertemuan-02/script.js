$(document).ready(function () {
    $('.faq-question').on('click', function () {
        var $clickedAnswer = $(this).next('.faq-answer');
        var sudahTerbuka = $clickedAnswer.is(':visible');
        $('.faq-answer').not($clickedAnswer).slideUp(300);
        $('.faq-question').not(this).removeClass('active');
        $clickedAnswer.slideToggle(300);
        $(this).toggleClass('active', !sudahTerbuka);
    });
    $('.like-btn').on('click', function () {
        var $tombol = $(this);
        var $counter = $tombol.siblings('.like-count');
        var jumlahSaatIni = parseInt($counter.text(), 10) || 0;

        if ($tombol.hasClass('liked')) {
            jumlahSaatIni = Math.max(0, jumlahSaatIni - 1);
            $tombol.removeClass('liked');
        } else {
            jumlahSaatIni += 1;
            $tombol.addClass('liked');
            $tombol.addClass('like-pop');
            setTimeout(function () {
                $tombol.removeClass('like-pop');
            }, 250);
        }
        $counter.fadeOut(100, function () {
            $(this).text(jumlahSaatIni).fadeIn(150);
        });
    });

});