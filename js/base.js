/* =============================================================
   base.js — shared by ALL pages
   Sidebar/topbar wiring, navigation routing, viewport scaling,
   and trainer-profile injection point.
   ============================================================= */

/* ---------- Navigation ---------- */
function navigateTo(section) {
    const pages = {
        dashboard: 'dashboard.html',
        trainees:  'trainees.html',
        messages:  'messages.html',
        templates: 'templates.html',
        analytics: 'analytics.html',
        settings:  'settings.html'
    };
    if (pages[section]) window.location.href = pages[section];
}

/* Nav items use plain <a href="..."> links + a pre-applied .active
   class on the matching item per page, so the browser handles
   navigation. wireNav() is kept for spec compatibility and any
   future programmatic hook-up. */
function wireNav() {
    // intentionally empty
}

/* ---------- Top bar handlers ---------- */
function onNotifications() {
    console.log('Notifications opened');
    // TODO: open notifications drawer
}

function onUserMenu() {
    console.log('User menu opened');
    // TODO: show dropdown
}

function onLogout() {
    console.log('Logout triggered');
    // TODO: call auth signOut API before redirect
    window.location.href = 'login.html';
}

function wireTopBar() {
    const bell = document.querySelector('.bell-btn');
    if (bell) bell.addEventListener('click', onNotifications);

    const userArea = document.querySelector('.user-area');
    if (userArea) userArea.addEventListener('click', onUserMenu);
}

function wireLogout() {
    const btn = document.querySelector('.logout-btn');
    if (btn) btn.addEventListener('click', onLogout);
}

/* ---------- Trainer profile injection (DB-ready) ---------- */
function setTrainerProfile(name, avatarUrl) {
    // TODO: receives trainer name string and optional avatar URL
    console.log('setTrainerProfile called with:', name, avatarUrl);

    const nameEl   = document.querySelector('.user-name');
    const avatarEl = document.querySelector('.user-avatar');
    if (nameEl && name) {
        nameEl.textContent = name;
        nameEl.style.color = '#000';
    }
    if (avatarEl) {
        avatarEl.style.border = 'none';
        if (avatarUrl) {
            avatarEl.style.background = `#D9D9D9 url("${avatarUrl}") center/cover no-repeat`;
        } else {
            avatarEl.style.background = '#D9D9D9';
        }
        const icon = avatarEl.querySelector('.user-avatar-icon');
        if (icon) icon.style.display = 'none';
    }
}

/* ---------- Responsive scaling (fit 1440x1024 canvas into viewport, centered) ---------- */
function scaleCanvas() {
    const canvas = document.querySelector('.canvas');
    if (!canvas) return;
    const scaleX = window.innerWidth  / 1440;
    const scaleY = window.innerHeight / 1024;
    const scale  = Math.min(scaleX, scaleY);
    canvas.style.transform = `scale(${scale})`;
    canvas.style.left = `${(window.innerWidth  - 1440 * scale) / 2}px`;
    canvas.style.top  = `${(window.innerHeight - 1024 * scale) / 2}px`;
}

/* ---------- Boot ---------- */
document.addEventListener('DOMContentLoaded', () => {
    wireNav();
    wireTopBar();
    wireLogout();
    scaleCanvas();
    window.addEventListener('resize', scaleCanvas);
});
