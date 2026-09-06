/* ================================================================
   RIS Mockup – Main Application (app.js)
   Single-Page Application Router & All Page Views
   ================================================================ */

// ─── Router ────────────────────────────────────────────────────
const Router = {
  current: null,
  params: {},

  navigate(view, params = {}) {
    this.current = view;
    this.params = params;
    this.render();
  },

  render() {
    const container = document.getElementById('view-container');
    const titleEl = document.getElementById('page-title');
    const breadcrumbEl = document.getElementById('breadcrumb-area');

    // Update sidebar active
    document.querySelectorAll('.sidebar-nav a').forEach(a => a.classList.remove('active'));
    const navId = document.getElementById('nav-' + this.current);
    if (navId) navId.classList.add('active');

    // Look up page
    const page = Pages[this.current];
    if (!page) {
      container.innerHTML = UI.errorState('Page Not Found', `View "${this.current}" does not exist.`);
      return;
    }

    titleEl.textContent = page.title || this.current;
    if (breadcrumbEl) breadcrumbEl.innerHTML = page.breadcrumbs ? UI.breadcrumbs(page.breadcrumbs()) : '';
    container.innerHTML = page.render(this.params);
    if (page.afterRender) page.afterRender(this.params);

    AppState.set('currentView', this.current);
    container.scrollTop = 0;
    updateDevPanel();
  }
};

function navigate(view, params) { Router.navigate(view, params); }

// ─── Page Registry ─────────────────────────────────────────────
const Pages = {};

// ─── Dashboard ─────────────────────────────────────────────────
Pages.dashboard = {
  title: 'Dashboard',
  render() {
    const orders = AppState.get('orders') || [];
    const dispatch = AppState.get('dispatch') || [];
    const messages = AppState.get('outboundMessages') || [];
    const requested = orders.filter(o => o.status === 'Requested').length;
    const scheduled = orders.filter(o => ['Scheduled', 'Arrived'].includes(o.status)).length;
    const inProgress = orders.filter(o => o.status === 'In Progress').length;
    const awaitingRead = orders.filter(o => ['Completed', 'Draft Report'].includes(o.status)).length;
    const finalized = orders.filter(o => ['Finalized', 'Validated'].includes(o.status)).length;
    const failedMsgs = messages.filter(m => m.status === 'Failed').length;

    const recentLogs = (AppState.get('activityLog') || []).slice(0, 8);

    return `
      <div class="grid-4 mb-3">
        ${UI.metric('Pending Orders', requested, 'warning')}
        ${UI.metric('Scheduled / Arrived', scheduled)}
        ${UI.metric('In Progress', inProgress)}
        ${UI.metric('Awaiting Reading', awaitingRead, awaitingRead > 0 ? 'warning' : '')}
      </div>
      <div class="grid-4 mb-3">
        ${UI.metric('Finalized Today', finalized, 'success')}
        ${UI.metric('Total Orders', orders.length)}
        ${UI.metric('Interop Records', dispatch.length)}
        ${UI.metric('Failed Messages', failedMsgs, failedMsgs > 0 ? 'danger' : 'success')}
      </div>
      ${UI.card('Recent Activity', `
        <div class="timeline" id="dashboard-timeline">
          ${recentLogs.length === 0 ? '<p class="text-muted">No recent activity. Run a demo scenario to get started.</p>' : 
            recentLogs.map(l => `
              <div class="timeline-item">
                <div class="timeline-time">${formatDateTime(l.timestamp)}</div>
                <div class="timeline-title">${l.message}</div>
              </div>
            `).join('')}
        </div>
      `)}
      <div class="grid-2">
        ${UI.card('Quick Actions', `
          <div class="btn-group" style="flex-wrap:wrap;">
            <button class="btn btn-primary" onclick="navigate('orders', {action:'create'})">+ New Order</button>
            <button class="btn btn-outline" onclick="navigate('tech-worklist')">Tech Worklist</button>
            <button class="btn btn-outline" onclick="navigate('rad-worklist')">Rad Worklist</button>
            <button class="btn btn-outline" onclick="navigate('dispatch')">Dispatch Hub</button>
            <button class="btn btn-outline" onclick="navigate('flow-viz')">System Flow</button>
          </div>
        `)}
        ${UI.card('System Health', `
          <div>${UI.detailRow('PACS Connection', '<span class="badge badge-completed">Online</span>')}</div>
          <div>${UI.detailRow('HL7 Interface', '<span class="badge badge-completed">Active</span>')}</div>
          <div>${UI.detailRow('MWL SCP', '<span class="badge badge-completed">Listening</span>')}</div>
          <div>${UI.detailRow('Outbox Worker', '<span class="badge badge-completed">Running</span>')}</div>
        `)}
      </div>
    `;
  }
};

// ─── Patients ──────────────────────────────────────────────────
Pages.patients = {
  title: 'Patient Registry',
  render() {
    const patients = AppState.get('patients') || [];
    return `
      ${UI.searchBar('Search patients by name, MRN...', [
        { id: 'sex-filter', label: 'Sex', options: [{value:'',text:'All'},{value:'M',text:'Male'},{value:'F',text:'Female'}] }
      ])}
      ${UI.card('Registered Patients', 
        UI.table({
          columns: [
            { key: 'mrn', label: 'MRN' },
            { key: 'name', label: 'Patient Name', render: (v) => `<strong>${v}</strong>` },
            { key: 'dob', label: 'DOB' },
            { key: 'sex', label: 'Sex' },
            { key: 'insurance', label: 'Insurance' },
            { key: 'status', label: 'Status', render: (v) => UI.badge(v) },
            { key: '_actions', label: 'Actions', render: (_, row) => `<button class="btn btn-sm btn-outline" onclick="navigate('patient-detail', {id:'${row.id}'})">View</button>` }
          ],
          data: patients,
          emptyMessage: 'No patients registered.'
        }),
        `<button class="btn btn-primary" onclick="UI.openModal('add-patient')">+ Register Patient (ADT)</button>`
      )}
      ${UI.modal('add-patient', 'Register New Patient', `
        <div class="form-row">
          ${UI.formField('pt-mrn', 'MRN', 'text', { placeholder: 'Auto-generated' })}
          ${UI.formField('pt-name', 'Full Name', 'text', { required: true, placeholder: 'Last, First' })}
        </div>
        <div class="form-row">
          ${UI.formField('pt-dob', 'Date of Birth', 'date', { required: true })}
          ${UI.formField('pt-sex', 'Sex', 'select', { choices: [{value:'M',text:'Male'},{value:'F',text:'Female'},{value:'O',text:'Other'}] })}
        </div>
        <div class="form-row">
          ${UI.formField('pt-phone', 'Phone', 'text', { placeholder: '555-0100' })}
          ${UI.formField('pt-insurance', 'Insurance', 'text', { placeholder: 'Plan name' })}
        </div>
        ${UI.formField('pt-allergies', 'Allergies', 'text', { placeholder: 'None known' })}
      `, `
        <button class="btn btn-outline" onclick="UI.closeModal('add-patient')">Cancel</button>
        <button class="btn btn-primary" onclick="Actions.addPatient()">Register Patient</button>
      `)}
    `;
  }
};

