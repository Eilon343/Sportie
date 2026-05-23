/* =============================================================
   trainees.js — Trainees List page only
   Renders the trainee table from data, plus stubs for the
   search, filter, and row-click interactions.
   ============================================================= */

/* ---------- Stub handlers ---------- */
function onTraineeClick(id) {
    console.log('Trainee clicked:', id);
    // TODO: navigate to trainee profile
}

function onSearchTrainees(value) {
    console.log('Search:', value);
    // TODO: filter rows by name
}

function onFilterTrainees() {
    console.log('Filter opened');
    // TODO: open filter dropdown
}

/* ---------- Row rendering (DB-ready) ---------- */
function renderTrainees(traineesArray) {
    // [{id, name, avatarColor, avatarUrl,
    //   status:'active'|'paused'|'finished',
    //   goal, progress, lastActivity}]
    console.log('renderTrainees called with:', traineesArray);

    const empty = document.getElementById('traineesEmpty');
    const list  = document.getElementById('traineesList');
    if (!list) return;

    list.innerHTML = '';

    if (!Array.isArray(traineesArray) || traineesArray.length === 0) {
        if (empty) empty.classList.remove('hidden');
        return;
    }

    if (empty) empty.classList.add('hidden');

    traineesArray.forEach(t => {
        const row = document.createElement('div');
        row.className = 'trainee-row';
        row.dataset.id = t.id;

        // Avatar
        const avatar = document.createElement('div');
        avatar.className = 'trainee-avatar';
        if (t.avatarUrl) {
            avatar.style.background = `#D9D9D9 url("${t.avatarUrl}") center/cover no-repeat`;
        } else if (t.avatarColor) {
            avatar.style.background = t.avatarColor;
        }

        // Name
        const name = document.createElement('span');
        name.className = 'trainee-name';
        name.textContent = t.name ?? '';

        // Status badge
        const status = document.createElement('span');
        const statusKey = (t.status || '').toLowerCase();
        status.className = `trainee-status status-${statusKey}`;
        status.textContent = statusKey;

        // Goal
        const goal = document.createElement('span');
        goal.className = 'trainee-goal';
        goal.textContent = t.goal ?? '';

        // Progress
        const progress = document.createElement('span');
        progress.className = 'trainee-progress';
        progress.textContent = t.progress ?? '';

        // Last activity
        const last = document.createElement('span');
        last.className = 'trainee-last-activity';
        last.textContent = t.lastActivity ?? '';

        // Chevron
        const chevron = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        chevron.setAttribute('class', 'trainee-chevron');
        chevron.setAttribute('viewBox', '0 0 16 16');
        chevron.setAttribute('fill', 'none');
        chevron.innerHTML =
            '<path d="M6 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" ' +
            'stroke-linecap="round" stroke-linejoin="round"/>';

        row.append(avatar, name, status, goal, progress, last, chevron);
        row.addEventListener('click', () => onTraineeClick(t.id));

        list.appendChild(row);
    });
}

/* ---------- DOM wiring ---------- */
function wireTrainees() {
    const searchInput = document.querySelector('.trainees-search-input');
    if (searchInput) {
        searchInput.addEventListener('input', e => onSearchTrainees(e.target.value));
    }

    const filterBtn = document.querySelector('.trainees-filter');
    if (filterBtn) {
        filterBtn.addEventListener('click', onFilterTrainees);
    }
}

/* ---------- Boot ---------- */
document.addEventListener('DOMContentLoaded', () => {
    wireTrainees();
});
