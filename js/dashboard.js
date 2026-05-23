/* =============================================================
   dashboard.js — Dashboard page only
   Stat cards, Chart.js overview, and Most Active Clients panel.
   Shared sidebar/topbar/scaling lives in js/base.js.
   ============================================================= */

/* ---------- Module-level state ---------- */
let overviewChart = null;

/* ---------- Dashboard-only handlers ---------- */
function onTotalClients() {
    console.log('Total clients clicked');
    // TODO: navigate to trainees list with filter
}

function onViewAllClients() {
    console.log('View all clients');
    // TODO: navigate to full client list
}

function onClientClick(name) {
    console.log('Client clicked:', name);
    // TODO: navigate to client profile page
}

/* ---------- DOM wiring ---------- */
function wireStatCards() {
    const totalClientsLabel = document.querySelector('[data-action="total-clients"]');
    if (totalClientsLabel) totalClientsLabel.addEventListener('click', onTotalClients);
}

function wireClientsPanel() {
    const viewAll = document.querySelector('[data-action="view-all-clients"]');
    if (viewAll) viewAll.addEventListener('click', onViewAllClients);

    document.querySelectorAll('.client-row').forEach(row => {
        row.addEventListener('click', () => onClientClick(row.dataset.name));
    });
}

/* ---------- Chart.js: Overview of Clients ---------- */
function renderOverviewChart() {
    const canvas = document.getElementById('overviewChart');
    if (!canvas || typeof Chart === 'undefined') return;

    const labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7'];
    // Placeholder — all zeros until updateChartData() injects real values.
    const data   = [0, 0, 0, 0, 0, 0, 0];

    overviewChart = new Chart(canvas, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                data,
                borderColor: '#00800F',
                borderWidth: 3,
                tension: 0,
                fill: false,
                pointStyle: 'circle',
                pointRadius: 7.5,
                pointBorderColor: '#00800F',
                pointBorderWidth: 2.5,
                pointBackgroundColor: 'rgba(0,0,0,0)',
                pointHoverRadius: 8.5,
                pointHoverBackgroundColor: 'rgba(0,0,0,0)',
                pointHoverBorderColor: '#00800F'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: { left: 0, right: 12, top: 8, bottom: 0 }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: ctx => `${ctx.parsed.y}%`
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: '#A8A8A8',
                        lineWidth: 1,
                        drawTicks: false
                    },
                    ticks: {
                        font: { family: "'Inter', sans-serif", size: 14 },
                        color: '#000',
                        padding: 8
                    },
                    border: { color: '#A8A8A8' }
                },
                y: {
                    min: 0,
                    max: 20,
                    ticks: {
                        stepSize: 5,
                        font: { family: "'Inter', sans-serif", size: 10 },
                        color: '#000',
                        padding: 6,
                        callback: v => `${v}%`
                    },
                    grid: {
                        color: '#A8A8A8',
                        lineWidth: 1,
                        drawTicks: false
                    },
                    border: { color: '#A8A8A8' }
                }
            }
        }
    });
}

/* ---------- Data injection points (DB-ready) ---------- */
function renderClients(clientsArray) {
    // TODO: receives array of {name, avatarColor, avatarUrl}
    //       clears empty state and renders client rows dynamically
    console.log('renderClients called with:', clientsArray);

    const empty = document.getElementById('clientsEmpty');
    const list  = document.getElementById('clientsList');
    if (!list) return;

    list.innerHTML = '';

    if (!Array.isArray(clientsArray) || clientsArray.length === 0) {
        if (empty) empty.classList.remove('hidden');
        return;
    }

    if (empty) empty.classList.add('hidden');

    // Same panel-relative top positions used in the static design:
    const rowTops = [125, 210, 294, 379, 464, 549, 634, 719];

    clientsArray.slice(0, rowTops.length).forEach((client, i) => {
        const row = document.createElement('div');
        row.className = 'client-row';
        row.style.top = `${rowTops[i]}px`;
        row.dataset.name = client.name;

        const avatar = document.createElement('div');
        avatar.className = 'client-avatar';
        if (client.avatarUrl) {
            avatar.style.background = `#F3F3F3 url("${client.avatarUrl}") center/cover no-repeat`;
        } else {
            avatar.style.background = client.avatarColor || '#D9D9D9';
        }

        const name = document.createElement('span');
        name.className = 'client-name';
        name.textContent = client.name;

        row.appendChild(avatar);
        row.appendChild(name);
        row.addEventListener('click', () => onClientClick(client.name));

        list.appendChild(row);
    });
}

function updateChartData(newDataArray) {
    // TODO: receives array of 7 weekly values; updates chart + clears overlay
    console.log('updateChartData called with:', newDataArray);

    if (!overviewChart || !Array.isArray(newDataArray)) return;

    overviewChart.data.datasets[0].data = newDataArray.slice(0, 7);
    overviewChart.update();

    const overlay = document.getElementById('chartEmptyOverlay');
    if (overlay) overlay.classList.add('hidden');
}

function updateStatCards(stats) {
    // stats = { totalClients, activeClients, workouts, avgProgress }
    // TODO: replace "—" with real values from DB
    console.log('updateStatCards called with:', stats);

    if (!stats || typeof stats !== 'object') return;

    document.querySelectorAll('.stat-value').forEach(el => {
        const key = el.dataset.stat;
        if (key && stats[key] != null) {
            el.textContent = stats[key];
            el.classList.add('has-data');
            // Hide the matching "No data yet" subtitle in the same card
            const subtitle = el.parentElement?.querySelector('.stat-subtitle');
            if (subtitle) subtitle.classList.add('hidden');
        }
    });
}

/* ---------- Boot ---------- */
document.addEventListener('DOMContentLoaded', () => {
    wireStatCards();
    wireClientsPanel();
    renderOverviewChart();
});