// ─── Patient Detail ────────────────────────────────────────────
Pages['patient-detail'] = {
  title: 'Patient Detail',
  breadcrumbs() { return [{ label: 'Patients', onClick: "navigate('patients')" }, { label: 'Detail' }]; },
  render(params) {
    const patient = AppState.getById('patients', params.id);
    if (!patient) return UI.errorState('Patient Not Found', 'The requested patient does not exist.');
    const encounters = (AppState.get('encounters') || []).filter(e => e.patientId === patient.id);
    const orders = getOrdersByPatient(patient.id);
    const history = (AppState.get('statusHistory') || []).filter(h => orders.some(o => o.id === h.entityId));

    return `
      <div class="grid-3">
        <div style="grid-column: span 2;">
          ${UI.card('Demographics', `
            <div class="grid-2">
              <div>
                ${UI.detailRow('MRN', patient.mrn)}
                ${UI.detailRow('Name', `<strong>${patient.name}</strong>`)}
                ${UI.detailRow('Date of Birth', patient.dob)}
                ${UI.detailRow('Sex', patient.sex)}
              </div>
              <div>
                ${UI.detailRow('Phone', patient.phone || 'N/A')}
                ${UI.detailRow('Address', patient.address || 'N/A')}
                ${UI.detailRow('Insurance', patient.insurance || 'N/A')}
                ${UI.detailRow('Allergies', patient.allergies || 'None known')}
              </div>
            </div>
          `)}
          ${UI.card('Orders (' + orders.length + ')',
            UI.table({
              columns: [
                { key: 'accession', label: 'Accession' },
                { key: 'procedure', label: 'Procedure' },
                { key: 'modality', label: 'Mod.' },
                { key: 'urgency', label: 'Urgency', render: v => UI.badge(v) },
                { key: 'status', label: 'Status', render: v => UI.badge(v) },
                { key: '_actions', label: '', render: (_, row) => `<button class="btn btn-sm btn-outline" onclick="navigate('order-detail', {id:'${row.id}'})">View</button>` }
              ],
              data: orders,
              emptyMessage: 'No orders for this patient.'
            }),
            `<button class="btn btn-sm btn-primary" onclick="navigate('orders', {action:'create', patientId:'${patient.id}'})">+ New Order</button>`
          )}
        </div>
        <div>
          ${UI.card('Encounters', encounters.map(e => `
            <div style="padding:8px 0; border-bottom:1px solid #f1f5f9;">
              <strong>${e.id}</strong> - ${e.type}<br>
              <span class="text-muted text-sm">${e.admitDate} · ${e.department}</span><br>
              <span class="text-sm">${e.attendingPhysician}</span>
            </div>
          `).join('') || '<p class="text-muted">No encounters.</p>')}
          ${UI.card('Status History', `
            <div class="timeline">
              ${history.slice(0, 10).map(h => `
                <div class="timeline-item">
                  <div class="timeline-time">${formatDateTime(h.changedAt)}</div>
                  <div class="timeline-title">${h.fromStatus} → ${h.toStatus}</div>
                  <div class="timeline-desc">${h.reason || ''} (${h.changedBy})</div>
                </div>
              `).join('') || '<p class="text-muted">No history.</p>'}
            </div>
          `)}
        </div>
      </div>
    `;
  }
};

// ─── Orders ────────────────────────────────────────────────────
Pages.orders = {
  title: 'Radiology Orders',
  render(params) {
    const orders = AppState.get('orders') || [];
    const statusFilter = params.statusFilter || '';

    const filtered = statusFilter ? orders.filter(o => o.status === statusFilter) : orders;

    const statuses = ['All', 'Requested', 'Scheduled', 'Arrived', 'In Progress', 'Completed', 'Draft Report', 'Preliminary', 'Finalized', 'Cancelled'];

    return `
      <div class="tabs mb-2">
        ${statuses.map(s => `<div class="tab ${(s === 'All' && !statusFilter) || s === statusFilter ? 'active' : ''}" onclick="navigate('orders', {statusFilter: '${s === 'All' ? '' : s}'})"> ${s} ${s !== 'All' ? '<small>(' + orders.filter(o => o.status === s).length + ')</small>' : ''}</div>`).join('')}
      </div>
      ${UI.card('Orders', 
        UI.table({
          columns: [
            { key: 'accession', label: 'Accession #' },
            { key: 'patientId', label: 'Patient', render: v => getPatientName(v) },
            { key: 'procedure', label: 'Procedure' },
            { key: 'modality', label: 'Mod.' },
            { key: 'urgency', label: 'Urgency', render: v => UI.badge(v) },
            { key: 'orderingPhysician', label: 'Ordering MD' },
            { key: 'scheduledDate', label: 'Sched. Date' },
            { key: 'status', label: 'Status', render: v => UI.badge(v) },
            { key: '_actions', label: '', render: (_, row) => `<button class="btn btn-sm btn-outline" onclick="navigate('order-detail', {id:'${row.id}'})">Detail</button>` }
          ],
          data: filtered,
          emptyMessage: 'No orders match the current filter.'
        }),
        `<button class="btn btn-primary" onclick="UI.openModal('create-order')">+ Place Order (HL7 ORM)</button>`
      )}
      ${renderCreateOrderModal(params)}
    `;
  }
};

function renderCreateOrderModal(params) {
  const patients = AppState.get('patients') || [];
  const procedures = (typeof MOCK_DATA !== 'undefined' && MOCK_DATA.procedures) || [];
  return UI.modal('create-order', 'Place Radiology Order', `
    <div class="form-row">
      ${UI.formField('ord-patient', 'Patient', 'select', { required: true, choices: patients.map(p => ({value: p.id, text: `${p.mrn} - ${p.name}`})) })}
      ${UI.formField('ord-urgency', 'Urgency', 'select', { choices: [{value:'Routine',text:'Routine'},{value:'Urgent',text:'Urgent'},{value:'STAT',text:'STAT'}] })}
    </div>
    <div class="form-row">
      ${UI.formField('ord-procedure', 'Procedure', 'select', { required: true, choices: procedures.map(p => ({value: p.code, text: `${p.name} (${p.modality})`})) })}
      ${UI.formField('ord-physician', 'Ordering Physician', 'text', { value: 'Dr. Sarah Mitchell' })}
    </div>
    ${UI.formField('ord-indication', 'Clinical Indication', 'textarea', { required: true, placeholder: 'Describe clinical reason for exam...', rows: 3 })}
  `, `
    <button class="btn btn-outline" onclick="UI.closeModal('create-order')">Cancel</button>
    <button class="btn btn-primary" onclick="Actions.createOrder()">Submit Order</button>
  `);
}

