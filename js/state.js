/**
 * HealthSys RIS Mockup - State Management & Event Bus
 * File: js/state.js
 */

// ============================================================================
// 1. EventBus (Pub/Sub)
// ============================================================================
const EventBus = {
  _listeners: {},

  /**
   * Subscribe to an event
   * @param {string} event - Event name
   * @param {Function} callback - Callback function
   */
  on(event, callback) {
    if (!this._listeners[event]) {
      this._listeners[event] = [];
    }
    this._listeners[event].push(callback);
  },

  /**
   * Unsubscribe from an event
   * @param {string} event - Event name
   * @param {Function} callback - Callback function to remove
   */
  off(event, callback) {
    if (!this._listeners[event]) return;
    this._listeners[event] = this._listeners[event].filter(cb => cb !== callback);
  },

  /**
   * Publish an event with data
   * @param {string} event - Event name
   * @param {*} data - Payload passed to subscribers
   */
  emit(event, data) {
    if (this._listeners[event]) {
      this._listeners[event].forEach(cb => {
        try {
          cb(data);
        } catch (err) {
          console.error(`[EventBus] Error in listener for "${event}":`, err);
        }
      });
    }
  }
};

// ============================================================================
// 2. AppState (State Management)
// ============================================================================
const AppState = {
  _data: {},
  _listeners: {},

  /**
   * Initialize state from localStorage or load default mock data
   */
  init() {
    const saved = localStorage.getItem('ris_mockup_state');
    if (saved) {
      try {
        this._data = JSON.parse(saved);
      } catch (e) {
        console.warn('[AppState] Failed to parse saved state, resetting to initial mock data.', e);
        this.reset();
      }
    } else {
      this.reset();
    }
  },

  /**
   * Reset state to pristine mock data copy
   */
  reset() {
    const md = (typeof MOCK_DATA !== 'undefined') ? MOCK_DATA : {};
    this._data = {
      patients: md.patients ? JSON.parse(JSON.stringify(md.patients)) : [],
      encounters: md.encounters ? JSON.parse(JSON.stringify(md.encounters)) : [],
      orders: md.orders ? JSON.parse(JSON.stringify(md.orders)) : [],
      appointments: md.appointments ? JSON.parse(JSON.stringify(md.appointments)) : [],
      studies: md.studies ? JSON.parse(JSON.stringify(md.studies)) : [],
      reports: md.reports ? JSON.parse(JSON.stringify(md.reports)) : [],
      dispatch: md.dispatch ? JSON.parse(JSON.stringify(md.dispatch)) : [],
      outboundMessages: md.outboundMessages ? JSON.parse(JSON.stringify(md.outboundMessages)) : [],
      statusHistory: md.statusHistory ? JSON.parse(JSON.stringify(md.statusHistory)) : [],
      activityLog: [],
      currentView: 'dashboard',
      selectedPatientId: null,
      selectedOrderId: null,
      selectedStudyId: null,
      viewerOpen: false,
    };
    this._save();
    EventBus.emit('stateReset', this._data);
    EventBus.emit('stateChange', { key: '*' });
  },

  /**
   * Get a top-level state value
   * @param {string} key
   */
  get(key) {
    return this._data[key];
  },

  /**
   * Set a top-level state value and emit change events
   * @param {string} key
   * @param {*} value
   */
  set(key, value) {
    this._data[key] = value;
    this._save();
    EventBus.emit('stateChange', { key, value });
    EventBus.emit(`stateChange:${key}`, value);
  },

  /**
   * Retrieve an item by ID from a collection
   * @param {string} collection
   * @param {string} id
   */
  getById(collection, id) {
    return this._data[collection]?.find(item => item.id === id);
  },

  /**
   * Update an item by ID in a collection
   * @param {string} collection
   * @param {string} id
   * @param {Object} updates
   */
  updateById(collection, id, updates) {
    const items = this._data[collection];
    const idx = items?.findIndex(item => item.id === id);
    if (idx >= 0) {
      items[idx] = { ...items[idx], ...updates };
      this._save();
      EventBus.emit('stateChange', { key: collection });
      EventBus.emit(`itemUpdated:${collection}`, items[idx]);
      return items[idx];
    }
    return null;
  },

  /**
   * Add a new item to a collection
   * @param {string} collection
   * @param {Object} item
   */
  addTo(collection, item) {
    if (!this._data[collection]) this._data[collection] = [];
    this._data[collection].push(item);
    this._save();
    EventBus.emit('stateChange', { key: collection });
    EventBus.emit(`itemAdded:${collection}`, item);
  },

  /**
   * Log an activity entry (capped at 100 entries)
   * @param {string} message
   * @param {string} type - 'info' | 'status' | 'error' | 'sync'
   */
  log(message, type = 'info') {
    const entry = {
      timestamp: new Date().toISOString(),
      message,
      type
    };
    if (!this._data.activityLog) this._data.activityLog = [];
    this._data.activityLog.unshift(entry);
    if (this._data.activityLog.length > 100) {
      this._data.activityLog.length = 100;
    }
    this._save();
    EventBus.emit('newLog', entry);
  },

  /**
   * Internal persistence to localStorage
   */
  _save() {
    try {
      localStorage.setItem('ris_mockup_state', JSON.stringify(this._data));
    } catch (e) {
      console.warn('[AppState] State save failed:', e);
    }
  }
};

