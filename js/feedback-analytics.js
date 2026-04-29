(function () {
    var buttons = Array.prototype.slice.call(document.querySelectorAll('[data-range]'));
    var scoreNode = document.querySelector('[data-score-value]');
    var trendNode = document.querySelector('[data-score-trend]');
    var coachingNode = document.querySelector('[data-coaching-focus]');
    var bars = Array.prototype.slice.call(document.querySelectorAll('[data-bar-key]'));

    var datasets = {
        weekly: {
            score: '4.6 / 5',
            trend: 'Citizen ratings increased 0.2 points week over week.',
            coaching: 'Coaching focus: improve call wrap-up clarity for permit questions.',
            values: { empathy: 88, clarity: 72, speed: 81, followup: 69 }
        },
        monthly: {
            score: '4.4 / 5',
            trend: 'Citizen ratings are stable with strong volunteer-program interactions.',
            coaching: 'Coaching focus: reinforce escalation handling for in-person disputes.',
            values: { empathy: 84, clarity: 75, speed: 78, followup: 71 }
        },
        quarterly: {
            score: '4.5 / 5',
            trend: 'Quarterly performance improved after targeted coaching sessions.',
            coaching: 'Coaching focus: maintain proactive recommendation usage across all teams.',
            values: { empathy: 86, clarity: 77, speed: 80, followup: 74 }
        }
    };

    function applyRange(rangeKey) {
        var dataset = datasets[rangeKey];
        if (!dataset) {
            return;
        }

        scoreNode.textContent = dataset.score;
        trendNode.textContent = dataset.trend;
        coachingNode.textContent = dataset.coaching;

        bars.forEach(function (bar) {
            var key = bar.getAttribute('data-bar-key');
            var value = dataset.values[key] || 0;
            bar.style.width = value + '%';
            bar.setAttribute('aria-label', value + ' percent');
        });

        buttons.forEach(function (button) {
            button.classList.toggle('is-active', button.getAttribute('data-range') === rangeKey);
        });
    }

    buttons.forEach(function (button) {
        button.addEventListener('click', function () {
            applyRange(button.getAttribute('data-range'));
        });
    });

    if (buttons.length) {
        applyRange('monthly');
    }
}());