// ─── Order Detail ──────────────────────────────────────────────
Pages['order-detail'] = {
  title: 'Order Detail',
  breadcrumbs() { return [{ label: 'Orders', onClick: "navigate('orders')" }, { label: 'Detail' }]; },
  render(params) {
    const order = AppState.getById('orders', params.id);
    if (!order) return UI.errorState('Order Not Found', 'The requested order does not exist.');
    const patient = AppState.getById('patients', order.patientId);
    const study = getStudyByOrder(order.id);
    const report = getReportByOrder(order.id);
    const history = (AppState.get('statusHistory') || []).filter(h => h.entityId === order.id);
    const nextStatuses = (typeof VALID_TRANSITIONS !== 'undefined' && VALID_TRANSITIONS[order.status]) || [];

    return `
      <div class="grid-3">
        <div style="grid-column: span 2;">
          ${UI.card('Order Information', `
            <div class="grid-2">
              <div>
                ${UI.detailRow('Accession #', `<strong>${order.accession}</strong>`)}
                ${UI.detailRow('Status', UI.badge(order.status))}
                ${UI.detailRow('Urgency', UI.badge(order.urgency))}
                ${UI.detailRow('Procedure', order.procedure)}
                ${UI.detailRow('Modality', order.modality)}
                ${UI.detailRow('Body Part', order.bodyPart || 'N/A')}
              </div>
              <div>
                ${UI.detailRow('Patient', patient ? `<a href="#" onclick="navigate('patient-detail',{id:'${patient.id}'});return false;">${patient.name}</a> (${patient.mrn})` : 'N/A')}
                ${UI.detailRow('Ordering MD', order.orderingPhysician || 'N/A')}
                ${UI.detailRow('Scheduled', order.scheduledDate ? `${order.scheduledDate} ${order.scheduledTime || ''}` : 'Not scheduled')}
                ${UI.detailRow('Clinical Indication', order.clinicalIndication || 'N/A')}
                ${UI.detailRow('Created', formatDateTime(order.createdAt))}
              </div>
            </div>
          `, nextStatuses.length > 0 ? `
            <div class="btn-group">
              ${nextStatuses.map(s => `<button class="btn btn-sm ${s === 'Cancelled' ? 'btn-danger' : 'btn-primary'}" onclick="Actions.transitionOrder('${order.id}', '${s}')">${s === 'Cancelled' ? 'Cancel' : 'Move to ' + s}</button>`).join('')}
            </div>
          ` : '')}
          ${study ? UI.card('Linked Study', `
            ${UI.detailRow('Study UID', `<span class="text-sm">${study.studyInstanceUid}</span>`)}
            ${UI.detailRow('Date', study.studyDate)}
            ${UI.detailRow('Description', study.studyDescription)}
            ${UI.detailRow('Series / Images', `${study.seriesCount} series · ${study.imageCount} images`)}
            ${UI.detailRow('Status', UI.badge(study.status))}
          `, `<button class="btn btn-sm btn-primary" onclick="Actions.openViewer('${order.id}')">Open PACS Viewer</button>`) : ''}
          ${report ? UI.card('Report', `
            ${UI.detailRow('Status', UI.badge(report.status))}
            ${UI.detailRow('Radiologist', getStaffName(report.radiologistId))}
            ${report.findings ? `<div class="mt-2"><strong>Findings:</strong><p class="text-sm">${report.findings}</p></div>` : ''}
            ${report.impression ? `<div class="mt-2"><strong>Impression:</strong><p class="text-sm" style="white-space:pre-line">${report.impression}</p></div>` : ''}
            ${report.signedAt ? UI.detailRow('Signed At', formatDateTime(report.signedAt)) : ''}
          `) : ''}
        </div>
        <div>
          ${UI.card('Status History', `
            <div class="timeline">
              ${history.length > 0 ? history.sort((a,b) => b.changedAt.localeCompare(a.changedAt)).map(h => `
                <div class="timeline-item">
                  <div class="timeline-time">${formatDateTime(h.changedAt)}</div>
                  <div class="timeline-title">${h.fromStatus} → ${h.toStatus}</div>
                  <div class="timeline-desc">${h.reason || ''}</div>
                </div>
              `).join('') : '<p class="text-muted">No status changes recorded.</p>'}
            </div>
          `)}
          ${UI.card('Actions', `
            <div style="display:flex;flex-direction:column;gap:8px;">
              ${order.status === 'Completed' || order.status === 'Draft Report' ? `<button class="btn btn-primary w-full" onclick="Actions.openViewer('${order.id}')">📺 Open PACS Viewer</button>` : ''}
              ${order.status === 'Scheduled' ? `<button class="btn btn-outline w-full" onclick="Actions.transitionOrder('${order.id}', 'Arrived')">✅ Mark Patient Arrived</button>` : ''}
              ${order.status === 'Arrived' ? `<button class="btn btn-primary w-full" onclick="Actions.transitionOrder('${order.id}', 'In Progress')">▶️ Start Procedure (MPPS)</button>` : ''}
              ${order.status === 'In Progress' ? `<button class="btn btn-success w-full" onclick="Actions.completeExam('${order.id}')">✔️ Complete Exam (C-STORE)</button>` : ''}
            </div>
          `)}
        </div>
      </div>
    `;
  }
};

// ─── Scheduling ────────────────────────────────────────────────
Pages.scheduling = {
  title: 'Scheduling Center',
  render() {
    const appointments = AppState.get('appointments') || [];
    const orders = AppState.get('orders') || [];
    const unscheduled = orders.filter(o => o.status === 'Requested');

    return `
      <div class="grid-3 mb-3">
        ${UI.metric('Today\'s Appointments', appointments.length)}
        ${UI.metric('Unscheduled Orders', unscheduled.length, unscheduled.length > 0 ? 'warning' : '')}
        ${UI.metric('Available Slots', '14')}
      </div>
      ${unscheduled.length > 0 ? UI.card('Unscheduled Orders (Pending Scheduling)', 
        UI.table({
          columns: [
            { key: 'accession', label: 'Accession' },
            { key: 'patientId', label: 'Patient', render: v => getPatientName(v) },
            { key: 'procedure', label: 'Procedure' },
            { key: 'urgency', label: 'Urgency', render: v => UI.badge(v) },
            { key: '_actions', label: '', render: (_, row) => `<button class="btn btn-sm btn-primary" onclick="Actions.scheduleOrder('${row.id}')">Schedule</button>` }
          ],
          data: unscheduled
        })
      ) : ''}
      ${UI.card('Appointment Schedule',
        UI.table({
          columns: [
            { key: 'id', label: 'Appt ID' },
            { key: 'patientId', label: 'Patient', render: v => getPatientName(v) },
            { key: 'date', label: 'Date' },
            { key: 'startTime', label: 'Time', render: (v, row) => `${v} - ${row.endTime}` },
            { key: 'roomId', label: 'Room', render: v => getRoomName(v) },
            { key: 'status', label: 'Status', render: v => UI.badge(v) }
          ],
          data: appointments,
          emptyMessage: 'No appointments scheduled.'
        })
      )}
    `;
  }
};