// ============================================================================
// 3. Helper Functions
// ============================================================================

/**
 * Returns patient name by id
 * @param {string} id
 * @returns {string}
 */
function getPatientName(id) {
  const patient = AppState.getById('patients', id);
  if (!patient) return 'Unknown Patient';
  if (patient.name) return patient.name;
  if (patient.fullName) return patient.fullName;
  if (patient.lastName && patient.firstName) return `${patient.lastName}, ${patient.firstName}`;
  return id || 'Unknown';
}

/**
 * Returns filtered orders for a given patient ID
 * @param {string} patientId
 * @returns {Array}
 */
function getOrdersByPatient(patientId) {
  const orders = AppState.get('orders') || [];
  return orders.filter(order => order.patientId === patientId);
}

/**
 * Returns filtered orders by status (string or array of strings)
 * @param {string|string[]} status
 * @returns {Array}
 */
function getOrdersByStatus(status) {
  const orders = AppState.get('orders') || [];
  if (Array.isArray(status)) {
    return orders.filter(order => status.includes(order.status));
  }
  return orders.filter(order => order.status === status);
}

/**
 * Returns study linked to order
 * @param {string} orderId
 * @returns {Object|null}
 */
function getStudyByOrder(orderId) {
  const studies = AppState.get('studies') || [];
  const order = AppState.getById('orders', orderId);
  return studies.find(s => 
    s.orderId === orderId || 
    (order && s.accessionNumber === order.accession) ||
    (order && s.studyInstanceUid === order.studyInstanceUid)
  ) || null;
}

/**
 * Returns report linked to order
 * @param {string} orderId
 * @returns {Object|null}
 */
function getReportByOrder(orderId) {
  const reports = AppState.get('reports') || [];
  const direct = reports.find(r => r.orderId === orderId);
  if (direct) return direct;
  const study = getStudyByOrder(orderId);
  if (study) {
    return reports.find(r => r.studyId === study.id) || null;
  }
  return null;
}

/**
 * Format ISO string to 'Jan 15, 2024'
 * @param {string} isoString
 * @returns {string}
 */
function formatDate(isoString) {
  if (!isoString) return '—';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch (e) {
    return isoString;
  }
}

/**
 * Format ISO string to 'Jan 15, 2024 2:30 PM'
 * @param {string} isoString
 * @returns {string}
 */
function formatDateTime(isoString) {
  if (!isoString) return '—';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;
    const d = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const t = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    return `${d} ${t}`;
  } catch (e) {
    return isoString;
  }
}

/**
 * Format time string to '9:30 AM'
 * @param {string} timeString
 * @returns {string}
 */
