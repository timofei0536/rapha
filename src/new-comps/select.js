if (document.querySelector('.select')) {
    if (window.its_desktop) {
        $('.select').on('mouseenter', function () {
            $(this).addClass('select--hover');
        });
        $('.select').on('mouseleave', function () {
            $(this).removeClass('select--hover');
        });
        $('.select__variant').on('click', function () {
            var select_value = $(this).find('span').text();
            $(this).closest('.select').find('.select__value').text(select_value);
            $(this).closest('.select').find('.select__variant--active').removeClass('select__variant--active');
            $(this).addClass('select__variant--active');
            $(this).closest('.select').removeClass('select--active');
        });
    } else {
        $('.select__value').on('mouseenter', function () {
            if ($(this).closest('.select').hasClass('select--active')) {
                $('.select--active').removeClass('select--active');
            } else {
                $('.select--active').removeClass('select--active');
                $(this).closest('.select').addClass('select--active');
            }
        });
        $('.select__variant').on('click', function () {
            var select_value = $(this).find('span').text();
            $(this).closest('.select').find('.select__value').text(select_value);
            $(this).closest('.select').find('.select__variant--active').removeClass('select__variant--active');
            $(this).addClass('select__variant--active');
            $(this).closest('.select').removeClass('select--active');
        });
        $('body').mouseup(function (e) {
            var block = $(".select--active");
            if (!block.is(e.target) &&
                block.has(e.target).length === 0) {
                $('.select--active').removeClass('select--active');
            }
        });
    }
}