// ─── Technologist Worklist (MWL) ───────────────────────────────
Pages['tech-worklist'] = {
  title: 'Technologist Worklist (MWL)',
  render() {
    const orders = AppState.get('orders') || [];
    const techOrders = orders.filter(o => ['Scheduled', 'Arrived', 'In Progress'].includes(o.status));

    return `
      <div class="grid-3 mb-3">
        ${UI.metric('Scheduled', orders.filter(o => o.status === 'Scheduled').length)}
        ${UI.metric('Arrived (Ready)', orders.filter(o => o.status === 'Arrived').length, 'warning')}
        ${UI.metric('In Progress', orders.filter(o => o.status === 'In Progress').length)}
      </div>
      ${UI.card('Modality Worklist — DICOM C-FIND Response Simulator',
        `<p class="text-muted text-sm mb-2">This simulates the MWL SCP responses to modality C-FIND queries and MPPS state tracking.</p>` +
        UI.table({
          columns: [
            { key: 'accession', label: 'Accession' },
            { key: 'patientId', label: 'Patient', render: v => getPatientName(v) },
            { key: 'procedure', label: 'Procedure' },
            { key: 'modality', label: 'Mod.' },
            { key: 'urgency', label: 'Urgency', render: v => UI.badge(v) },
            { key: 'scheduledTime', label: 'Time' },
            { key: 'status', label: 'Status', render: v => UI.badge(v) },
            { key: '_actions', label: 'Actions', render: (_, row) => {
              if (row.status === 'Scheduled') return `<button class="btn btn-sm btn-outline" onclick="Actions.transitionOrder('${row.id}', 'Arrived')">Check-in Patient</button>`;
              if (row.status === 'Arrived') return `<button class="btn btn-sm btn-primary" onclick="Actions.transitionOrder('${row.id}', 'In Progress')">Start (MPPS N-CREATE)</button>`;
              if (row.status === 'In Progress') return `<button class="btn btn-sm btn-success" onclick="Actions.completeExam('${row.id}')">Complete (C-STORE + N-SET)</button>`;
              return '';
            }}
          ],
          data: techOrders,
          emptyMessage: 'No pending exams. All patients processed.'
        }),
        `<button class="btn btn-outline" onclick="Actions.simulatePacsUnavailable()">⚠️ Simulate PACS Unavailable</button>
         <button class="btn btn-outline" onclick="Actions.simulateMwlUnavailable()">⚠️ Simulate MWL Unavailable</button>`
      )}
    `;
  }
};

// ─── Radiologist Worklist ──────────────────────────────────────
Pages['rad-worklist'] = {
  title: 'Radiologist Worklist',
  render() {
    const orders = AppState.get('orders') || [];
    const readingQueue = orders.filter(o => ['Completed', 'Draft Report', 'Preliminary'].includes(o.status));
    const stats = readingQueue.filter(o => o.urgency === 'STAT');

    return `
      <div class="grid-4 mb-3">
        ${UI.metric('Unread Studies', readingQueue.filter(o => o.status === 'Completed').length, 'warning')}
        ${UI.metric('Draft Reports', readingQueue.filter(o => o.status === 'Draft Report').length)}
        ${UI.metric('Preliminary', readingQueue.filter(o => o.status === 'Preliminary').length)}
        ${UI.metric('STAT Pending', stats.length, stats.length > 0 ? 'danger' : 'success')}
      </div>
      ${UI.card('Reading Queue',
        UI.table({
          columns: [
            { key: 'accession', label: 'Accession' },
            { key: 'patientId', label: 'Patient', render: v => getPatientName(v) },
            { key: 'procedure', label: 'Procedure' },
            { key: 'modality', label: 'Mod.' },
            { key: 'urgency', label: 'Priority', render: v => UI.badge(v) },
            { key: 'status', label: 'Status', render: v => UI.badge(v) },
            { key: '_actions', label: 'Actions', render: (_, row) => `
              <div class="btn-group">
                <button class="btn btn-sm btn-primary" onclick="Actions.openViewer('${row.id}')">Open Viewer</button>
                <button class="btn btn-sm btn-outline" onclick="navigate('order-detail', {id:'${row.id}'})">Detail</button>
              </div>
            ` }
          ],
          data: readingQueue.sort((a, b) => {
            const p = { STAT: 0, Urgent: 1, Routine: 2 };
            return (p[a.urgency] || 2) - (p[b.urgency] || 2);
          }),
          emptyMessage: 'Reading queue is empty. All studies read!'
        })
      )}
    `;
  }
};

// ─── Dispatch & Interop ────────────────────────────────────────
Pages.dispatch = {
  title: 'Dispatch & Interop Hub',
  render() {
    const dispatch = AppState.get('dispatch') || [];
    const messages = AppState.get('outboundMessages') || [];
    const failed = messages.filter(m => m.status === 'Failed');

    return `
      <div class="grid-3 mb-3">
        ${UI.metric('Total Dispatch Records', dispatch.length)}
        ${UI.metric('Pending Sync', dispatch.filter(d => ['Pending', 'Dispatched', 'Processing'].includes(d.status)).length, 'warning')}
        ${UI.metric('Failed Messages', failed.length, failed.length > 0 ? 'danger' : 'success')}
      </div>
      <div class="tabs mb-2">
        <div class="tab active" onclick="showDispatchTab('dispatch-records')">Dispatch Records</div>
        <div class="tab" onclick="showDispatchTab('outbound-messages')">Outbound Messages</div>
      </div>
      <div id="dispatch-records">
        ${UI.card('Dispatch & Interop Records',
          UI.table({
            columns: [
              { key: 'id', label: 'ID' },
              { key: 'type', label: 'Type', render: v => `<strong>${v}</strong>` },
              { key: 'accession', label: 'Accession' },
              { key: 'originFacility', label: 'Origin', render: (v) => v || 'N/A' },
              { key: 'destinationFacility', label: 'Destination', render: (v) => v || 'N/A' },
              { key: 'barcode', label: 'Barcode' },
              { key: 'status', label: 'Status', render: v => UI.badge(v) },
              { key: '_actions', label: '', render: (_, row) => {
                if (row.status === 'Failed') return `<button class="btn btn-sm btn-danger" onclick="Actions.retryDispatch('${row.id}')">Retry</button>`;
                return `<button class="btn btn-sm btn-outline" onclick="UI.toast('Dispatch detail: ${row.id}', 'info')">View</button>`;
              }}
            ],
            data: dispatch,
            emptyMessage: 'No dispatch records.'
          }),
          `<button class="btn btn-primary" onclick="Actions.simulateOutsource()">+ Simulate Outsource</button>
           <button class="btn btn-outline" onclick="Actions.simulateReflex()">+ Simulate Reflex Test</button>
           <button class="btn btn-outline" onclick="Actions.simulateAddon()">+ Simulate Add-on</button>
           <button class="btn btn-danger" onclick="Actions.simulateFailedSync()">⚠️ Simulate Failed Sync</button>`
        )}
      </div>
      <div id="outbound-messages" class="hidden">
        ${UI.card('Outbound HL7/FHIR Messages',
          UI.table({
            columns: [
              { key: 'id', label: 'Msg ID' },
              { key: 'type', label: 'Type' },
              { key: 'trigger', label: 'Trigger' },
              { key: 'accession', label: 'Accession' },
              { key: 'destination', label: 'Destination' },
              { key: 'status', label: 'Status', render: v => UI.badge(v) },
              { key: 'retryCount', label: 'Retries' },
              { key: 'sentAt', label: 'Sent At', render: v => v ? formatDateTime(v) : 'N/A' },
              { key: '_actions', label: '', render: (_, row) => {
                if (row.status === 'Failed') return `<button class="btn btn-sm btn-danger" onclick="Actions.retryMessage('${row.id}')">Retry</button>`;
                return '';
              }}
            ],
            data: messages,
            emptyMessage: 'No outbound messages.'
          })
        )}
      </div>
    `;
  }
};