function formatTime(timeString) {
  if (!timeString) return '—';
  try {
    // If ISO date string
    if (typeof timeString === 'string' && (timeString.includes('T') || timeString.includes('-'))) {
      const date = new Date(timeString);
      if (!isNaN(date.getTime())) {
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
      }
    }
    // If 'HH:mm' or 'HH:mm:ss'
    if (typeof timeString === 'string' && /^\d{1,2}:\d{2}/.test(timeString)) {
      const parts = timeString.split(':');
      let h = parseInt(parts[0], 10);
      const m = parts[1].substring(0, 2);
      const ampm = h >= 12 ? 'PM' : 'AM';
      h = h % 12 || 12;
      return `${h}:${m} ${ampm}`;
    }
    const date = new Date(timeString);
    if (!isNaN(date.getTime())) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    }
    return timeString;
  } catch (e) {
    return timeString;
  }
}

/**
 * Returns prefix + random 4 digit number
 * @param {string} prefix
 * @returns {string}
 */
function generateId(prefix = '') {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}${num}`;
}

/**
 * Returns CSS class for a status string (lowercased, spaces removed, prepended with 'badge-')
 * @param {string} status
 * @returns {string}
 */
function badgeClass(status) {
  if (!status) return 'badge-default';
  const clean = String(status).toLowerCase().replace(/\s+/g, '');
  return `badge-${clean}`;
}

// ============================================================================
// 4. Status Transition Validators & Workflow Actions
// ============================================================================
const VALID_TRANSITIONS = {
  'Requested': ['Scheduled', 'Cancelled'],
  'Scheduled': ['Arrived', 'Cancelled', 'Requested'],
  'Arrived': ['In Progress', 'Cancelled'],
  'In Progress': ['Completed'],
  'Completed': ['Draft Report'],
  'Draft Report': ['Preliminary', 'Draft Report'],
  'Preliminary': ['Finalized'],
  'Finalized': ['Addendum', 'Amended'],
  'Addendum': ['Finalized'],
  'Amended': ['Finalized']
};

/**
 * Check whether an order can transition from currentStatus to newStatus
 * @param {string} currentStatus
 * @param {string} newStatus
 * @returns {boolean}
 */
function canTransition(currentStatus, newStatus) {
  return VALID_TRANSITIONS[currentStatus]?.includes(newStatus) || false;
}

/**
 * Safely transition an order to a new status with audit trail logging
 * @param {string} orderId
 * @param {string} newStatus
 * @param {string} [reason]
 * @returns {{success: boolean, order?: Object, error?: string}}
 */
function transitionOrder(orderId, newStatus, reason) {
  const order = AppState.getById('orders', orderId);
  if (!order) return { success: false, error: 'Order not found' };
  if (!canTransition(order.status, newStatus)) {
    return { success: false, error: `Cannot transition from ${order.status} to ${newStatus}` };
  }
  const oldStatus = order.status;
  AppState.updateById('orders', orderId, { status: newStatus });
  AppState.addTo('statusHistory', {
    id: generateId('SH'),
    entityType: 'Order',
    entityId: orderId,
    fromStatus: oldStatus,
    toStatus: newStatus,
    changedBy: 'User',
    changedAt: new Date().toISOString(),
    reason: reason || ''
  });
  AppState.log(`Order ${order.accession || orderId}: ${oldStatus} → ${newStatus}`, 'status');
  return { success: true, order: AppState.getById('orders', orderId) };
}

// ============================================================================
// 5. Global Scope Bindings & Auto-Initialization
// ============================================================================
if (typeof window !== 'undefined') {
  window.EventBus = EventBus;
  window.AppState = AppState;
  window.VALID_TRANSITIONS = VALID_TRANSITIONS;
  window.canTransition = canTransition;
  window.transitionOrder = transitionOrder;
  window.getPatientName = getPatientName;
  window.getOrdersByPatient = getOrdersByPatient;
  window.getOrdersByStatus = getOrdersByStatus;
  window.getStudyByOrder = getStudyByOrder;
  window.getReportByOrder = getReportByOrder;
  window.formatDate = formatDate;
  window.formatDateTime = formatDateTime;
  window.formatTime = formatTime;
  window.generateId = generateId;
  window.badgeClass = badgeClass;
}

// Initialize state
if (typeof MOCK_DATA !== 'undefined') {
  AppState.init();
} else if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    AppState.init();
  });
}
