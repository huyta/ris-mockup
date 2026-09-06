/**
 * HealthSys RIS Mockup - Reusable UI Component Factory
 * File: js/components.js
 */

// Inject component styling
(function() {
  const style = document.createElement('style');
  style.textContent = `
    .detail-row { display: flex; padding: 8px 0; border-bottom: 1px solid #f1f5f9; }
    .detail-label { width: 180px; font-weight: 500; color: #64748b; font-size: 0.875rem; flex-shrink: 0; }
    .detail-value { flex: 1; font-size: 0.875rem; }
    .breadcrumbs { display: flex; align-items: center; gap: 8px; font-size: 0.85rem; color: #64748b; margin-bottom: 8px; }
    .breadcrumbs a { color: var(--primary, #2563eb); text-decoration: none; }
    .breadcrumbs .separator { color: #cbd5e1; }
    .breadcrumbs .current { color: #334155; font-weight: 500; }
    
    /* Reusable Component UI Enhancements */
    .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .card-title { margin: 0; font-size: 1.15rem; font-weight: 600; color: #1e293b; }
    .btn-group { display: flex; gap: 8px; align-items: center; }
    .metric-card { background: #fff; border: 1px solid var(--border, #e2e8f0); border-radius: 8px; padding: 16px 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
    .metric-card h3 { margin: 0 0 8px 0; font-size: 0.85rem; color: #64748b; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; }
    .metric-card .value { margin: 0; font-size: 1.75rem; font-weight: 700; color: #0f172a; }
    .metric-primary { border-left: 4px solid var(--primary, #2563eb); }
    .metric-success { border-left: 4px solid var(--success, #10b981); }
    .metric-warning { border-left: 4px solid var(--warning, #f59e0b); }
    .metric-danger { border-left: 4px solid var(--danger, #ef4444); }
    
    .table-container { width: 100%; overflow-x: auto; background: #fff; border-radius: 6px; }
    .data-table { width: 100%; border-collapse: collapse; text-align: left; }
    .data-table th, .data-table td { padding: 12px 14px; border-bottom: 1px solid var(--border, #e2e8f0); font-size: 0.9rem; vertical-align: middle; }
    .data-table th { background-color: #f8fafc; color: #475569; font-weight: 600; }
    .clickable-row { cursor: pointer; transition: background-color 0.15s ease; }
    .clickable-row:hover { background-color: #f1f5f9 !important; }
    
    .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(15, 23, 42, 0.6); display: none; align-items: center; justify-content: center; z-index: 9999; backdrop-filter: blur(2px); padding: 20px; }
    .modal-overlay.active { display: flex; }
    .modal { background: #fff; border-radius: 10px; width: 600px; max-width: 95vw; max-height: 90vh; display: flex; flex-direction: column; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.2), 0 10px 10px -5px rgba(0,0,0,0.04); overflow: hidden; }
    .modal.modal-sm { width: 420px; }
    .modal.modal-lg { width: 800px; }
    .modal.modal-xl { width: 1050px; }
    .modal.modal-full { width: 96vw; height: 94vh; max-height: 96vh; }
    .modal-header { padding: 16px 24px; border-bottom: 1px solid var(--border, #e2e8f0); display: flex; justify-content: space-between; align-items: center; background: #fff; }
    .modal-header h3 { margin: 0; font-size: 1.2rem; color: #1e293b; font-weight: 600; }
    .modal-body { padding: 24px; overflow-y: auto; flex: 1; color: #334155; }
    .modal-footer { padding: 14px 24px; border-top: 1px solid var(--border, #e2e8f0); display: flex; justify-content: flex-end; gap: 10px; background: #f8fafc; }
    .btn-ghost { background: transparent; border: none; font-size: 1.5rem; line-height: 1; cursor: pointer; color: #94a3b8; padding: 2px 8px; border-radius: 4px; }
    .btn-ghost:hover { color: #0f172a; background: #f1f5f9; }
    
    .search-bar-container { display: flex; gap: 12px; align-items: center; margin-bottom: 16px; flex-wrap: wrap; }
    .search-input-wrapper { position: relative; flex: 1; min-width: 220px; }
    .search-input { width: 100%; padding: 9px 12px 9px 36px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; font-size: 0.9rem; background: #fff; color: #1e293b; box-sizing: border-box; }
    .search-input:focus { outline: none; border-color: var(--primary, #2563eb); box-shadow: 0 0 0 3px rgba(37,99,235,0.15); }
    .search-icon { position: absolute; left: 11px; top: 50%; transform: translateY(-50%); font-size: 0.9rem; color: #94a3b8; pointer-events: none; }
    .search-filters { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
    .filter-item { display: flex; align-items: center; gap: 6px; }
    .filter-label { font-size: 0.85rem; color: #64748b; font-weight: 500; }
    .filter-select { padding: 8px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 6px; font-size: 0.85rem; background: #fff; color: #334155; cursor: pointer; }
    
    .tabs-container { margin-bottom: 20px; border-bottom: 1px solid var(--border, #e2e8f0); }
    .tab-bar { display: flex; gap: 6px; overflow-x: auto; }
    .tab-item { padding: 10px 18px; border: none; background: transparent; font-size: 0.9rem; font-weight: 500; color: #64748b; cursor: pointer; border-bottom: 2px solid transparent; display: flex; align-items: center; gap: 8px; transition: all 0.2s; white-space: nowrap; }
    .tab-item:hover { color: #1e293b; }
    .tab-item.active { color: var(--primary, #2563eb); border-bottom-color: var(--primary, #2563eb); font-weight: 600; }
    .tab-count { background: #e2e8f0; color: #475569; padding: 2px 8px; border-radius: 12px; font-size: 0.75rem; font-weight: 600; }
    .tab-item.active .tab-count { background: #dbeafe; color: #1e40af; }
    
    .timeline { position: relative; padding-left: 28px; border-left: 2px solid var(--border, #e2e8f0); margin: 16px 0 16px 12px; }
    .timeline-item { position: relative; margin-bottom: 22px; }
    .timeline-item:last-child { margin-bottom: 0; }
    .timeline-point { position: absolute; left: -35px; top: 3px; width: 12px; height: 12px; border-radius: 50%; background: #94a3b8; border: 2px solid #fff; box-shadow: 0 0 0 2px #e2e8f0; }
    .timeline-status .timeline-point, .timeline-primary .timeline-point { background: #2563eb; box-shadow: 0 0 0 2px #bfdbfe; }
    .timeline-success .timeline-point { background: #10b981; box-shadow: 0 0 0 2px #a7f3d0; }
    .timeline-warning .timeline-point { background: #f59e0b; box-shadow: 0 0 0 2px #fde68a; }
    .timeline-error .timeline-point, .timeline-danger .timeline-point { background: #ef4444; box-shadow: 0 0 0 2px #fecaca; }
    .timeline-header { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; }
    .timeline-title { font-weight: 600; font-size: 0.92rem; color: #1e293b; }
    .timeline-time { font-size: 0.78rem; color: #94a3b8; white-space: nowrap; }
    .timeline-desc { font-size: 0.85rem; color: #64748b; margin-top: 4px; line-height: 1.4; }
    
    .empty-state { text-align: center; padding: 48px 24px; color: #64748b; }
    .empty-state-icon { font-size: 2.8rem; margin-bottom: 12px; }
    .empty-state h3 { margin: 0 0 8px 0; color: #334155; font-size: 1.15rem; font-weight: 600; }
    .empty-state p { margin: 0 0 18px 0; font-size: 0.9rem; max-width: 460px; margin-left: auto; margin-right: auto; }
    .empty-state-actions { display: flex; justify-content: center; gap: 10px; }
    
    .error-state { text-align: center; padding: 32px 24px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; color: #991b1b; }
    .error-state h3 { margin: 0 0 8px 0; font-size: 1.1rem; }
    .error-state p { margin: 0 0 16px 0; font-size: 0.9rem; }
    
    .pagination-container { display: flex; align-items: center; justify-content: center; gap: 12px; padding: 18px 0 8px 0; }
    .pagination-pages { display: flex; gap: 4px; align-items: center; }
    .btn-page { min-width: 32px; height: 32px; padding: 0 6px; border: 1px solid var(--border, #cbd5e1); background: #fff; border-radius: 5px; cursor: pointer; font-size: 0.85rem; font-weight: 500; color: #475569; transition: all 0.15s; }
    .btn-page.active { background: var(--primary, #2563eb); color: #fff; border-color: var(--primary, #2563eb); }
    .btn-page:hover:not(.active) { background: #f8fafc; border-color: #94a3b8; }
    .pagination-ellipsis { color: #94a3b8; padding: 0 4px; }
    .pagination-info { font-size: 0.85rem; color: #64748b; margin-left: 8px; }
    
    .required-star { color: #ef4444; font-weight: bold; margin-left: 2px; }
    .form-group { margin-bottom: 16px; }
    .form-group label { display: block; margin-bottom: 6px; font-weight: 500; font-size: 0.88rem; color: #334155; }
    .form-control { width: 100%; padding: 8px 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 5px; font-size: 0.9rem; font-family: inherit; color: #1e293b; background: #fff; box-sizing: border-box; }
    .form-control:focus { outline: none; border-color: var(--primary, #2563eb); box-shadow: 0 0 0 3px rgba(37,99,235,0.15); }
    .form-text { display: block; margin-top: 5px; font-size: 0.78rem; color: #64748b; }
    
    /* Badges */
    .badge { display: inline-block; padding: 4px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: 600; text-align: center; }
    .badge-requested { background: #e0e7ff; color: #3730a3; }
    .badge-scheduled { background: #fef3c7; color: #92400e; }
    .badge-arrived { background: #dbeafe; color: #1e40af; }
    .badge-inprogress { background: #dbeafe; color: #1e40af; }
    .badge-completed { background: #d1fae5; color: #065f46; }
    .badge-draftreport, .badge-draft { background: #f3e8ff; color: #6b21a8; }
    .badge-preliminary { background: #fed7aa; color: #9a3412; }
    .badge-finalized { background: #d1fae5; color: #065f46; }
    .badge-cancelled { background: #f1f5f9; color: #64748b; }
    .badge-addendum { background: #ccfbf1; color: #115e59; }
    .badge-amended { background: #fef08a; color: #854d0e; }
    .badge-synced { background: #d1fae5; color: #065f46; }
    .badge-pendingsync { background: #e0e7ff; color: #3730a3; }
    .badge-failed { background: #fee2e2; color: #b91c1c; }
    .badge-default { background: #e2e8f0; color: #475569; }
  `;
  if (document.head) {
    document.head.appendChild(style);
  } else {
    document.addEventListener('DOMContentLoaded', () => document.head.appendChild(style));
  }
})();