function showDispatchTab(tabId) {
  document.getElementById('dispatch-records').classList.toggle('hidden', tabId !== 'dispatch-records');
  document.getElementById('outbound-messages').classList.toggle('hidden', tabId !== 'outbound-messages');
  document.querySelectorAll('.tabs .tab').forEach((t, i) => {
    t.classList.toggle('active', (i === 0 && tabId === 'dispatch-records') || (i === 1 && tabId === 'outbound-messages'));
  });
}

// ─── Flow Visualization ────────────────────────────────────────
Pages['flow-viz'] = {
  title: 'System Architecture Flow',
  render() {
    return `
      <div class="grid-2">
        ${UI.card('End-to-End Radiology Workflow', `
          <div class="flow-container">
            <div class="flow-row">
              <div class="flow-node" onclick="navigate('patients')">HIS / EMR<small>ADT · ORM Messages</small></div>
              <div class="flow-arrow">➜</div>
              <div class="flow-node" onclick="navigate('orders')">RIS Core<small>Order Orchestration</small></div>
              <div class="flow-arrow">➜</div>
              <div class="flow-node" onclick="navigate('scheduling')">Scheduling<small>Appointments</small></div>
            </div>
            <div class="flow-arrow flow-arrow-down">➜</div>
            <div class="flow-row">
              <div class="flow-node" onclick="navigate('tech-worklist')">MWL SCP<small>DICOM C-FIND</small></div>
              <div class="flow-arrow">➜</div>
              <div class="flow-node" onclick="navigate('tech-worklist')">Modality<small>CT / MRI / XR</small></div>
              <div class="flow-arrow">➜</div>
              <div class="flow-node">PACS Server<small>DICOM C-STORE</small></div>
            </div>
            <div class="flow-arrow flow-arrow-down">➜</div>
            <div class="flow-row">
              <div class="flow-node" onclick="navigate('rad-worklist')">Radiologist<small>Reading & Reporting</small></div>
              <div class="flow-arrow">➜</div>
              <div class="flow-node" onclick="navigate('dispatch')">Outbox Worker<small>HL7 ORU Dispatch</small></div>
              <div class="flow-arrow">➜</div>
              <div class="flow-node" onclick="navigate('patients')">HIS / EMR<small>Final Result</small></div>
            </div>
          </div>
        `)}
        ${UI.card('Dispatch & Interop Flow', `
          <div class="flow-container">
            <div class="flow-row">
              <div class="flow-node" onclick="navigate('dispatch')">Origin Hospital<small>Create Outsource Order</small></div>
              <div class="flow-arrow">➜</div>
              <div class="flow-node" onclick="navigate('dispatch')">Interop Engine<small>HL7 / FHIR</small></div>
              <div class="flow-arrow">➜</div>
              <div class="flow-node" onclick="navigate('dispatch')">Destination Lab<small>Receive & Process</small></div>
            </div>
            <div class="flow-arrow flow-arrow-down">➜</div>
            <div class="flow-row">
              <div class="flow-node" onclick="navigate('dispatch')">Add-on / Reflex<small>Generate New Tests</small></div>
              <div class="flow-arrow">➜</div>
              <div class="flow-node" onclick="navigate('dispatch')">Interop Engine<small>Sync Back</small></div>
              <div class="flow-arrow">➜</div>
              <div class="flow-node" onclick="navigate('dispatch')">Origin Hospital<small>Receive Results</small></div>
            </div>
          </div>
        `)}
      </div>
      ${UI.card('Order Status State Machine', `
        <div class="flow-container">
          <div class="flow-row" style="flex-wrap:wrap;">
            <div class="flow-node" style="border-color:#6366f1">Requested</div>
            <div class="flow-arrow">➜</div>
            <div class="flow-node" style="border-color:#f59e0b">Scheduled</div>
            <div class="flow-arrow">➜</div>
            <div class="flow-node" style="border-color:#3b82f6">Arrived</div>
            <div class="flow-arrow">➜</div>
            <div class="flow-node" style="border-color:#3b82f6">In Progress</div>
            <div class="flow-arrow">➜</div>
            <div class="flow-node" style="border-color:#10b981">Completed</div>
          </div>
          <div class="flow-arrow flow-arrow-down">➜</div>
          <div class="flow-row" style="flex-wrap:wrap;">
            <div class="flow-node" style="border-color:#6366f1">Draft Report</div>
            <div class="flow-arrow">➜</div>
            <div class="flow-node" style="border-color:#f59e0b">Preliminary</div>
            <div class="flow-arrow">➜</div>
            <div class="flow-node" style="border-color:#10b981">Finalized</div>
            <div class="flow-arrow">➜</div>
            <div class="flow-node" style="border-color:#10b981">Validated</div>
          </div>
        </div>
      `)}
    `;
  }
};

// ─── Demo Scenarios ────────────────────────────────────────────
Pages.scenarios = {
  title: 'Demo Scenarios',
  render() {
    return `
      <div class="grid-2">
        ${scenarioCard(1, 'Normal Radiology Workflow', 'Walk through a complete exam: Order → Schedule → Check-in → Start Procedure → Complete → Read → Report → Finalize.', 'btn-primary')}
        ${scenarioCard(2, 'Outsourced Test (Interop)', 'Origin hospital outsources a PET-CT to a partner lab. Track dispatch, processing, and result sync.', 'btn-outline')}
        ${scenarioCard(3, 'Add-on Testing', 'Destination lab adds an additional test to an existing order. Sync add-on back to origin.', 'btn-outline')}
        ${scenarioCard(4, 'Reflex Testing', 'Auto-triggered reflex test based on initial findings. Generate new test and sync.', 'btn-outline')}
        ${scenarioCard(5, 'Shared Barcode', 'Multiple tests share a single barcode. Track barcode relationships across dispatch.', 'btn-outline')}
        ${scenarioCard(6, 'Failed Sync + Retry', 'Simulate a network failure on HL7 outbound message. Retry and recover.', 'btn-danger')}
        ${scenarioCard(7, 'Report Generation & Validation', 'Create a structured report, sign, finalize, and dispatch ORU result to HIS.', 'btn-outline')}
      </div>
    `;
  }
};

function scenarioCard(num, title, desc, btnClass) {
  return UI.card(`Scenario ${num}: ${title}`, `
    <p class="text-sm">${desc}</p>
    <button class="btn ${btnClass} mt-2" onclick="Actions.runScenario(${num})">▶ Run Scenario ${num}</button>
  `);
}

// ─── PACS Viewer Logic ─────────────────────────────────────────
function openPacsViewer(orderId) {
  const order = AppState.getById('orders', orderId);
  if (!order) return;
  const patient = AppState.getById('patients', order.patientId);
  const study = getStudyByOrder(orderId);
  const report = getReportByOrder(orderId);

  const el = document.getElementById('viewer-overlay');
  el.classList.add('active');

  document.getElementById('viewer-patient-info').textContent =
    `${patient ? patient.name : 'Unknown'} | ${order.accession} | ${order.procedure}`;
  document.getElementById('viewer-study-info').textContent =
    study ? `Study UID: ${study.studyInstanceUid} | ${study.seriesCount} series · ${study.imageCount} images` : 'No study linked';

  document.getElementById('report-findings').value = report ? report.findings || '' : '';
  document.getElementById('report-impression').value = report ? report.impression || '' : '';

  // Transition to Draft Report if currently Completed
  if (order.status === 'Completed') {
    transitionOrder(orderId, 'Draft Report', 'Opened in viewer');
  }

  AppState.set('viewerOpen', true);
  AppState.set('selectedOrderId', orderId);
  AppState.log(`Opened PACS viewer for ${order.accession}`, 'viewer');
}

