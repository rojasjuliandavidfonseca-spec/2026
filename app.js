/**
 * Controlador Principal de la Aplicación de Bodega PROTECSA JSD S.A.S.
 * Maneja el estado global, navegación entre vistas 2D y 3D, modales y panel de detalle.
 */

import { ZONES, U_FLOW_JUSTIFICATION } from './data/zones.js';
import { View2D } from './view2d.js';
import { View3D } from './view3d.js';

class App {
  constructor() {
    this.currentView = '2d';
    this.selectedZoneId = null;

    this.initUI();
    this.initViews();
  }

  initUI() {
    // Lucide Icons initialization
    if (window.lucide) {
      window.lucide.createIcons();
    }

    // View Switcher Buttons
    const btnTab2D = document.getElementById('btnTab2D');
    const btnTab3D = document.getElementById('btnTab3D');

    btnTab2D.addEventListener('click', () => this.switchView('2d'));
    btnTab3D.addEventListener('click', () => this.switchView('3d'));

    // Tour Action Button
    const btnStartTour = document.getElementById('btnStartTour');
    btnStartTour.addEventListener('click', () => {
      this.switchView('3d');
      if (this.view3D) {
        this.view3D.startGuidedTour((step, index, total) => {
          this.onZoneSelected(step.zoneId);
        });
      }
    });

    // Modals
    const btnWhyU = document.getElementById('btnWhyUFlow');
    const modalWhyU = document.getElementById('modalWhyU');
    const btnCloseWhyU = document.getElementById('btnCloseWhyU');

    btnWhyU.addEventListener('click', () => modalWhyU.classList.add('active'));
    btnCloseWhyU.addEventListener('click', () => modalWhyU.classList.remove('active'));

    const btnAllZones = document.getElementById('btnAllZones');
    const modalAllZones = document.getElementById('modalAllZones');
    const btnCloseAllZones = document.getElementById('btnCloseAllZones');

    btnAllZones.addEventListener('click', () => {
      this.renderAllZonesGrid();
      modalAllZones.classList.add('active');
    });
    btnCloseAllZones.addEventListener('click', () => modalAllZones.classList.remove('active'));

    // Side Drawer Close
    const btnCloseDrawer = document.getElementById('btnCloseDrawer');
    btnCloseDrawer.addEventListener('click', () => this.closeDrawer());
  }

  initViews() {
    // 2D View
    this.view2D = new View2D('view2dContainer', (zoneId) => this.onZoneSelected(zoneId));

    // 3D View
    this.view3D = new View3D('view3dContainer', (zoneId) => this.onZoneSelected(zoneId));
  }

  switchView(viewMode) {
    this.currentView = viewMode;

    const v2d = document.getElementById('view2dContainer');
    const v3d = document.getElementById('view3dContainer');
    const tab2d = document.getElementById('btnTab2D');
    const tab3d = document.getElementById('btnTab3D');

    if (viewMode === '2d') {
      v2d.style.display = 'block';
      v3d.style.display = 'none';
      tab2d.classList.add('active');
      tab3d.classList.remove('active');
    } else {
      v2d.style.display = 'none';
      v3d.style.display = 'block';
      tab2d.classList.remove('active');
      tab3d.classList.add('active');
    }
  }

  onZoneSelected(zoneId) {
    this.selectedZoneId = zoneId;
    const zone = ZONES.find(z => z.id === zoneId);
    if (!zone) return;

    // Update 2D highlight
    if (this.view2D) this.view2D.selectZone(zoneId);

    // Update 3D focus
    if (this.view3D) this.view3D.focusZone(zoneId);

    // Open & populate Drawer
    this.openDrawer(zone);
  }

  openDrawer(zone) {
    const drawer = document.getElementById('zoneDrawer');
    
    document.getElementById('drawerZoneCode').textContent = `${zone.code} — ${zone.category.toUpperCase()}`;
    document.getElementById('drawerZoneTitle').textContent = zone.name;
    document.getElementById('drawerDescription').textContent = zone.description;
    document.getElementById('drawerWhatIsDone').textContent = zone.whatIsDone;
    document.getElementById('drawerImportance').textContent = zone.importance;
    document.getElementById('drawerWorkerActivity').textContent = zone.workerActivity || "Supervisión y operación logística.";

    // Outcomes Box for Quality Inspection
    const outcomesBox = document.getElementById('drawerOutcomesBox');
    if (zone.outcomes && zone.outcomes.length > 0) {
      outcomesBox.style.display = 'flex';
      outcomesBox.innerHTML = zone.outcomes.map(o => `
        <div class="outcome-item ${o.class}">
          <strong>${o.status}:</strong> ${o.text}
        </div>
      `).join('');
    } else {
      outcomesBox.style.display = 'none';
    }

    // Products List
    const productsList = document.getElementById('drawerProductsList');
    if (zone.productsPresent && zone.productsPresent.length > 0) {
      productsList.innerHTML = zone.productsPresent.map(p => `
        <span class="prod-chip"><i data-lucide="check" style="width:12px;"></i> ${p}</span>
      `).join('');
    } else if (zone.subSectors) {
      productsList.innerHTML = zone.subSectors.map(s => `
        <span class="prod-chip"><strong>${s.name}:</strong> ${s.desc}</span>
      `).join('');
    } else {
      productsList.innerHTML = `<span class="prod-chip">Equipos y herramientas de zona</span>`;
    }

    drawer.classList.add('open');
    if (window.lucide) window.lucide.createIcons();
  }

  closeDrawer() {
    const drawer = document.getElementById('zoneDrawer');
    drawer.classList.remove('open');
  }

  renderAllZonesGrid() {
    const gridContainer = document.getElementById('allZonesGrid');
    if (!gridContainer) return;

    gridContainer.innerHTML = ZONES.map(z => `
      <div class="benefit-card" style="text-align: left; cursor: pointer; border-left: 4px solid var(--accent-gold);" onclick="window.appInstance.onZoneSelected(${z.id}); document.getElementById('modalAllZones').classList.remove('active');">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span style="font-size:0.7rem; font-weight:800; color:var(--accent-gold);">${z.code}</span>
          <span style="font-size:0.65rem; background:rgba(255,255,255,0.1); padding:2px 6px; border-radius:3px;">${z.category}</span>
        </div>
        <div style="font-weight:800; font-size:0.9rem; color:#fff; margin-top:4px;">${z.name}</div>
        <div style="font-size:0.75rem; color:var(--text-muted); margin-top:4px;">${z.description}</div>
      </div>
    `).join('');
  }
}

// Global App Initialization
window.addEventListener('DOMContentLoaded', () => {
  window.appInstance = new App();
});
