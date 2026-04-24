/* ============================================
   HACIENDA POPALITO — Panel Admin (Protegido)
   ============================================ */

(function () {
  'use strict';

  const ADMIN_PASSWORD = 'Hacienda.popalito206.';
  const ADMIN_TOKEN_KEY = 'hacienda_admin_token';
  const TOKEN_EXPIRY = 24 * 60 * 60 * 1000;

  // === VERIFICAR ACCESO ===
  function isAdminAuthenticated() {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    if (!token) return false;
    
    try {
      const tokenData = JSON.parse(token);
      if (Date.now() > tokenData.expiry) {
        localStorage.removeItem(ADMIN_TOKEN_KEY);
        return false;
      }
      return true;
    } catch (e) {
      return false;
    }
  }

  // === VERIFICAR URL OCULTA ===
  function checkAdminURL() {
    const params = new URLSearchParams(window.location.search);
    const adminKey = params.get('admin');
    
    if (adminKey === 'popalito_admin_2025') {
      const tokenData = {
        authenticated: true,
        expiry: Date.now() + TOKEN_EXPIRY
      };
      localStorage.setItem(ADMIN_TOKEN_KEY, JSON.stringify(tokenData));
      window.history.replaceState({}, document.title, window.location.pathname);
      return true;
    }
    return false;
  }

  // === INICIALIZAR PANEL ===
  function initAdminPanel() {
    checkAdminURL();
    
    if (!isAdminAuthenticated()) return;

    const adminBtn = document.createElement('button');
    adminBtn.id = 'adminToggle';
    adminBtn.className = 'admin-toggle';
    adminBtn.innerHTML = '⚙️';
    adminBtn.title = 'Panel Admin';
    document.body.appendChild(adminBtn);

    adminBtn.addEventListener('click', () => {
      const modal = document.getElementById('adminModal');
      if (modal) {
        modal.classList.toggle('visible');
      }
    });

    const modal = document.createElement('div');
    modal.id = 'adminModal';
    modal.className = 'admin-modal';
    modal.innerHTML = `
      <div class="admin-modal__backdrop"></div>
      <div class="admin-modal__box">
        <button class="admin-modal__close">&times;</button>
        <h2>Panel Admin</h2>
        <div class="admin-tabs">
          <button class="admin-tab active" data-tab="config">Configuracion</button>
          <button class="admin-tab" data-tab="reservas">Reservas</button>
          <button class="admin-tab" data-tab="logout">Salir</button>
        </div>
        
        <!-- CONFIG -->
        <div class="admin-tab-content active" id="tab-config">
          <div class="admin-form">
            <label>Telefono WhatsApp</label>
            <input type="text" id="configWhatsapp" class="admin-input" placeholder="573222954445">
            
            <label>Precio Anterior</label>
            <input type="text" id="configPrecioAnterior" class="admin-input" placeholder="350.000">
            
            <label>Precio Actual</label>
            <input type="text" id="configPrecioActual" class="admin-input" placeholder="280.000">
            
            <label>Cupos Disponibles</label>
            <input type="number" id="configCupos" class="admin-input" placeholder="4">
            
            <button id="configSaveBtn" class="admin-btn">Guardar Cambios</button>
            <p class="admin-note">Nota: Los cambios se guardan en localStorage. Para persistencia, edita config.js en GitHub.</p>
          </div>
        </div>

        <!-- RESERVAS -->
        <div class="admin-tab-content" id="tab-reservas" style="display:none;">
          <div id="reservasContainer" class="admin-reservas">
            <p>Cargando reservas...</p>
          </div>
          <button id="refreshReservasBtn" class="admin-btn">Actualizar</button>
        </div>

        <!-- LOGOUT -->
        <div class="admin-tab-content" id="tab-logout" style="display:none;">
          <p>Cerrar sesion de administrador</p>
          <button id="logoutBtn" class="admin-btn admin-btn--danger">Cerrar Sesion</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    document.querySelector('.admin-modal__close').addEventListener('click', () => {
      modal.classList.remove('visible');
    });

    document.querySelector('.admin-modal__backdrop').addEventListener('click', () => {
      modal.classList.remove('visible');
    });

    document.querySelectorAll('.admin-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        const tabName = e.target.dataset.tab;
        document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.admin-tab-content').forEach(c => c.style.display = 'none');
        e.target.classList.add('active');
        document.getElementById(`tab-${tabName}`).style.display = 'block';
        
        if (tabName === 'reservas') {
          loadReservas();
        }
      });
    });

    document.getElementById('configSaveBtn').addEventListener('click', () => {
      const newConfig = {
        whatsapp: document.getElementById('configWhatsapp').value,
        telefono_visible: document.getElementById('configWhatsapp').value,
        precio_anterior: document.getElementById('configPrecioAnterior').value,
        precio_actual: document.getElementById('configPrecioActual').value,
        cupos_disponibles: document.getElementById('configCupos').value
      };
      
      Object.assign(CONFIG, newConfig);
      localStorage.setItem('hacienda_config', JSON.stringify(newConfig));
      alert('Cambios guardados. Recargando pagina...');
      location.reload();
    });

    document.getElementById('refreshReservasBtn').addEventListener('click', loadReservas);

    document.getElementById('logoutBtn').addEventListener('click', () => {
      localStorage.removeItem(ADMIN_TOKEN_KEY);
      alert('Sesion cerrada');
      location.reload();
    });

    loadConfig();
  }

  function loadConfig() {
    document.getElementById('configWhatsapp').value = CONFIG.whatsapp;
    document.getElementById('configPrecioAnterior').value = CONFIG.precio_anterior;
    document.getElementById('configPrecioActual').value = CONFIG.precio_actual;
    document.getElementById('configCupos').value = CONFIG.cupos_disponibles || 4;
  }

  function loadReservas() {
    const container = document.getElementById('reservasContainer');
    container.innerHTML = '<p>Cargando...</p>';
    
    fetch('https://docs.google.com/spreadsheets/d/1-BROiFClrY9QtmULfzA9vbZAewIsLTWxkJkWeQSAXww/gviz/tq?tqx=out:json')
      .then(r => r.text())
      .then(data => {
        const json = JSON.parse(data.substring(47).slice(0, -2));
        const rows = json.table.rows;
        
        if (rows.length === 0) {
          container.innerHTML = '<p>No hay reservas aun</p>';
          return;
        }

        let html = '<table class="admin-table"><thead><tr>';
        json.table.cols.forEach(col => {
          html += `<th>${col.label}</th>`;
        });
        html += '</tr></thead><tbody>';

        rows.forEach(row => {
          html += '<tr>';
          row.c.forEach(cell => {
            html += `<td>${cell ? cell.v : '-'}</td>`;
          });
          html += '</tr>';
        });

        html += '</tbody></table>';
        container.innerHTML = html;
      })
      .catch(err => {
        container.innerHTML = `<p>Error: ${err.message}</p>`;
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAdminPanel);
  } else {
    initAdminPanel();
  }

})();