function closePacsViewer() {
  document.getElementById('viewer-overlay').classList.remove('active');
  AppState.set('viewerOpen', false);
  navigate('rad-worklist');
}

function finalizeReportFromViewer() {
  const orderId = AppState.get('selectedOrderId');
  if (!orderId) return;
  const order = AppState.getById('orders', orderId);
  const findings = document.getElementById('report-findings').value;
  const impression = document.getElementById('report-impression').value;

  if (!findings.trim() || !impression.trim()) {
    UI.toast('Both Findings and Impression are required to finalize.', 'error');
    return;
  }

  // Create or update report
  let report = getReportByOrder(orderId);
  if (report) {
    AppState.updateById('reports', report.id, {
      findings, impression, status: 'Finalized', signedAt: new Date().toISOString(), version: (report.version || 1) + 1
    });
  } else {
    AppState.addTo('reports', {
      id: generateId('RPT'),
      orderId,
      studyId: getStudyByOrder(orderId)?.id || null,
      accession: order.accession,
      patientId: order.patientId,
      radiologistId: 'RAD-001',
      status: 'Finalized',
      clinicalHistory: order.clinicalIndication || '',
      technique: `${order.procedure}: Standard protocol.`,
      findings, impression,
      createdAt: new Date().toISOString(),
      signedAt: new Date().toISOString(),
      version: 1
    });
  }

  // Transition order
  transitionOrder(orderId, 'Preliminary', 'Report drafted');
  setTimeout(() => {
    transitionOrder(orderId, 'Finalized', 'Report digitally signed');
    AppState.log(`Report finalized for ${order.accession}. DB Transaction committed.`, 'report');

    // Simulate outbox HL7 ORU
    AppState.addTo('outboundMessages', {
      id: generateId('MSG'),
      type: 'HL7 ORU',
      trigger: 'R01',
      direction: 'Outbound',
      accession: order.accession,
      destination: 'HIS/EMR',
      status: 'Delivered',
      payload: `MSH|^~\\&|RIS|HOSP|HIS|HOSP|${new Date().toISOString()}||ORU^R01|${generateId('MSG')}|P|2.5.1`,
      sentAt: new Date().toISOString(),
      responseCode: 'AA',
      retryCount: 0
    });
    AppState.log(`HL7 ORU^R01 sent to HIS for ${order.accession}`, 'hl7');
    UI.toast('Report finalized & HL7 ORU dispatched!', 'success');
  }, 800);

  closePacsViewer();
}

