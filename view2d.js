/**
 * Componente de Representación 2D del Layout de la Bodega PROTECSA JSD S.A.S.
 * Renderiza el plano visto desde arriba con interacción, vectorización en U y animaciones.
 */

import { ZONES, U_FLOW_STEPS, PRODUCTS } from './data/zones.js';

export class View2D {
  constructor(containerId, onZoneSelect) {
    this.container = document.getElementById(containerId);
    this.onZoneSelect = onZoneSelect;
    this.selectedZoneId = null;
    this.animatingFlow = false;
    this.flowStepIndex = 0;
    this.render();
  }

  render() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="view-2d-wrapper">
        <div class="view-2d-header">
          <div class="badge-tag gold"><i data-lucide="compass"></i> VISTA EN PLANTA (2D) — FLUJO EN U</div>
          <h2>Plano Logístico Operativo de la Bodega</h2>
          <p>PROTECSA JSD S.A.S. — Frente de Carga y Descarga (Izq.) y Despacho (Der.)</p>
        </div>

        <div class="view-2d-canvas-container">
          <!-- BODEGA BOUNDARY SVG -->
          <svg class="warehouse-svg" viewBox="0 0 1000 700" preserveAspectRatio="xMidYMid meet">
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255, 255, 255, 0.04)" stroke-width="1"/>
              </pattern>
              
              <!-- U-FLOW GLOW GRADIENT -->
              <linearGradient id="uFlowGrad" x1="0%" y1="100%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#3b82f6" />
                <stop offset="30%" stop-color="#10b981" />
                <stop offset="60%" stop-color="#f59e0b" />
                <stop offset="100%" stop-color="#e11d48" />
              </linearGradient>

              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <!-- Grid & Floor Base -->
            <rect width="1000" height="700" fill="#0f172a" rx="12"/>
            <rect width="1000" height="700" fill="url(#grid)" rx="12"/>
            
            <!-- Exterior Front Dock Loading Areas -->
            <!-- Left Exterior: Supplier Truck Area -->
            <rect x="20" y="520" width="200" height="160" fill="rgba(59, 130, 246, 0.08)" stroke="#3b82f6" stroke-dasharray="4 4" rx="8"/>
            <text x="120" y="665" text-anchor="middle" fill="#93c5fd" font-size="11" font-weight="600">CAMIÓN PROVEEDOR (GALEANO)</text>

            <!-- Right Exterior: Customer Dispatch Area -->
            <rect x="780" y="520" width="200" height="160" fill="rgba(239, 68, 68, 0.08)" stroke="#ef4444" stroke-dasharray="4 4" rx="8"/>
            <text x="880" y="665" text-anchor="middle" fill="#fca5a5" font-size="11" font-weight="600">CAMIÓN DESPACHO CLIENTE</text>

            <!-- Warehouse Walls -->
            <rect x="30" y="30" width="940" height="470" fill="none" stroke="#334155" stroke-width="6" rx="6"/>
            <line x1="30" y1="500" x2="250" y2="500" stroke="#3b82f6" stroke-width="8"/>
            <line x1="750" y1="500" x2="970" y2="500" stroke="#ef4444" stroke-width="8"/>

            <!-- Main Walkway Guidelines -->
            <rect x="240" y="240" width="520" height="60" fill="rgba(245, 158, 11, 0.08)" stroke="#f59e0b" stroke-dasharray="6 6" rx="4"/>
            <text x="500" y="275" text-anchor="middle" fill="#fbbf24" font-size="12" font-weight="700">PASILLO PRINCIPAL DE CIRCULACIÓN DE SEGURIDAD</text>

            <!-- U-SHAPED FLOW PATH LINE -->
            <path id="uFlowPath" d="
              M 130 600 
              L 130 420 
              L 130 260 
              L 130 110 
              L 500 110 
              L 870 110 
              L 870 330 
              L 870 420 
              L 870 600
            " fill="none" stroke="url(#uFlowGrad)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" filter="url(#glow)"/>

            <!-- Animated Flow Particles -->
            <circle id="flowParticle" r="9" fill="#f59e0b" filter="url(#glow)">
              <animateMotion dur="8s" repeatCount="indefinite" path="
                M 130 600 
                L 130 420 
                L 130 260 
                L 130 110 
                L 500 110 
                L 870 110 
                L 870 330 
                L 870 420 
                L 870 600
              "/>
            </circle>

            <!-- Direction Arrows along U Flow -->
            <path d="M 130 480 L 125 490 L 135 490 Z" fill="#3b82f6"/>
            <path d="M 130 330 L 125 340 L 135 340 Z" fill="#3b82f6"/>
            <path d="M 130 180 L 125 190 L 135 190 Z" fill="#10b981"/>
            <path d="M 300 110 L 290 105 L 290 115 Z" fill="#f59e0b"/>
            <path d="M 680 110 L 670 105 L 670 115 Z" fill="#f59e0b"/>
            <path d="M 870 220 L 865 210 L 875 210 Z" fill="#ef4444"/>
            <path d="M 870 380 L 865 370 L 875 370 Z" fill="#ef4444"/>

            <!-- Supplier Truck Graphic (Left Dock) -->
            <g transform="translate(40, 530)">
              <rect width="160" height="90" fill="#1e293b" stroke="#3b82f6" stroke-width="2" rx="6"/>
              <rect x="110" y="10" width="40" height="70" fill="#3b82f6" rx="4"/>
              <text x="50" y="45" fill="#ffffff" font-size="10" font-weight="bold">PROVEEDOR</text>
              <text x="50" y="60" fill="#93c5fd" font-size="8">GALEANO</text>
              <!-- Unloading boxes -->
              <rect x="5" y="15" width="18" height="18" fill="#d97706" rx="2"/>
              <rect x="5" y="40" width="18" height="18" fill="#475569" rx="2"/>
            </g>

            <!-- Dispatch Truck Graphic (Right Dock) -->
            <g transform="translate(800, 530)">
              <rect width="160" height="90" fill="#1e293b" stroke="#ef4444" stroke-width="2" rx="6"/>
              <rect x="10" y="10" width="40" height="70" fill="#ef4444" rx="4"/>
              <text x="110" y="45" fill="#ffffff" font-size="10" font-weight="bold" text-anchor="end">DESPACHO</text>
              <text x="110" y="60" fill="#fca5a5" font-size="8" text-anchor="end">CLIENTES</text>
              <!-- Order package loaded -->
              <rect x="135" y="25" width="20" height="20" fill="#10b981" rx="2"/>
            </g>
          </svg>

          <!-- INTERACTIVE ZONE OVERLAY CONTAINERS -->
          <div class="zones-interactive-layer" id="zonesInteractiveLayer">
            ${this.renderZoneInteractiveCards()}
          </div>
        </div>

        <!-- 2D CONTROLS BAR -->
        <div class="view-2d-toolbar">
          <div class="filter-group">
            <span class="toolbar-label"><i data-lucide="filter"></i> Filtrar Vista:</span>
            <button class="btn-chip active" data-filter="all">Todas las Zonas (16)</button>
            <button class="btn-chip" data-filter="Inbound">Entrada / Recepción</button>
            <button class="btn-chip" data-filter="Quality">Inspección de Calidad</button>
            <button class="btn-chip" data-filter="Storage">Almacenamiento</button>
            <button class="btn-chip" data-filter="Outbound">Preparación & Despacho</button>
          </div>
          <div class="flow-toggle">
            <label class="switch-label">
              <input type="checkbox" id="toggleFlow2d" checked />
              <span class="switch-custom"></span>
              <span class="label-text">Ver Trayectoria Flujo en U</span>
            </label>
          </div>
        </div>
      </div>
    `;

    this.attachEvents();
  }

  renderZoneInteractiveCards() {
    return ZONES.map(zone => {
      const { id, code, shortName, isMandatoryHighlight, category, position2d, icon } = zone;
      const isMandatory = isMandatoryHighlight ? 'mandatory-highlight' : '';

      return `
        <div class="zone-card-2d ${category.toLowerCase()} ${isMandatory}" 
             id="zone-card-${id}"
             data-zone-id="${id}"
             style="
               left: ${position2d.x}%; 
               top: ${position2d.y}%; 
               width: ${position2d.w}%; 
               height: ${position2d.h}%;
             ">
          <div class="zone-card-header">
            <span class="zone-code">${code}</span>
            <i class="zone-icon" data-lucide="${icon}"></i>
          </div>
          <div class="zone-card-body">
            <div class="zone-title">${shortName}</div>
            ${id === 3 ? `
              <div class="inspection-badges">
                <span class="tag-ok">✓ Conforme</span>
                <span class="tag-warn">⚠ Novedad</span>
              </div>
            ` : ''}
            ${id === 5 ? `
              <div class="sectors-mini">
                <span>🚪 Puertas</span>
                <span>🗄️ Cajas</span>
                <span>🔑 Locks</span>
              </div>
            ` : ''}
          </div>
          <div class="click-ripple"></div>
        </div>
      `;
    }).join('');
  }

  attachEvents() {
    // Zone selection click events
    const zoneCards = this.container.querySelectorAll('.zone-card-2d');
    zoneCards.forEach(card => {
      card.addEventListener('click', () => {
        const zoneId = parseInt(card.getAttribute('data-zone-id'));
        this.selectZone(zoneId);
        if (this.onZoneSelect) {
          this.onZoneSelect(zoneId);
        }
      });
    });

    // Filter Buttons
    const filterBtns = this.container.querySelectorAll('.btn-chip');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filterCategory = btn.getAttribute('data-filter');
        this.applyFilter(filterCategory);
      });
    });

    // Flow Toggle
    const flowToggle = this.container.querySelector('#toggleFlow2d');
    if (flowToggle) {
      flowToggle.addEventListener('change', (e) => {
        const path = this.container.querySelector('#uFlowPath');
        const particle = this.container.querySelector('#flowParticle');
        if (path && particle) {
          path.style.display = e.target.checked ? 'block' : 'none';
          particle.style.display = e.target.checked ? 'block' : 'none';
        }
      });
    }
  }

  selectZone(zoneId) {
    this.selectedZoneId = zoneId;
    const cards = this.container.querySelectorAll('.zone-card-2d');
    cards.forEach(card => {
      const cardId = parseInt(card.getAttribute('data-zone-id'));
      if (cardId === zoneId) {
        card.classList.add('selected');
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        card.classList.remove('selected');
      }
    });
  }

  applyFilter(category) {
    const cards = this.container.querySelectorAll('.zone-card-2d');
    cards.forEach(card => {
      const zoneId = parseInt(card.getAttribute('data-zone-id'));
      const zone = ZONES.find(z => z.id === zoneId);
      if (category === 'all' || (zone && zone.category === category)) {
        card.style.opacity = '1';
        card.style.pointerEvents = 'auto';
        card.style.transform = 'scale(1)';
      } else {
        card.style.opacity = '0.2';
        card.style.pointerEvents = 'none';
        card.style.transform = 'scale(0.95)';
      }
    });
  }
}
