(function () {
    var citizenButtons = Array.prototype.slice.call(document.querySelectorAll('[data-citizen-card]'));
    var nameNode = document.querySelector('[data-profile-name]');
    var tierNode = document.querySelector('[data-profile-tier]');
    var pointsNode = document.querySelector('[data-profile-points]');
    var milestoneNode = document.querySelector('[data-profile-milestone]');
    var recommendationNode = document.querySelector('[data-profile-recommendation]');
    var historyNode = document.querySelector('[data-profile-history]');
    var knowledgeNode = document.querySelector('[data-profile-knowledge]');

    var citizens = {
        ava: {
            name: 'Ava Thompson',
            tier: 'Gold Citizen',
            points: '1,240 points',
            milestone: '40 points away from Volunteer Champion',
            recommendation: 'Thank Ava for joining the river cleanup and offer a priority slot in next week\'s tree planting event.',
            history: 'Recent history: river cleanup, zoning feedback survey, library mentor signup.',
            knowledge: 'Knowledge prompt: use the volunteer fast-track script and waive repeat identity verification for this visit.'
        },
        marcus: {
            name: 'Marcus Lee',
            tier: 'Volunteer Champion',
            points: '1,890 points',
            milestone: 'Eligible for civic ambassador invitation',
            recommendation: 'Recognize Marcus as a repeat advocate and suggest the neighborhood safety roundtable.',
            history: 'Recent history: youth sports coaching, bus route feedback, emergency preparedness webinar.',
            knowledge: 'Knowledge prompt: share advocacy toolkit article and escalate service requests to community liaison if needed.'
        },
        sofia: {
            name: 'Sofia Ramirez',
            tier: 'Silver Citizen',
            points: '760 points',
            milestone: 'Needs one more event to unlock Gold Citizen',
            recommendation: 'Invite Sofia to complete the digital accessibility forum and explain the tier benefit uplift.',
            history: 'Recent history: permit renewal call, accessibility survey, public meeting attendance.',
            knowledge: 'Knowledge prompt: surface permit renewal FAQ and accommodation policy excerpt.'
        }
    };

    function renderCitizen(key) {
        var citizen = citizens[key];
        if (!citizen) {
            return;
        }

        nameNode.textContent = citizen.name;
        tierNode.textContent = citizen.tier;
        pointsNode.textContent = citizen.points;
        milestoneNode.textContent = citizen.milestone;
        recommendationNode.textContent = citizen.recommendation;
        historyNode.textContent = citizen.history;
        knowledgeNode.textContent = citizen.knowledge;

        citizenButtons.forEach(function (button) {
            button.classList.toggle('is-selected', button.getAttribute('data-citizen-card') === key);
        });
    }

    citizenButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            renderCitizen(button.getAttribute('data-citizen-card'));
        });
    });

    if (citizenButtons.length) {
        renderCitizen(citizenButtons[0].getAttribute('data-citizen-card'));
    }
}());