// ─── Actions (State Mutations) ─────────────────────────────────
const Actions = {
  addPatient() {
    const name = document.getElementById('pt-name')?.value;
    if (!name) { UI.toast('Patient name is required.', 'error'); return; }
    const patient = {
      id: generateId('PAT'),
      mrn: 'MRN-' + Math.floor(10000 + Math.random() * 89999),
      name,
      dob: document.getElementById('pt-dob')?.value || '1990-01-01',
      sex: document.getElementById('pt-sex')?.value || 'M',
      phone: document.getElementById('pt-phone')?.value || '',
      address: '',
      insurance: document.getElementById('pt-insurance')?.value || '',
      allergies: document.getElementById('pt-allergies')?.value || 'None known',
      status: 'Active'
    };
    AppState.addTo('patients', patient);
    AppState.log(`HL7 ADT^A04: Patient registered: ${patient.name} (${patient.mrn})`, 'adt');
    UI.closeModal('add-patient');
    UI.toast('Patient registered successfully!', 'success');
    navigate('patients');
  },

  createOrder() {
    const patientId = document.getElementById('ord-patient')?.value;
    const procedureCode = document.getElementById('ord-procedure')?.value;
    const urgency = document.getElementById('ord-urgency')?.value || 'Routine';
    const indication = document.getElementById('ord-indication')?.value;
    if (!patientId || !procedureCode) { UI.toast('Patient and Procedure are required.', 'error'); return; }
    const proc = (typeof MOCK_DATA !== 'undefined' && MOCK_DATA.procedures || []).find(p => p.code === procedureCode);
    const order = {
      id: generateId('ORD'),
      accession: 'ACC-' + new Date().getFullYear() + '-' + String(Math.floor(10000 + Math.random() * 89999)),
      patientId,
      encounterId: null,
      procedure: proc ? proc.name : 'Unknown Procedure',
      procedureCode,
      modality: proc ? proc.modality : 'CR',
      bodyPart: proc ? proc.bodyPart : '',
      laterality: 'N/A',
      urgency,
      status: 'Requested',
      orderingPhysician: document.getElementById('ord-physician')?.value || 'Dr. Unknown',
      clinicalIndication: indication || '',
      scheduledDate: null,
      scheduledTime: null,
      roomId: null,
      modalityId: null,
      assignedTech: null,
      assignedRad: null,
      createdAt: new Date().toISOString()
    };
    AppState.addTo('orders', order);
    AppState.addTo('statusHistory', {
      id: generateId('SH'),
      entityType: 'Order',
      entityId: order.id,
      fromStatus: 'N/A',
      toStatus: 'Requested',
      changedBy: 'System',
      changedAt: new Date().toISOString(),
      reason: 'HL7 ORM^O01 received'
    });
    AppState.log(`HL7 ORM^O01: New order ${order.accession} for ${getPatientName(patientId)}`, 'orm');
    UI.closeModal('create-order');
    UI.toast('Order placed successfully!', 'success');
    navigate('orders');
  },

  transitionOrder(orderId, newStatus) {
    const result = transitionOrder(orderId, newStatus);
    if (!result.success) {
      UI.toast(result.error, 'error');
      return;
    }
    UI.toast(`Order transitioned to ${newStatus}`, 'success');
    Router.render();
  },

  scheduleOrder(orderId) {
    const order = AppState.getById('orders', orderId);
    if (!order) return;
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().slice(0, 10);
    AppState.updateById('orders', orderId, {
      status: 'Scheduled',
      scheduledDate: dateStr,
      scheduledTime: '10:00',
      roomId: 'ROOM-001',
      modalityId: 'MOD-001',
      assignedTech: 'TECH-001'
    });
    AppState.addTo('appointments', {
      id: generateId('APT'),
      orderId,
      patientId: order.patientId,
      date: dateStr,
      startTime: '10:00',
      endTime: '10:45',
      roomId: 'ROOM-001',
      modalityId: 'MOD-001',
      techId: 'TECH-001',
      status: 'Confirmed',
      duration: 45
    });
    AppState.addTo('statusHistory', {
      id: generateId('SH'),
      entityType: 'Order',
      entityId: orderId,
      fromStatus: 'Requested',
      toStatus: 'Scheduled',
      changedBy: 'Coordinator',
      changedAt: new Date().toISOString(),
      reason: 'Appointment scheduled'
    });
    AppState.log(`Order ${order.accession} scheduled for ${dateStr} 10:00`, 'schedule');
    UI.toast('Order scheduled!', 'success');
    Router.render();
  },

  completeExam(orderId) {
    const order = AppState.getById('orders', orderId);
    if (!order) return;
    AppState.log(`MPPS N-SET: Procedure completed for ${order.accession}`, 'mpps');
    AppState.log(`DICOM C-STORE: Images sent to PACS for ${order.accession}`, 'dicom');

    // Create study
    AppState.addTo('studies', {
      id: generateId('STD'),
      orderId,
      accession: order.accession,
      patientId: order.patientId,
      studyInstanceUid: '1.2.840.113619.2.55.3.' + Date.now() + '.' + Math.floor(Math.random() * 999999),
      studyDate: new Date().toISOString().slice(0, 10),
      studyDescription: order.procedure.toUpperCase(),
      modality: order.modality,
      seriesCount: Math.floor(2 + Math.random() * 5),
      imageCount: Math.floor(40 + Math.random() * 200),
      bodyPart: order.bodyPart || '',
      status: 'Available',
      receivedAt: new Date().toISOString()
    });

    setTimeout(() => {
      AppState.log(`PACS Webhook: Study stored for ${order.accession}`, 'pacs');
      transitionOrder(orderId, 'Completed', 'Exam completed, images stored');
      UI.toast('Exam completed! Study available in PACS.', 'success');
      Router.render();
    }, 600);
  },

  openViewer(orderId) {
    openPacsViewer(orderId);
  },

  simulateOutsource() {
    const record = {
      id: generateId('DSP'),
      type: 'Outsourced Test',
      accession: 'ACC-' + new Date().getFullYear() + '-' + Math.floor(10000 + Math.random() * 89999),
      originFacility: 'Springfield General Hospital',
      destinationFacility: 'Regional Reference Lab',
      patientId: 'PAT-001',
      testName: 'PET-CT Whole Body',
      barcode: 'BC-' + Math.floor(1000000 + Math.random() * 8999999),
      status: 'Dispatched',
      syncTimestamp: new Date().toISOString(),
      retryCount: 0
    };
    AppState.addTo('dispatch', record);
    AppState.log(`Outsourced test dispatched: ${record.testName} → ${record.destinationFacility}`, 'dispatch');
    UI.toast('Outsource dispatched!', 'info');

    setTimeout(() => {
      AppState.updateById('dispatch', record.id, { status: 'Received' });
      AppState.log(`Destination lab received: ${record.id}`, 'dispatch');
      setTimeout(() => {
        AppState.updateById('dispatch', record.id, { status: 'Processing' });
        AppState.log(`Destination lab processing: ${record.id}`, 'dispatch');
        setTimeout(() => {
          AppState.updateById('dispatch', record.id, { status: 'Synced', syncTimestamp: new Date().toISOString() });
          AppState.log(`Result synced back to origin: ${record.id}`, 'dispatch');
          UI.toast('Outsource result synced!', 'success');
          Router.render();
        }, 1500);
      }, 1000);
    }, 1000);

    Router.render();
  },

  simulateReflex() {
    const record = {
      id: generateId('DSP'),
      type: 'Reflex Test',
      accession: 'ACC-2024-00108',
      originFacility: 'Regional Reference Lab',
      destinationFacility: 'Springfield General Hospital',
      patientId: 'PAT-006',
      testName: 'Follow-up MRI with Contrast',
      barcode: 'BC-' + Math.floor(1000000 + Math.random() * 8999999),
      status: 'Pending',
      syncTimestamp: null,
      retryCount: 0
    };
    AppState.addTo('dispatch', record);
    AppState.log('Reflex test generated at destination lab', 'dispatch');
    UI.toast('Reflex test created!', 'info');

    setTimeout(() => {
      AppState.updateById('dispatch', record.id, { status: 'Synced', syncTimestamp: new Date().toISOString() });
      AppState.log(`Reflex test ${record.id} synced to origin`, 'dispatch');
      UI.toast('Reflex test synced to origin!', 'success');
      Router.render();
    }, 2500);
    Router.render();
  },

  simulateAddon() {
    const record = {
      id: generateId('DSP'),
      type: 'Add-on Test',
      accession: 'ACC-2024-00108',
      originFacility: 'Regional Reference Lab',
      destinationFacility: 'Springfield General Hospital',
      patientId: 'PAT-006',
      testName: 'CT Guided Biopsy',
      barcode: 'BC-9981234',
      status: 'Pending',
      syncTimestamp: null,
      retryCount: 0
    };
    AppState.addTo('dispatch', record);
    AppState.log('Add-on test created (shares barcode BC-9981234)', 'dispatch');
    UI.toast('Add-on test created!', 'info');

    setTimeout(() => {
      AppState.updateById('dispatch', record.id, { status: 'Synced', syncTimestamp: new Date().toISOString() });
      AppState.log('Add-on test synced to origin', 'dispatch');
      UI.toast('Add-on synced!', 'success');
      Router.render();
    }, 2000);
    Router.render();
  },

  simulateFailedSync() {
    const msg = {
      id: generateId('MSG'),
      type: 'HL7 ORU',
      trigger: 'R01',
      direction: 'Outbound',
      accession: 'ACC-2024-00105',
      destination: 'HIS/EMR',
      status: 'Failed',
      payload: 'MSH|^~\\&|RIS|HOSP|HIS|HOSP|...||ORU^R01|...',
      sentAt: new Date().toISOString(),
      responseCode: 'AE',
      retryCount: 2
    };
    AppState.addTo('outboundMessages', msg);
    AppState.log(`⚠️ HL7 ORU delivery FAILED: ${msg.id} (Network Timeout after 2 retries)`, 'error');
    UI.toast('Outbound message FAILED!', 'error');
    Router.render();
  },

  retryDispatch(id) {
    AppState.log(`Retrying dispatch ${id}...`, 'dispatch');
    UI.toast('Retrying...', 'info');
    setTimeout(() => {
      AppState.updateById('dispatch', id, { status: 'Synced', syncTimestamp: new Date().toISOString(), retryCount: 0 });
      AppState.log(`Dispatch ${id} synced successfully after retry`, 'dispatch');
      UI.toast('Dispatch synced!', 'success');
      Router.render();
    }, 1500);
  },

  retryMessage(id) {
    AppState.log(`Retrying message ${id}...`, 'hl7');
    UI.toast('Retrying message...', 'info');
    setTimeout(() => {
      AppState.updateById('outboundMessages', id, { status: 'Delivered', responseCode: 'AA', retryCount: 3 });
      AppState.log(`Message ${id} delivered successfully after retry`, 'hl7');
      UI.toast('Message delivered!', 'success');
      Router.render();
    }, 1500);
  },

  simulatePacsUnavailable() {
    UI.toast('⚠️ PACS Server is UNAVAILABLE. C-STORE will fail.', 'error');
    AppState.log('⚠️ Simulated: PACS Server unreachable (connection refused)', 'error');
  },

  simulateMwlUnavailable() {
    UI.toast('⚠️ MWL SCP is UNAVAILABLE. Modality C-FIND will fail.', 'error');
    AppState.log('⚠️ Simulated: MWL SCP not responding (timeout)', 'error');
  },

  runScenario(num) {
    AppState.reset();
    AppState.log(`--- Scenario ${num} started ---`, 'scenario');

    if (num === 1) {
      // Normal radiology workflow - create a fresh order
      const order = {
        id: 'ORD-DEMO', accession: 'ACC-DEMO-001', patientId: 'PAT-001',
        encounterId: 'ENC-001', procedure: 'CT Head without Contrast', procedureCode: '70450',
        modality: 'CT', bodyPart: 'Head', laterality: 'N/A', urgency: 'Routine',
        status: 'Scheduled', orderingPhysician: 'Dr. Sarah Mitchell',
        clinicalIndication: 'Rule out intracranial hemorrhage after fall',
        scheduledDate: new Date().toISOString().slice(0, 10), scheduledTime: '14:00',
        roomId: 'ROOM-002', modalityId: 'MOD-002', assignedTech: 'TECH-002', assignedRad: 'RAD-001',
        createdAt: new Date().toISOString()
      };
      AppState.addTo('orders', order);
      AppState.log('Scenario 1: Order ORD-DEMO created (Scheduled). Go to Tech Worklist to begin.', 'scenario');
      UI.toast('Scenario 1 loaded! Go to Tech Worklist.', 'info');
      navigate('tech-worklist');
    } else if (num === 2) {
      Actions.simulateOutsource();
      UI.toast('Scenario 2: Outsource simulation started.', 'info');
      navigate('dispatch');
    } else if (num === 3) {
      Actions.simulateAddon();
      UI.toast('Scenario 3: Add-on test simulation started.', 'info');
      navigate('dispatch');
    } else if (num === 4) {
      Actions.simulateReflex();
      UI.toast('Scenario 4: Reflex test simulation started.', 'info');
      navigate('dispatch');
    } else if (num === 5) {
      // Shared barcode
      const bc = 'BC-SHARED-001';
      AppState.addTo('dispatch', { id: generateId('DSP'), type: 'Outsourced Test', accession: 'ACC-DEMO-BC1', originFacility: 'Main Hospital', destinationFacility: 'Lab A', patientId: 'PAT-002', testName: 'CBC', barcode: bc, status: 'Synced', syncTimestamp: new Date().toISOString(), retryCount: 0 });
      AppState.addTo('dispatch', { id: generateId('DSP'), type: 'Add-on Test', accession: 'ACC-DEMO-BC2', originFacility: 'Lab A', destinationFacility: 'Main Hospital', patientId: 'PAT-002', testName: 'CMP', barcode: bc, status: 'Synced', syncTimestamp: new Date().toISOString(), retryCount: 0 });
      AppState.addTo('dispatch', { id: generateId('DSP'), type: 'Reflex Test', accession: 'ACC-DEMO-BC3', originFacility: 'Lab A', destinationFacility: 'Main Hospital', patientId: 'PAT-002', testName: 'HbA1c', barcode: bc, status: 'Pending', syncTimestamp: null, retryCount: 0 });
      AppState.log(`Scenario 5: 3 tests sharing barcode ${bc}`, 'scenario');
      UI.toast('Scenario 5: Shared barcode loaded.', 'info');
      navigate('dispatch');
    } else if (num === 6) {
      Actions.simulateFailedSync();
      UI.toast('Scenario 6: Failed sync loaded. Check Outbound Messages tab.', 'info');
      navigate('dispatch');
    } else if (num === 7) {
      // Report workflow - create order in Completed status with study
      const ordId = 'ORD-RPT-DEMO';
      AppState.addTo('orders', {
        id: ordId, accession: 'ACC-RPT-001', patientId: 'PAT-003',
        encounterId: 'ENC-003', procedure: 'MRI Lumbar Spine', procedureCode: '72148',
        modality: 'MR', bodyPart: 'Lumbar Spine', laterality: 'N/A', urgency: 'Urgent',
        status: 'Completed', orderingPhysician: 'Dr. Robert Kim',
        clinicalIndication: 'Low back pain radiating to left leg for 4 weeks',
        scheduledDate: new Date().toISOString().slice(0, 10), scheduledTime: '11:00',
        roomId: 'ROOM-001', modalityId: 'MOD-001', assignedTech: 'TECH-001', assignedRad: 'RAD-002',
        createdAt: new Date().toISOString()
      });
      AppState.addTo('studies', {
        id: 'STD-RPT-DEMO', orderId: ordId, accession: 'ACC-RPT-001', patientId: 'PAT-003',
        studyInstanceUid: '1.2.840.113619.2.55.3.' + Date.now(), studyDate: new Date().toISOString().slice(0, 10),
        studyDescription: 'MRI LUMBAR SPINE WO CONTRAST', modality: 'MR',
        seriesCount: 5, imageCount: 220, bodyPart: 'LUMBAR SPINE', status: 'Available',
        receivedAt: new Date().toISOString()
      });
      AppState.log('Scenario 7: Study ready for reading. Go to Rad Worklist.', 'scenario');
      UI.toast('Scenario 7: Study ready! Go to Rad Worklist.', 'info');
      navigate('rad-worklist');
    }
  }
};

