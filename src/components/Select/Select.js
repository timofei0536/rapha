document.querySelectorAll('.select').forEach(select => {
    const valueDisplay = select.querySelector('.select__value');

    // Хелпер для смены активного варианта
    const updateValue = (variant) => {
        const text = variant.querySelector('span')?.textContent || '';
        if (valueDisplay) valueDisplay.textContent = text;

        select.querySelector('.select__variant--active')?.classList.remove('select__variant--active');
        variant.classList.add('select__variant--active');
        select.classList.remove('select--active');
    };

    if (window.its_desktop) {
        // Логика для десктопа: hover
        select.addEventListener('mouseenter', () => select.classList.add('select--hover'));
        select.addEventListener('mouseleave', () => select.classList.remove('select--hover'));
    } else {
        // Логика для мобильных: клик (mouseenter в вашем коде использовался как триггер)
        valueDisplay?.addEventListener('mouseenter', (e) => {
            const isActive = select.classList.contains('select--active');
            document.querySelectorAll('.select--active').forEach(el => el.classList.remove('select--active'));
            if (!isActive) select.classList.add('select--active');
        });
    }

    // Общая логика выбора варианта (Делегирование)
    select.addEventListener('click', (e) => {
        const variant = e.target.closest('.select__variant');
        if (variant) updateValue(variant);
    });
});

// Закрытие при клике вне селекта (только если есть активные)
document.addEventListener('mouseup', (e) => {
    const activeSelect = document.querySelector('.select--active');
    if (activeSelect && !activeSelect.contains(e.target)) {
        activeSelect.classList.remove('select--active');
    }
});