// ============================================================================
// UI Component Factory
// ============================================================================
const UI = {
  /**
   * Badge component
   * @param {string} status
   * @returns {string} HTML string
   */
  badge(status) {
    if (!status) return '';
    const cls = typeof badgeClass === 'function' 
      ? badgeClass(status) 
      : `badge-${String(status).toLowerCase().replace(/\s+/g, '')}`;
    return `<span class="badge ${cls}">${status}</span>`;
  },

  /**
   * Data table with optional actions and custom cell renderers
   * @param {Object} config - { columns: [{key, label, width?, align?, render?}], data: [], onRowClick?, emptyMessage?, id? }
   * @returns {string} HTML string
   */
  table(config = {}) {
    const { columns = [], data = [], onRowClick = null, emptyMessage = 'No records found.' } = config;
    
    // If data is empty, return empty state inside table container
    if (!data || data.length === 0) {
      return `<div class="table-container">${UI.emptyState('📋', 'No Records Found', emptyMessage)}</div>`;
    }

    const headers = columns.map(col => {
      const widthStyle = col.width ? `width: ${col.width};` : '';
      const alignStyle = col.align ? `text-align: ${col.align};` : '';
      const styleAttr = (widthStyle || alignStyle) ? `style="${widthStyle} ${alignStyle}"` : '';
      return `<th ${styleAttr}>${col.label !== undefined ? col.label : col.key}</th>`;
    }).join('');

    const rows = data.map((row, idx) => {
      const isClickable = Boolean(onRowClick);
      const rowClass = isClickable ? 'clickable-row' : '';
      const dataId = row.id !== undefined ? `data-id="${row.id}"` : '';

      let clickAttr = '';
      if (isClickable) {
        if (typeof onRowClick === 'string') {
          if (onRowClick.includes('(')) {
            clickAttr = `onclick="${onRowClick.replace(/\{id\}/g, row.id).replace(/\$id/g, row.id)}"`;
          } else {
            clickAttr = `onclick="${onRowClick}('${row.id}', this)"`;
          }
        } else if (typeof onRowClick === 'function') {
          if (!window.__tableRowClickHandlers) window.__tableRowClickHandlers = {};
          const handlerKey = config.id || ('h_' + Math.random().toString(36).substr(2, 9));
          window.__tableRowClickHandlers[handlerKey] = onRowClick;
          clickAttr = `onclick="window.__tableRowClickHandlers['${handlerKey}']('${row.id}', this)"`;
        }
      }

      const cells = columns.map(col => {
        const val = row[col.key];
        let formattedVal = '';
        if (typeof col.render === 'function') {
          formattedVal = col.render(val, row, idx);
        } else if (typeof col.render === 'string' && typeof window[col.render] === 'function') {
          formattedVal = window[col.render](val, row, idx);
        } else {
          formattedVal = (val !== undefined && val !== null && val !== '') ? val : '—';
        }
        const widthStyle = col.width ? `width: ${col.width};` : '';
        const alignStyle = col.align ? `text-align: ${col.align};` : '';
        const styleAttr = (widthStyle || alignStyle) ? `style="${widthStyle} ${alignStyle}"` : '';
        return `<td ${styleAttr}>${formattedVal}</td>`;
      }).join('');

      return `<tr class="${rowClass}" ${dataId} ${clickAttr}>${cells}</tr>`;
    }).join('');

    return `<div class="table-container"><table class="data-table"><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table></div>`;
  },

  /**
   * Card wrapper
   * @param {string} title
   * @param {string} bodyHtml
   * @param {string} [headerActions]
   * @returns {string} HTML string
   */
  card(title, bodyHtml, headerActions = '') {
    return `<div class="card">
      <div class="card-header">
        <h3 class="card-title">${title}</h3>
        ${headerActions ? `<div class="btn-group">${headerActions}</div>` : ''}
      </div>
      <div class="card-body">${bodyHtml}</div>
    </div>`;
  },

  /**
   * Metric card
   * @param {string} label
   * @param {string|number} value
   * @param {string} [variant] - 'primary' | 'success' | 'warning' | 'danger'
   * @returns {string} HTML string
   */
  metric(label, value, variant = '') {
    return `<div class="metric-card ${variant ? 'metric-' + variant : ''}">
      <h3>${label}</h3>
      <p class="value">${value !== undefined && value !== null ? value : 0}</p>
    </div>`;
  },

  /**
   * Modal dialog component
   * @param {string} id
   * @param {string} title
   * @param {string} bodyHtml
   * @param {string} [footerHtml]
   * @param {string} [size] - 'modal-sm' | 'modal-lg' | 'modal-xl' | 'modal-full'
   * @returns {string} HTML string
   */
  modal(id, title, bodyHtml, footerHtml = '', size = '') {
    return `<div class="modal-overlay" id="modal-${id}" onclick="if(event.target === this) UI.closeModal('${id}')">
      <div class="modal ${size}">
        <div class="modal-header">
          <h3>${title}</h3>
          <button class="btn btn-ghost" onclick="UI.closeModal('${id}')" title="Close">&times;</button>
        </div>
        <div class="modal-body">${bodyHtml}</div>
        ${footerHtml ? `<div class="modal-footer">${footerHtml}</div>` : ''}
      </div>
    </div>`;
  },

  /**
   * Open modal by ID
   * @param {string} id
   */
  openModal(id) {
    const el = document.getElementById('modal-' + id) || document.getElementById(id);
    if (el) {
      el.classList.add('active');
      document.body.classList.add('modal-open');
    }
  },

  /**
   * Close modal by ID
   * @param {string} id
   */
  closeModal(id) {
    const el = document.getElementById('modal-' + id) || document.getElementById(id);
    if (el) {
      el.classList.remove('active');
      if (!document.querySelector('.modal-overlay.active')) {
        document.body.classList.remove('modal-open');
      }
    }
  },

  /**
   * Toast notification
   * @param {string} message
   * @param {string} [type] - 'info' | 'success' | 'warning' | 'error' | 'danger'
   */
  toast(message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    const el = document.createElement('div');
    const toastType = type === 'danger' ? 'error' : type;
    el.className = `toast toast-${toastType}`;
    el.textContent = message;
    container.appendChild(el);
    setTimeout(() => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(10px)';
      el.style.transition = 'all 0.3s ease';
      setTimeout(() => el.remove(), 350);
    }, 3500);
  },

  /**
   * Search bar with optional filter dropdowns
   * @param {string} placeholder
   * @param {Array} [filters] - [{ id, label, onChange?, options: [{value, text}] }]
   * @param {string} [onSearch] - callback function name
   * @returns {string} HTML string
   */
  searchBar(placeholder = 'Search...', filters = [], onSearch = '') {
    const searchInputCall = onSearch ? `oninput="${onSearch}(this.value)"` : '';
    let filtersHtml = '';
    if (filters && filters.length > 0) {
      filtersHtml = filters.map(f => {
        const changeCall = f.onChange ? `onchange="${f.onChange}(this.value)"` : (onSearch ? `onchange="${onSearch}()"` : '');
        const optionsHtml = (f.options || []).map(opt => {
          const val = opt.value !== undefined ? opt.value : '';
          const text = opt.text || opt.label || opt.value;
          const selected = opt.selected ? 'selected' : '';
          return `<option value="${val}" ${selected}>${text}</option>`;
        }).join('');
        return `
          <div class="filter-item">
            ${f.label ? `<label for="${f.id}" class="filter-label">${f.label}:</label>` : ''}
            <select id="${f.id}" class="filter-select" ${changeCall}>
              ${optionsHtml}
            </select>
          </div>
        `;
      }).join('');
    }
    return `
      <div class="search-bar-container">
        <div class="search-input-wrapper">
          <span class="search-icon">🔍</span>
          <input type="text" class="search-input" placeholder="${placeholder}" ${searchInputCall} />
        </div>
        ${filtersHtml ? `<div class="search-filters">${filtersHtml}</div>` : ''}
      </div>
    `;
  },

  /**
   * Tabs component
   * @param {Array} tabsConfig - [{ id, label, count? }]
   * @param {string} activeTab
   * @param {string} [onTabClick] - default 'switchTab'
   * @returns {string} HTML string
   */
  tabs(tabsConfig = [], activeTab = '', onTabClick = 'switchTab') {
    const active = activeTab || (tabsConfig[0] ? tabsConfig[0].id : '');
    return `
      <div class="tabs-container">
        <div class="tab-bar" role="tablist">
          ${tabsConfig.map(tab => {
            const isActive = tab.id === active;
            const countBadge = (tab.count !== undefined && tab.count !== null) ? `<span class="tab-count">${tab.count}</span>` : '';
            return `
              <button type="button" class="tab-item ${isActive ? 'active' : ''}" id="tab-btn-${tab.id}" data-tab="${tab.id}" onclick="${onTabClick}('${tab.id}', this)" role="tab" aria-selected="${isActive}">
                <span class="tab-label">${tab.label}</span>
                ${countBadge}
              </button>
            `;
          }).join('')}
        </div>
      </div>
    `;
  },

  /**
   * Timeline component
   * @param {Array} items - [{ time, title, description, type? }]
   * @returns {string} HTML string
   */
  timeline(items = []) {
    if (!items || items.length === 0) {
      return `<div class="timeline-empty" style="padding: 16px; color: #94a3b8; font-style: italic;">No timeline history recorded.</div>`;
    }
    return `
      <div class="timeline">
        ${items.map(item => `
          <div class="timeline-item ${item.type ? 'timeline-' + item.type : ''}">
            <div class="timeline-point"></div>
            <div class="timeline-content">
              <div class="timeline-header">
                <span class="timeline-title">${item.title || ''}</span>
                <span class="timeline-time">${item.time || ''}</span>
              </div>
              ${item.description ? `<div class="timeline-desc">${item.description}</div>` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  },

  /**
   * Confirmation modal dialog
   * @param {string} title
   * @param {string} message
   * @param {Function|string} onConfirm
   * @param {string} [confirmText]
   * @param {string} [cancelText]
   */
  confirm(title, message, onConfirm, confirmText = 'Confirm', cancelText = 'Cancel') {
    const modalId = 'confirm-dialog';
    let modalEl = document.getElementById('modal-' + modalId);
    if (!modalEl) {
      const div = document.createElement('div');
      div.innerHTML = UI.modal(
        modalId,
        title,
        `<p class="confirm-message" id="${modalId}-msg" style="margin: 8px 0; font-size: 0.95rem; color: #334155;">${message}</p>`,
        `
          <button class="btn btn-outline" onclick="UI.closeModal('${modalId}')">${cancelText}</button>
          <button class="btn btn-primary" id="${modalId}-btn">${confirmText}</button>
        `,
        'modal-sm'
      );
      document.body.appendChild(div.firstElementChild);
      modalEl = document.getElementById('modal-' + modalId);
    } else {
      const titleEl = modalEl.querySelector('.modal-header h3');
      if (titleEl) titleEl.textContent = title;
      const msgEl = document.getElementById(`${modalId}-msg`);
      if (msgEl) msgEl.textContent = message;
      const btn = document.getElementById(`${modalId}-btn`);
      if (btn) btn.textContent = confirmText;
    }
    
    const confirmBtn = document.getElementById(`${modalId}-btn`);
    if (confirmBtn) {
      confirmBtn.onclick = () => {
        UI.closeModal(modalId);
        if (typeof onConfirm === 'function') {
          onConfirm();
        } else if (typeof onConfirm === 'string') {
          try {
            if (typeof window[onConfirm] === 'function') {
              window[onConfirm]();
            } else {
              new Function(onConfirm)();
            }
          } catch(e) {
            console.error('[UI.confirm] Error executing callback:', e);
          }
        }
      };
    }
    UI.openModal(modalId);
  },

  /**
   * Empty state placeholder
   * @param {string} icon
   * @param {string} title
   * @param {string} description
   * @param {string} [actionHtml]
   * @returns {string} HTML string
   */
  emptyState(icon, title, description, actionHtml = '') {
    return `<div class="empty-state">
      <div class="empty-state-icon">${icon}</div>
      <h3>${title}</h3>
      <p>${description}</p>
      ${actionHtml ? `<div class="empty-state-actions">${actionHtml}</div>` : ''}
    </div>`;
  },

  /**
   * Error state banner
   * @param {string} title
   * @param {string} description
   * @param {string} [retryAction] - JS onclick code
   * @returns {string} HTML string
   */
  errorState(title, description, retryAction = '') {
    return `<div class="error-state">
      <h3>⚠️ ${title}</h3>
      <p>${description}</p>
      ${retryAction ? `<button class="btn btn-danger" onclick="${retryAction}">Retry</button>` : ''}
    </div>`;
  },

  /**
   * Form field component
   * @param {string} id
   * @param {string} label
   * @param {string} [type] - 'text' | 'number' | 'date' | 'time' | 'select' | 'textarea'
   * @param {Object} [options] - { required, placeholder, value, choices, rows, disabled, readonly, helpText }
   * @returns {string} HTML string
   */
  formField(id, label, type = 'text', options = {}) {
    const req = options.required ? 'required' : '';
    const reqMark = options.required ? '<span class="required-star">*</span>' : '';
    const disabled = options.disabled ? 'disabled' : '';
    const readonly = options.readonly ? 'readonly' : '';
    const placeholder = options.placeholder ? `placeholder="${options.placeholder}"` : '';
    const val = options.value !== undefined && options.value !== null ? options.value : '';
    
    let inputHtml = '';
    if (type === 'select') {
      const choices = options.choices || [];
      const optsHtml = choices.map(c => {
        const cVal = typeof c === 'object' ? c.value : c;
        const cLabel = typeof c === 'object' ? (c.label || c.text || c.value) : c;
        const selected = String(cVal) === String(val) ? 'selected' : '';
        return `<option value="${cVal}" ${selected}>${cLabel}</option>`;
      }).join('');
      inputHtml = `<select id="${id}" name="${id}" class="form-control" ${req} ${disabled}>${optsHtml}</select>`;
    } else if (type === 'textarea') {
      const rows = options.rows || 3;
      inputHtml = `<textarea id="${id}" name="${id}" class="form-control" rows="${rows}" ${placeholder} ${req} ${disabled} ${readonly}>${val}</textarea>`;
    } else {
      inputHtml = `<input type="${type}" id="${id}" name="${id}" class="form-control" value="${val}" ${placeholder} ${req} ${disabled} ${readonly} />`;
    }
    
    return `
      <div class="form-group" id="form-group-${id}">
        <label for="${id}">${label} ${reqMark}</label>
        ${inputHtml}
        ${options.helpText ? `<small class="form-text">${options.helpText}</small>` : ''}
      </div>
    `;
  },

  /**
   * Pagination component
   * @param {number} currentPage
   * @param {number} totalPages
   * @param {string} [onPageChange] - callback name
   * @returns {string} HTML string
   */
  pagination(currentPage = 1, totalPages = 1, onPageChange = 'changePage') {
    if (totalPages <= 1) return '';
    const prevDisabled = currentPage <= 1 ? 'disabled' : '';
    const nextDisabled = currentPage >= totalPages ? 'disabled' : '';
    
    let pagesHtml = '';
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
        const active = i === currentPage ? 'active' : '';
        pagesHtml += `<button type="button" class="btn-page ${active}" onclick="${onPageChange}(${i})">${i}</button>`;
      } else if (i === currentPage - 2 || i === currentPage + 2) {
        pagesHtml += `<span class="pagination-ellipsis">…</span>`;
      }
    }
    
    return `
      <div class="pagination-container">
        <button type="button" class="btn btn-sm btn-outline" ${prevDisabled} onclick="${onPageChange}(${currentPage - 1})">&laquo; Prev</button>
        <div class="pagination-pages">${pagesHtml}</div>
        <button type="button" class="btn btn-sm btn-outline" ${nextDisabled} onclick="${onPageChange}(${currentPage + 1})">Next &raquo;</button>
        <span class="pagination-info">Page ${currentPage} of ${totalPages}</span>
      </div>
    `;
  },

  /**
   * Detail row key-value display
   * @param {string} label
   * @param {string|number} value
   * @returns {string} HTML string
   */
  detailRow(label, value) {
    const valText = (value !== undefined && value !== null && value !== '') ? value : '—';
    return `<div class="detail-row"><span class="detail-label">${label}</span><span class="detail-value">${valText}</span></div>`;
  },

  /**
   * Breadcrumbs navigation
   * @param {Array} items - [{ label, onClick? }]
   * @returns {string} HTML string
   */
  breadcrumbs(items = []) {
    return `<div class="breadcrumbs">${items.map((item, i) => 
      i < items.length - 1 
        ? `<a href="#" onclick="${item.onClick ? item.onClick + ';' : ''} return false;">${item.label}</a><span class="separator">/</span>` 
        : `<span class="current">${item.label}</span>`
    ).join('')}</div>`;
  }
};

// Global scope export
if (typeof window !== 'undefined') {
  window.UI = UI;
}