// ─── Helper Functions ──────────────────────────────────────────
function getStaffName(id) {
  if (!id) return 'N/A';
  const rads = (typeof MOCK_DATA !== 'undefined' && MOCK_DATA.staff?.radiologists) || [];
  const techs = (typeof MOCK_DATA !== 'undefined' && MOCK_DATA.staff?.technologists) || [];
  const found = [...rads, ...techs].find(s => s.id === id);
  return found ? found.name : id;
}

function getRoomName(id) {
  if (!id) return 'N/A';
  const rooms = (typeof MOCK_DATA !== 'undefined' && MOCK_DATA.rooms) || [];
  const room = rooms.find(r => r.id === id);
  return room ? room.name : id;
}

// ─── Developer Panel ───────────────────────────────────────────
function toggleDevPanel() {
  const body = document.getElementById('dev-panel-body');
  body.classList.toggle('collapsed');
}

function updateDevPanel() {
  const logEl = document.getElementById('dev-log');
  if (!logEl) return;
  const logs = (AppState.get('activityLog') || []).slice(0, 25);
  logEl.innerHTML = logs.map(l => `<div>[${l.type || 'info'}] ${l.message}</div>`).join('');

  const stateEl = document.getElementById('dev-state-summary');
  if (stateEl) {
    const orders = AppState.get('orders') || [];
    stateEl.innerHTML = `
      View: <strong>${AppState.get('currentView')}</strong><br>
      Orders: <strong>${orders.length}</strong> |
      Dispatch: <strong>${(AppState.get('dispatch') || []).length}</strong> |
      Messages: <strong>${(AppState.get('outboundMessages') || []).length}</strong>
    `;
  }
}

function resetAll() {
  if (confirm('Reset all mockup state to initial data?')) {
    AppState.reset();
    AppState.log('System state fully reset.', 'system');
    UI.toast('State reset to initial data.', 'info');
    navigate('dashboard');
  }
}

// ─── Initialization ────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  AppState.init();
  navigate('dashboard');
  updateDevPanel();
});
