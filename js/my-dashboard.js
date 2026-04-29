(function () {
    var filterButtons = document.querySelectorAll('[data-filter]');
    var historyRows = document.querySelectorAll('[data-history-type]');

    function setFilter(filterName) {
        historyRows.forEach(function (row) {
            var matches = filterName === 'all' || row.getAttribute('data-history-type') === filterName;
            row.classList.toggle('hidden', !matches);
        });

        filterButtons.forEach(function (button) {
            button.classList.toggle('is-active', button.getAttribute('data-filter') === filterName);
        });
    }

    filterButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            setFilter(button.getAttribute('data-filter'));
        });
    });

    if (filterButtons.length) {
        setFilter('all');
    }
}());