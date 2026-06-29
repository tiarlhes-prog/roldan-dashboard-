// ─── Auth helpers ───────────────────────────────────────────────────────────
const TOKEN_KEY = 'roldan_token';
const USER_KEY  = 'roldan_user';

function getToken()  { return localStorage.getItem(TOKEN_KEY); }
function getUser()   { try { return JSON.parse(localStorage.getItem(USER_KEY) || 'null'); } catch { return null; } }
function setSession(token, user) { localStorage.setItem(TOKEN_KEY, token); localStorage.setItem(USER_KEY, JSON.stringify(user)); }
function clearSession() { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(USER_KEY); }

function requireAuth() {
  if (!getToken()) { window.location.href = '/index.html'; return false; }
  return true;
}

function logout() {
  clearSession();
  window.location.href = '/index.html';
}

// ─── API helper ──────────────────────────────────────────────────────────────
async function api(path, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch('/api' + path, { ...options, headers });

  if (res.status === 401) { clearSession(); window.location.href = '/index.html'; return null; }

  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) {
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erro na requisição');
    return data;
  }
  if (!res.ok) throw new Error('Erro na requisição');
  return res;
}

// ─── Download helper (PDF / Excel) ──────────────────────────────────────────
async function downloadFile(path, filename) {
  const token = getToken();
  const res = await fetch('/api' + path, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) { showToast('Erro ao gerar arquivo', 'error'); return; }
  const blob = await res.blob();
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a); URL.revokeObjectURL(url);
}

// ─── Toast ───────────────────────────────────────────────────────────────────
function showToast(msg, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.textContent = msg;
  container.appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; t.style.transition = 'opacity .4s'; setTimeout(() => t.remove(), 400); }, 3200);
}

// ─── Format helpers ──────────────────────────────────────────────────────────
function fmtDate(str) {
  if (!str) return '–';
  const d = new Date(str + 'T12:00:00');
  return d.toLocaleDateString('pt-BR');
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

// ─── Navigation ──────────────────────────────────────────────────────────────
function renderNav(activePage) {
  const user = getUser();
  const isAdmin = user?.role === 'admin';
  const links = [
    { href: '/dashboard.html',  label: 'Dashboard'  },
    { href: '/registro.html',   label: 'Novo Registro' },
    { href: '/consolidado.html',label: 'Consolidado' },
    { href: '/relatorios.html', label: 'Relatórios'  },
  ];
  if (isAdmin) links.push({ href: '/admin.html', label: 'Admin' });

  const navLinks = links.map(l =>
    `<a href="${l.href}" class="${activePage === l.href ? 'active' : ''}">${l.label}</a>`
  ).join('');

  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  navbar.innerHTML = `
    <div class="navbar-brand">
      <span>ROLDAN</span><span class="brand-dot"></span>
    </div>
    <nav class="navbar-links" id="nav-links">
      ${navLinks}
    </nav>
    <div class="navbar-user">
      <span>Olá, <strong>${user?.nome?.split(' ')[0] || 'Usuário'}</strong></span>
      <button class="btn-logout" onclick="logout()">Sair</button>
    </div>
    <button class="hamburger" id="hamburger" aria-label="Menu">☰</button>
  `;

  document.getElementById('hamburger')?.addEventListener('click', () => {
    document.getElementById('nav-links')?.classList.toggle('open');
  });
}

// ─── Badge helpers ────────────────────────────────────────────────────────────
function turnoBadge(turno) {
  const map = { 'Manhã': 'badge-info', 'Tarde': 'badge-warn', 'Noite': 'badge-muted', 'Integral': 'badge-success' };
  return `<span class="badge ${map[turno] || 'badge-muted'}">${turno}</span>`;
}
function statusBadge(status) {
  return status === 'Finalizado'
    ? `<span class="badge badge-success">${status}</span>`
    : `<span class="badge badge-warn">${status}</span>`;
}
