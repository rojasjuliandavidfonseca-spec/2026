/**
 * JavaScript Unificado Rediseñado — Bodega PROTECSA JSD S.A.S. (20 m x 12 m)
 * Incluye Personas 3D en todas las estaciones y función de descarga directa en un solo archivo.
 */

// ==========================================
// 1. INFORMACIÓN Y BASE DE DATOS DE PROTECSA JSD
// ==========================================

const COMPANY_INFO = {
  name: "PROTECSA JSD S.A.S.",
  tagline: "Distribución y Comercialización de Productos de Seguridad",
  location: "Bogotá, Colombia",
  supplierDoors: "Blindajes y Seguridad Galeano",
  dimensions: "20.0 m (Profundidad) x 12.0 m (Ancho) • Área: 240 m²",
  flowType: "Distribución en U (Entrada Proveedor y Salida Despacho en el mismo frente)"
};

const PRODUCTS = {
  DOORS: {
    id: "doors",
    name: "Puertas de Seguridad",
    supplier: "Blindajes y Seguridad Galeano",
    category: "Alta prioridad / Voluminoso",
    finishes: [
      { id: "PDS01", name: "PDS01 — Café Madera Mate", color: "#653b1b", hex: 0x653b1b, desc: "Textura madera mate noble acorazada." },
      { id: "PDS02", name: "PDS02 — Gris Texturizado", color: "#4b5563", hex: 0x4b5563, desc: "Acabado metálico grafito texturizado." },
      { id: "PDS03", name: "PDS03 — Blanco Brillante", color: "#f8fafc", hex: 0xf8fafc, desc: "Esmalte blanco de alta resistencia e iluminación." }
    ],
    description: "Puertas acorazadas de alta resistencia con marcos de acero, pivotes reforzados y cerraduras multipunto."
  },
  SAFES: {
    id: "safes",
    name: "Cajas Fuertes",
    category: "Productos Pesados",
    sizes: [
      { name: "Pequeña (Valores)", size: 0.8, color: 0x334155 },
      { name: "Mediana (Oficina)", size: 1.2, color: 0x1e293b },
      { name: "Grande (Bancaria / Comercial)", size: 1.6, color: 0x0f172a }
    ],
    description: "Cajas metálicas de alta seguridad resistentes a impactos y ataques térmicos. Almacenadas en posiciones bajas por peso."
  },
  SMART_LOCKS: {
    id: "locks",
    name: "Cerraduras Inteligentes",
    category: "Alta Rotación",
    types: ["Biométrica (Huella)", "Teclado Digital / RFID", "Wi-Fi / App Móvil"],
    description: "Cerraduras electrónicas de vanguardia empacadas en cajas pequeñas organizadas en estanterías metálicas."
  }
};

const ZONES = [
  {
    id: 1,
    code: "Z-01",
    name: "Entrada / Carga y Descarga",
    shortName: "Carga y Descarga",
    category: "Inbound",
    icon: "truck",
    position2d: { x: 4, y: 70, w: 20, h: 26 },
    position3d: { x: -18, y: 0, z: 18 },
    description: "Recepción física de mercancía proveniente del proveedor 'Blindajes y Seguridad Galeano'.",
    whatIsDone: "El camión del proveedor se estaciona en el portón izquierdo exterior. Operarios descargan pallets con puertas PDS01, PDS02, PDS03, cajas fuertes y cerraduras inteligentes utilizando transpaletas.",
    importance: "Punto inicial del flujo en U. Transfiere la custodia física de la mercancía hacia la bodega de PROTECSA JSD.",
    productsPresent: ["Puertas de Seguridad (Galeano)", "Cajas Fuertes", "Cajas de Cerraduras Inteligentes"],
    workerActivity: "Descarga de camión con transpaleta manual y acomodación inicial en berma."
  },
  {
    id: 2,
    code: "Z-02",
    name: "Recepción de Mercancía",
    shortName: "Recepción",
    category: "Inbound",
    icon: "file-check",
    position2d: { x: 4, y: 48, w: 20, h: 19 },
    position3d: { x: -18, y: 0, z: 9 },
    description: "Verificación de cantidades, referencias y documentación técnica contra orden de compra.",
    whatIsDone: "Un auxiliar logístico en su puesto de trabajo de madera con computador WMS y lector óptico de código de barras coteja la remisión del proveedor 'Galeano'.",
    importance: "Evita inconsistencias en el sistema de inventario ERP antes del almacenamiento definitivo.",
    productsPresent: ["Remisión de compra", "Lector óptico de código de barras", "Cajas en proceso de recibo"],
    workerActivity: "Escaneo de códigos de producto y digitación de cantidades en el sistema WMS."
  },
  {
    id: 3,
    code: "Z-03",
    name: "Inspección de Calidad",
    shortName: "Inspección Calidad",
    category: "Quality",
    isMandatoryHighlight: true,
    icon: "search",
    position2d: { x: 4, y: 24, w: 24, h: 21 },
    position3d: { x: -18, y: 0, z: -2 },
    description: "OBLIGATORIA: Inspección técnica minuciosa del estado físico de las puertas, cajas y cerraduras.",
    whatIsDone: "Un inspector examina la pintura (madera, gris, blanco) de las puertas acorazadas, probando pasadores y teclados biométricos sobre la mesa de trabajo de acero con herramientas de precisión.",
    importance: "Garantiza que ningún producto con golpes, rayones o defectos de fábrica ingrese al stock de venta.",
    outcomes: [
      { status: "✓ CONFORME", text: "El producto pasa inmediatamente a Clasificación y Almacenamiento.", class: "success" },
      { status: "⚠ CON NOVEDAD", text: "El producto se aísla a la Zona de Devoluciones para reclamación al proveedor.", class: "warning" }
    ],
    productsPresent: ["Puerta PDS01 en mesa de prueba", "Caja fuerte en revisión", "Cerradura biométrica con lupa"],
    workerActivity: "Inspección de acabados, pruebas mecánicas de cerraduras y estampado de sello de aprobación."
  },
  {
    id: 4,
    code: "Z-04",
    name: "Clasificación de Mercancía",
    shortName: "Clasificación",
    category: "Inbound",
    icon: "boxes",
    position2d: { x: 4, y: 4, w: 24, h: 18 },
    position3d: { x: -18, y: 0, z: -12 },
    description: "Separación y agrupación de artículos en las 3 familias de productos de seguridad.",
    whatIsDone: "Se organizan los ítems aprobados en 3 grupos: Puertas de Seguridad, Cajas Fuertes y Cerraduras Inteligentes.",
    importance: "Optimiza la logística interna asignando el pasillo y rack adecuado según volumen y peso.",
    productsPresent: ["Lotes de puertas separadas", "Pallets de cajas fuertes", "Cajas clasificadas por SKU"],
    workerActivity: "Etiquetado con ubicación de pasillo y transporte a zona de almacenamiento."
  },
  {
    id: 5,
    code: "Z-05",
    name: "Zona Principal de Almacenamiento",
    shortName: "Almacenamiento General",
    category: "Storage",
    icon: "warehouse",
    position2d: { x: 32, y: 4, w: 44, h: 50 },
    position3d: { x: 0, y: 0, z: -8 },
    description: "Zona central y posterior más grande de la bodega. Dividida rigurosamente en 3 sectores especializados.",
    whatIsDone: "Resguardo ordenado en estanterías pesadas con pasillos libres de 2.5m de ancho demarcados en amarillo.",
    importance: "Aprovecha la capacidad volumétrica y resguarda el inventario disponible para la comercialización.",
    subSectors: [
      { name: "Sector A: Puertas de Seguridad", desc: "Soportes verticales para puertas PDS01 (madera), PDS02 (gris) y PDS03 (blanco)." },
      { name: "Sector B: Cajas Fuertes", desc: "Cajas metálicas pequeñas, medianas y grandes en posiciones bajas por seguridad física." },
      { name: "Sector C: Cerraduras Inteligentes", desc: "Estanterías metálicas azul/gris con cajas etiquetadas de alta rotación." }
    ],
    workerActivity: "Mantenimiento de pasillos despejados y reubicación de inventario con montacargas/transpaleta."
  },
  {
    id: 6,
    code: "Z-06",
    name: "Zona de Alta Rotación",
    shortName: "Alta Rotación",
    category: "Storage",
    icon: "zap",
    position2d: { x: 44, y: 58, w: 22, h: 16 },
    position3d: { x: 6, y: 0, z: 8 },
    description: "Ubicación estratégica de los productos con mayor frecuencia de salida.",
    whatIsDone: "Conserva las cerraduras inteligentes más vendidas y las referencias estándar de puertas de seguridad.",
    importance: "Disminuye las caminatas del personal de picking, acelerando el despacho de pedidos.",
    productsPresent: ["Cerraduras Biométricas Top Ventas", "Puertas PDS01 estándar"],
    workerActivity: "Reposición constante desde el almacenamiento masivo posterior."
  },
  {
    id: 7,
    code: "Z-07",
    name: "Zona de Baja Rotación",
    shortName: "Baja Rotación",
    category: "Storage",
    icon: "clock",
    position2d: { x: 38, y: 6, w: 18, h: 16 },
    position3d: { x: 2, y: 0, z: -18 },
    description: "Almacenamiento de referencias de baja frecuencia o pedidos especiales.",
    whatIsDone: "Resguarda cajas fuertes bancarias de gran tonelaje y puertas de dimensiones no estándar.",
    importance: "Evita la congestión en las zonas de flujo rápido cerca al frente del local.",
    productsPresent: ["Cajas Fuertes Grado Bancario", "Puertas de Medida Especial"],
    workerActivity: "Conteo físico y auditoría de inventario inmovilizado."
  },
  {
    id: 8,
    code: "Z-08",
    name: "Pasillos y Circulación de Seguridad",
    shortName: "Pasillos de Circulación",
    category: "Safety",
    icon: "footprints",
    position2d: { x: 32, y: 31, w: 44, h: 8 },
    position3d: { x: 0, y: 0, z: 0 },
    description: "Pasillos principales de 2.5m marcados en pintura industrial epóxica amarilla.",
    whatIsDone: "Rutas despejadas que conectan la recepción con el almacenamiento y la preparación de pedidos.",
    importance: "Cumple con las normas del SENA y ARL, previniendo choques entre operarios y equipos de carga.",
    productsPresent: ["Franjas de pintura amarilla", "Flechas de dirección de flujo en U"],
    workerActivity: "Tránsito seguro respetando las zonas delimitadas."
  },
  {
    id: 9,
    code: "Z-09",
    name: "Preparación de Pedidos (Picking)",
    shortName: "Preparación Pedidos",
    category: "Outbound",
    icon: "shopping-bag",
    position2d: { x: 78, y: 44, w: 18, h: 18 },
    position3d: { x: 18, y: 0, z: 6 },
    description: "Selección y consolidación de las referencias solicitadas por los clientes.",
    whatIsDone: "El operario recolecta las puertas, cajas o cerraduras requeridas en la orden del día usando una tablet WMS.",
    importance: "Garantiza la exactitud en el despacho de artículos comprados.",
    productsPresent: ["Mesa de consolidación", "Tablet WMS", "Pedido de cliente impreso"],
    workerActivity: "Surtido e inspección visual de código de producto del pedido cliente."
  },
  {
    id: 10,
    code: "Z-10",
    name: "Zona de Embalaje",
    shortName: "Embalaje",
    category: "Outbound",
    icon: "package-check",
    position2d: { x: 78, y: 64, w: 18, h: 14 },
    position3d: { x: 18, y: 0, z: 12 },
    description: "Protección física de los productos de seguridad antes de su envío.",
    whatIsDone: "Mesa de empaque con rollos de plástico stretch film vinipel, esquineros de cartón prensado y cinta marcada 'FRÁGIL'.",
    importance: "Evita ralladuras en la pintura acorazada de puertas y golpes en las cajas fuertes durante el transporte.",
    productsPresent: ["Rollos vinipel", "Esquineros de cartón", "Cinta de seguridad"],
    workerActivity: "Envoltorio de productos y sellado con materiales de protección."
  },
  {
    id: 11,
    code: "Z-11",
    name: "Expedición / Despacho",
    shortName: "Expedición",
    category: "Outbound",
    icon: "truck-shipping",
    position2d: { x: 78, y: 80, w: 18, h: 16 },
    position3d: { x: 18, y: 0, z: 18 },
    description: "Consolidación de pedidos terminados y embarque en el camión de distribución.",
    whatIsDone: "Ubicada en el frente derecho. El camión de despacho de PROTECSA aguarda afuera en el portón derecho mientras se efectúa la carga.",
    importance: "Punto final de salida de mercancía hacia los clientes en Bogotá o agencias de transporte.",
    productsPresent: ["Pallets de clientes embalados", "Camión de despacho exterior"],
    workerActivity: "Carga de pedidos embalados en el camión de reparto a cliente."
  },
  {
    id: 12,
    code: "Z-12",
    name: "Control de Salida",
    shortName: "Control de Salida",
    category: "Outbound",
    icon: "clipboard-check",
    position2d: { x: 58, y: 80, w: 18, h: 14 },
    position3d: { x: 10, y: 0, z: 18 },
    description: "Auditoría previa a la salida del vehículo de reparto.",
    whatIsDone: "Un auditor escanéa la remisión final y comprueba que la mercancía cargada coincida exactamente con la factura de venta.",
    importance: "Elimina despachos erróneos y asegura la firma del manifiesto de carga.",
    productsPresent: ["Módulo de escaneo", "Factura de venta", "Sello de 'VERIFICADO'"],
    workerActivity: "Auditoría de manifiesto de despacho y entrega de documentos al conductor."
  },
  {
    id: 13,
    code: "Z-13",
    name: "Zona de Devoluciones / Novedades",
    shortName: "Devoluciones",
    category: "Quality",
    icon: "alert-triangle",
    position2d: { x: 1, y: 24, w: 2.5, h: 20 },
    position3d: { x: -24, y: 0, z: -2 },
    description: "Aislamiento físico de productos con defectos o rechazados en inspección de calidad.",
    whatIsDone: "Malla y demarcación con franjas amarillas/negras donde reposan artículos devueltos a la espera de gestión con el proveedor 'Galeano'.",
    importance: "Impide la contaminación accidental del stock disponible para comercializar.",
    productsPresent: ["Caja marcada RETENIDO", "Puerta con golpe reportado"],
    workerActivity: "Elaboración de informe técnico de garantía al proveedor."
  },
  {
    id: 14,
    code: "Z-14",
    name: "Stock de Material de Embalaje",
    shortName: "Material Embalaje",
    category: "Outbound",
    icon: "package",
    position2d: { x: 97, y: 64, w: 2, h: 14 },
    position3d: { x: 24, y: 0, z: 12 },
    description: "Almacenamiento secundario de insumos de protección y cajas.",
    whatIsDone: "Estantería con cajas de cartón plegadas, bobinas de vinipel y esquineros de repuesto.",
    importance: "Abastecimiento continuo a la mesa de embalaje sin retrasar despachos.",
    productsPresent: ["Bobinas de plástico", "Cajas de cartón vacías"],
    workerActivity: "Suministro de insumos a la estación de empaque."
  },
  {
    id: 15,
    code: "Z-15",
    name: "Oficina de Administración y Control",
    shortName: "Oficina Administración",
    category: "Admin",
    icon: "building-2",
    position2d: { x: 79, y: 4, w: 18, h: 22 },
    position3d: { x: 20, y: 0, z: -15 },
    description: "Módulo administrativo elevado con paredes de cristal panorámicas hacia la bodega.",
    whatIsDone: "Escritorios con computadores ERP/WMS para control de inventarios, compras y facturación.",
    importance: "Centro de comando para la gestión comercial y logística del negocio.",
    productsPresent: ["Escritorios", "Sillas ergonómicas", "Monitores WMS"],
    workerActivity: "Planificación de compras, gestión de rutas de despacho y facturación."
  },
  {
    id: 16,
    code: "Z-16",
    name: "Señalización e Incendios (SENA)",
    shortName: "Seguridad Industrial",
    category: "Safety",
    icon: "shield-alert",
    position2d: { x: 1, y: 4, w: 2.5, h: 17 },
    position3d: { x: -24, y: 0, z: -15 },
    description: "Equipos de emergencia, extintores ABC solkaflam, botiquín y rutas de evacuación.",
    whatIsDone: "Estación de seguridad con señalética física visible en muros interiores.",
    importance: "Cumplimiento con las normativas de salud ocupacional y bioseguridad del SENA.",
    productsPresent: ["Extintores ABC", "Botiquín APH", "Señal de Salida de Emergencia"],
    workerActivity: "Monitoreo de bioseguridad y prevención de riesgos laborales."
  }
];

const U_FLOW_STEPS = [
  { step: 1, zoneId: 1, title: "1. Camión Proveedor (Galeano)", desc: "Entrada del vehículo en el portón izquierdo exterior." },
  { step: 2, zoneId: 2, title: "2. Recepción de Mercancía", desc: "Cotejo documental de remisiones e ingreso al WMS." },
  { step: 3, zoneId: 3, title: "3. Inspección de Calidad", desc: "Revisión física técnica (✓ Conforme / ⚠ Novedad)." },
  { step: 4, zoneId: 4, title: "4. Clasificación", desc: "Separación en Puertas, Cajas Fuertes y Cerraduras." },
  { step: 5, zoneId: 5, title: "5. Almacenamiento Puertas", desc: "Ubicación en racks verticales (PDS01, PDS02, PDS03)." },
  { step: 6, zoneId: 5, title: "6. Almacenamiento Cajas Fuertes", desc: "Ubicación en posiciones bajas por tonelaje y peso." },
  { step: 7, zoneId: 5, title: "7. Almacenamiento Cerraduras", desc: "Estanterías de alta rotación multinivel." },
  { step: 8, zoneId: 9, title: "8. Preparación de Pedidos", desc: "Picking y recolección de productos del pedido cliente." },
  { step: 9, zoneId: 10, title: "9. Embalaje de Protección", desc: "Envoltorio con vinipel y esquineros de protección." },
  { step: 10, zoneId: 12, title: "10. Control de Salida", desc: "Auditoría de remisiones y sello de verificación." },
  { step: 11, zoneId: 11, title: "11. Expedición y Despacho", desc: "Embarque en el camión de distribución a clientes." },
  { step: 12, zoneId: 11, title: "12. Camión de Despacho Cliente", desc: "Salida del camión del portón derecho hacia su destino." }
];

// ==========================================
// 2. COMPONENTE PLANO ARQUITECTÓNICO 2D
// ==========================================

class View2D {
  constructor(containerId, onZoneSelect) {
    this.container = document.getElementById(containerId);
    this.onZoneSelect = onZoneSelect;
    this.selectedZoneId = null;
    this.render();
  }

  render() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="view-2d-wrapper">
        <div class="view-2d-header">
          <div class="badge-tag gold"><i data-lucide="compass"></i> PLANO ARQUITECTÓNICO TÉCNICO (2D) — BODEGA 20.0 m x 12.0 m</div>
          <h2>Plano Completo de Distribución en U de la Bodega</h2>
          <p>PROTECSA JSD S.A.S. — Portón Carga Proveedor (Izq.) y Portón Despacho Cliente (Der.)</p>
        </div>

        <div class="view-2d-canvas-container">
          <svg class="warehouse-svg" viewBox="0 0 1000 650" preserveAspectRatio="xMidYMid meet">
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255, 255, 255, 0.04)" stroke-width="1"/>
              </pattern>

              <pattern id="hatch" width="10" height="10" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                <line x1="0" y1="0" x2="0" y2="10" stroke="#475569" stroke-width="2"/>
              </pattern>
              
              <linearGradient id="uFlowGrad" x1="0%" y1="100%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#3b82f6" />
                <stop offset="30%" stop-color="#10b981" />
                <stop offset="60%" stop-color="#f59e0b" />
                <stop offset="100%" stop-color="#ef4444" />
              </linearGradient>

              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <rect width="1000" height="650" fill="#0f172a" rx="12"/>
            <rect width="1000" height="650" fill="url(#grid)" rx="12"/>

            <!-- ARCHITECTURAL DIMENSION LINES -->
            <line x1="50" y1="16" x2="950" y2="16" stroke="#d4af37" stroke-width="1.5" stroke-dasharray="4 4"/>
            <line x1="50" y1="8" x2="50" y2="24" stroke="#d4af37" stroke-width="2"/>
            <line x1="950" y1="8" x2="950" y2="24" stroke="#d4af37" stroke-width="2"/>
            <rect x="400" y="6" width="200" height="20" fill="#0f172a" stroke="#d4af37" rx="4"/>
            <text x="500" y="20" fill="#d4af37" font-size="11" font-weight="bold" text-anchor="middle">PROFUNDIDAD BODEGA: 20.0 METROS</text>

            <line x1="16" y1="35" x2="16" y2="475" stroke="#d4af37" stroke-width="1.5" stroke-dasharray="4 4"/>
            <line x1="8" y1="35" x2="24" y2="35" stroke="#d4af37" stroke-width="2"/>
            <line x1="8" y1="475" x2="24" y2="475" stroke="#d4af37" stroke-width="2"/>
            <text x="12" y="255" fill="#d4af37" font-size="11" font-weight="bold" text-anchor="middle" transform="rotate(-90 12 255)">ANCHO: 12.0 METROS</text>

            <rect x="35" y="30" width="930" height="450" fill="none" stroke="url(#hatch)" stroke-width="14" rx="4"/>
            <rect x="35" y="30" width="930" height="450" fill="none" stroke="#64748b" stroke-width="2" rx="4"/>

            <rect x="35" y="30" width="16" height="16" fill="#334155" stroke="#94a3b8"/>
            <rect x="265" y="30" width="16" height="16" fill="#334155" stroke="#94a3b8"/>
            <rect x="495" y="30" width="16" height="16" fill="#334155" stroke="#94a3b8"/>
            <rect x="725" y="30" width="16" height="16" fill="#334155" stroke="#94a3b8"/>
            <rect x="949" y="30" width="16" height="16" fill="#334155" stroke="#94a3b8"/>

            <rect x="35" y="464" width="16" height="16" fill="#334155" stroke="#94a3b8"/>
            <rect x="265" y="464" width="16" height="16" fill="#334155" stroke="#94a3b8"/>
            <rect x="495" y="464" width="16" height="16" fill="#334155" stroke="#94a3b8"/>
            <rect x="725" y="464" width="16" height="16" fill="#334155" stroke="#94a3b8"/>
            <rect x="949" y="464" width="16" height="16" fill="#334155" stroke="#94a3b8"/>

            <rect x="55" y="468" width="160" height="16" fill="#0f172a"/>
            <line x1="55" y1="480" x2="215" y2="480" stroke="#3b82f6" stroke-width="6"/>
            <text x="135" y="462" fill="#3b82f6" font-size="10" font-weight="bold" text-anchor="middle">PORTÓN CARGA (PROVEEDOR)</text>

            <rect x="445" y="468" width="110" height="16" fill="#0f172a"/>
            <line x1="445" y1="480" x2="555" y2="480" stroke="#10b981" stroke-width="4"/>
            <text x="500" y="462" fill="#10b981" font-size="9" font-weight="bold" text-anchor="middle">PUERTA PEATONAL</text>

            <rect x="785" y="468" width="160" height="16" fill="#0f172a"/>
            <line x1="785" y1="480" x2="945" y2="480" stroke="#ef4444" stroke-width="6"/>
            <text x="865" y="462" fill="#ef4444" font-size="10" font-weight="bold" text-anchor="middle">PORTÓN DESPACHO (CLIENTES)</text>

            <rect x="50" y="500" width="170" height="135" fill="rgba(59, 130, 246, 0.05)" stroke="#3b82f6" stroke-dasharray="4 4" rx="8"/>
            <text x="135" y="625" fill="#93c5fd" font-size="10" font-weight="600" text-anchor="middle">BERMA PROVEEDOR GALEANO</text>

            <rect x="780" y="500" width="170" height="135" fill="rgba(239, 68, 68, 0.05)" stroke="#ef4444" stroke-dasharray="4 4" rx="8"/>
            <text x="865" y="625" fill="#fca5a5" font-size="10" font-weight="600" text-anchor="middle">BERMA DESPACHO CLIENTES</text>

            <rect x="250" y="235" width="500" height="50" fill="rgba(245, 158, 11, 0.08)" stroke="#f59e0b" stroke-dasharray="6 6" rx="4"/>
            <text x="500" y="265" text-anchor="middle" fill="#fbbf24" font-size="11" font-weight="bold">PASILLO DE CIRCULACIÓN DE SEGURIDAD (ANCHO 2.5 METROS)</text>

            <path id="uFlowPath" d="
              M 135 580 
              L 135 410 
              L 135 260 
              L 135 90 
              L 500 90 
              L 865 90 
              L 865 310 
              L 865 410 
              L 865 580
            " fill="none" stroke="url(#uFlowGrad)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" filter="url(#glow)"/>

            <circle id="flowParticle" r="8" fill="#f59e0b" filter="url(#glow)">
              <animateMotion dur="8s" repeatCount="indefinite" path="
                M 135 580 
                L 135 410 
                L 135 260 
                L 135 90 
                L 500 90 
                L 865 90 
                L 865 310 
                L 865 410 
                L 865 580
              "/>
            </circle>

            <g transform="translate(60, 510)">
              <rect width="140" height="80" fill="#1e293b" stroke="#3b82f6" stroke-width="2" rx="6"/>
              <rect x="95" y="8" width="40" height="64" fill="#3b82f6" rx="4"/>
              <text x="45" y="40" fill="#ffffff" font-size="9" font-weight="bold">PROVEEDOR</text>
              <text x="45" y="53" fill="#93c5fd" font-size="8">GALEANO</text>
              <rect x="8" y="12" width="18" height="18" fill="#d97706" rx="2"/>
              <rect x="8" y="40" width="18" height="18" fill="#475569" rx="2"/>
            </g>

            <g transform="translate(795, 510)">
              <rect width="140" height="80" fill="#1e293b" stroke="#ef4444" stroke-width="2" rx="6"/>
              <rect x="5" y="8" width="40" height="64" fill="#ef4444" rx="4"/>
              <text x="95" y="40" fill="#ffffff" font-size="9" font-weight="bold" text-anchor="end">DESPACHO</text>
              <text x="95" y="53" fill="#fca5a5" font-size="8" text-anchor="end">PROTECSA</text>
              <rect x="114" y="22" width="20" height="20" fill="#10b981" rx="2"/>
            </g>
          </svg>

          <div class="zones-interactive-layer" id="zonesInteractiveLayer">
            ${this.renderZoneInteractiveCards()}
          </div>
        </div>

        <div class="view-2d-toolbar">
          <div class="filter-group">
            <span class="toolbar-label"><i data-lucide="filter"></i> Filtrar Vista:</span>
            <button class="btn-chip active" data-filter="all">Todas las Zonas (16)</button>
            <button class="btn-chip" data-filter="Inbound">Entrada / Recepción</button>
            <button class="btn-chip" data-filter="Quality">Inspección Calidad</button>
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
                <span>🚪 Puertas (PDS01-03)</span>
                <span>🗄️ Cajas Fuertes</span>
                <span>🔑 Locks Smart</span>
              </div>
            ` : ''}
          </div>
        </div>
      `;
    }).join('');
  }

  attachEvents() {
    const zoneCards = this.container.querySelectorAll('.zone-card-2d');
    zoneCards.forEach(card => {
      card.addEventListener('click', () => {
        const zoneId = parseInt(card.getAttribute('data-zone-id'));
        this.selectZone(zoneId);
        if (this.onZoneSelect) this.onZoneSelect(zoneId);
      });
    });

    const filterBtns = this.container.querySelectorAll('.btn-chip');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filterCategory = btn.getAttribute('data-filter');
        this.applyFilter(filterCategory);
      });
    });

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

// ==========================================
// 3. COMPONENTE BODEGA 3D (PERSONAS 3D Y EDIFICIO CERRADO)
// ==========================================

class View3D {
  constructor(containerId, onZoneSelect) {
    this.container = document.getElementById(containerId);
    this.onZoneSelect = onZoneSelect;
    this.zoneMeshes = new Map();
    this.tourActive = false;
    this.tourIndex = 0;
    this.packageAnimTime = 0;

    this.initScene();
    this.buildWarehouseArchitecture();
    this.buildZones3D();
    this.buildUFlowPath3D();
    this.setupEvents();
    this.animate();
  }

  initScene() {
    if (!window.THREE) return;

    this.width = this.container.clientWidth || window.innerWidth;
    this.height = this.container.clientHeight || (window.innerHeight - 150);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.container.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0b1329);
    this.scene.fog = new THREE.FogExp2(0x0b1329, 0.005);

    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.5, 300);
    this.camera.position.set(0, 48, 65);

    const OrbitControlsClass = THREE.OrbitControls || window.OrbitControls;
    if (OrbitControlsClass) {
      this.controls = new OrbitControlsClass(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.05;
      this.controls.maxPolarAngle = Math.PI / 2 - 0.02;
      this.controls.target.set(0, 2, 0);
    }

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
    this.scene.add(ambientLight);

    const mainSunLight = new THREE.DirectionalLight(0xfff5ea, 2.2);
    mainSunLight.position.set(30, 55, 25);
    mainSunLight.castShadow = true;
    mainSunLight.shadow.mapSize.width = 2048;
    mainSunLight.shadow.mapSize.height = 2048;
    this.scene.add(mainSunLight);

    [-18, 0, 18].forEach(posX => {
      [-15, -5, 5, 15].forEach(posZ => {
        const ledSpot = new THREE.SpotLight(0xffffff, 1.8, 45, Math.PI / 3, 0.4);
        ledSpot.position.set(posX, 14, posZ);
        this.scene.add(ledSpot);
      });
    });

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
  }

  buildWarehouseArchitecture() {
    const floorGeo = new THREE.PlaneGeometry(60, 50);
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.25, metalness: 0.3 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.scene.add(floor);

    const stripeGeo = new THREE.PlaneGeometry(48, 4.5);
    const stripeMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b, opacity: 0.7, transparent: true });
    const stripe = new THREE.Mesh(stripeGeo, stripeMat);
    stripe.rotation.x = -Math.PI / 2;
    stripe.position.set(0, 0.02, 0);
    this.scene.add(stripe);

    const wallMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.6, metalness: 0.4, side: THREE.DoubleSide });

    const backWall = new THREE.Mesh(new THREE.PlaneGeometry(60, 16), wallMat);
    backWall.position.set(0, 8, -25);
    this.scene.add(backWall);

    const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(50, 16), wallMat);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.position.set(-30, 8, 0);
    this.scene.add(leftWall);

    const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(50, 16), wallMat);
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.position.set(30, 8, 0);
    this.scene.add(rightWall);

    const frontWallMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5 });
    const frontWallLeft = new THREE.Mesh(new THREE.PlaneGeometry(16, 16), frontWallMat);
    frontWallLeft.position.set(-22, 8, 25);
    this.scene.add(frontWallLeft);

    const frontWallCenter = new THREE.Mesh(new THREE.PlaneGeometry(16, 16), frontWallMat);
    frontWallCenter.position.set(0, 8, 25);
    this.scene.add(frontWallCenter);

    const frontWallRight = new THREE.Mesh(new THREE.PlaneGeometry(16, 16), frontWallMat);
    frontWallRight.position.set(22, 8, 25);
    this.scene.add(frontWallRight);

    const bannerGeo = new THREE.BoxGeometry(60, 2, 0.4);
    const bannerMat = new THREE.MeshStandardMaterial({ color: 0x0b192c, metalness: 0.8 });
    const banner = new THREE.Mesh(bannerGeo, bannerMat);
    banner.position.set(0, 15, 25);
    this.scene.add(banner);

    const ceilingGeo = new THREE.PlaneGeometry(60, 50);
    const ceilingMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, side: THREE.DoubleSide });
    const ceiling = new THREE.Mesh(ceilingGeo, ceilingMat);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.y = 16;
    this.scene.add(ceiling);

    const trussMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.9, roughness: 0.2 });
    for (let z = -20; z <= 20; z += 10) {
      const beam = new THREE.Mesh(new THREE.BoxGeometry(60, 0.6, 0.6), trussMat);
      beam.position.set(0, 15.5, z);
      this.scene.add(beam);
    }

    this.buildTruck(-22, 0, 32, 0x3b82f6, "PROVEEDOR GALEANO");
    this.buildTruck(22, 0, 32, 0xef4444, "DESPACHO PROTECSA");
    this.buildOffice(22, 0, -18);
  }

  buildTruck(x, y, z, colorHex, labelText) {
    const group = new THREE.Group();
    group.position.set(x, y, z);

    const cargoGeo = new THREE.BoxGeometry(7, 5, 12);
    const cargoMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, metalness: 0.3, roughness: 0.4 });
    const cargo = new THREE.Mesh(cargoGeo, cargoMat);
    cargo.position.set(0, 3.5, 0);
    cargo.castShadow = true;
    group.add(cargo);

    const cabinGeo = new THREE.BoxGeometry(6.8, 4.5, 4);
    const cabinMat = new THREE.MeshStandardMaterial({ color: colorHex, metalness: 0.7, roughness: 0.3 });
    const cabin = new THREE.Mesh(cabinGeo, cabinMat);
    cabin.position.set(0, 3, 7.5);
    cabin.castShadow = true;
    group.add(cabin);

    const wheelGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.6, 16);
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x0f172a });
    [[-3.5, 0.8, 6], [3.5, 0.8, 6], [-3.5, 0.8, -3], [3.5, 0.8, -3]].forEach(pos => {
      const wheel = new THREE.Mesh(wheelGeo, wheelMat);
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(...pos);
      group.add(wheel);
    });

    this.scene.add(group);
  }

  buildOffice(x, y, z) {
    const group = new THREE.Group();
    group.position.set(x, y, z);

    const glassMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.35, roughness: 0.1 });
    const officeBox = new THREE.Mesh(new THREE.BoxGeometry(12, 6, 10), glassMat);
    officeBox.position.set(0, 3, 0);
    group.add(officeBox);

    const desk = new THREE.Mesh(new THREE.BoxGeometry(4, 1.2, 2), new THREE.MeshStandardMaterial({ color: 0x78350f }));
    desk.position.set(0, 1.2, 0);
    group.add(desk);

    const pc = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1, 0.15), new THREE.MeshStandardMaterial({ color: 0x0284c7 }));
    pc.position.set(0, 2.2, 0);
    group.add(pc);

    this.createWorkerMesh(group, 0, 0, -1, 0x8b5cf6);
    this.scene.add(group);
  }

  buildZones3D() {
    ZONES.forEach(zone => {
      const zoneGroup = new THREE.Group();
      const { x, y, z } = zone.position3d;
      zoneGroup.position.set(x, y, z);

      let baseColor = 0x3b82f6;
      if (zone.category === 'Quality') baseColor = 0xf59e0b;
      if (zone.category === 'Storage') baseColor = 0x10b981;
      if (zone.category === 'Outbound') baseColor = 0xef4444;
      if (zone.category === 'Admin') baseColor = 0x8b5cf6;

      const baseGeo = new THREE.BoxGeometry(10, 0.2, 8);
      const baseMat = new THREE.MeshStandardMaterial({ color: baseColor, transparent: true, opacity: 0.2, roughness: 0.4 });
      const baseMesh = new THREE.Mesh(baseGeo, baseMat);
      baseMesh.position.y = 0.1;
      baseMesh.userData = { zoneId: zone.id, isZoneTrigger: true };
      zoneGroup.add(baseMesh);

      const edges = new THREE.EdgesGeometry(baseGeo);
      const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: baseColor, linewidth: 2 }));
      line.position.y = 0.1;
      zoneGroup.add(line);

      this.populateZoneObjects(zone, zoneGroup);

      this.scene.add(zoneGroup);
      this.zoneMeshes.set(zone.id, { group: zoneGroup, baseMesh, data: zone });
    });
  }

  populateZoneObjects(zone, group) {
    const id = zone.id;

    if (id === 1) {
      this.createPallet(group, -2, 0.2, 0, [
        this.createDoorMesh(PRODUCTS.DOORS.finishes[0].hex, "PDS01 Madera"),
        this.createSafeMesh(1.2)
      ]);
      this.createWorkerMesh(group, 2, 0, 1, 0x3b82f6);
    } else if (id === 2) {
      const desk = new THREE.Mesh(new THREE.BoxGeometry(4, 1.4, 2), new THREE.MeshStandardMaterial({ color: 0x475569 }));
      desk.position.set(0, 0.7, 0);
      group.add(desk);

      const pc = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.9, 0.15), new THREE.MeshStandardMaterial({ color: 0x38bdf8 }));
      pc.position.set(0, 1.8, 0);
      group.add(pc);

      this.createWorkerMesh(group, 0, 0, 1.5, 0x3b82f6);
    } else if (id === 3) {
      const table = new THREE.Mesh(new THREE.BoxGeometry(5, 1.4, 3), new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.6 }));
      table.position.set(0, 0.7, 0);
      group.add(table);

      const sampleDoor = this.createDoorMesh(PRODUCTS.DOORS.finishes[0].hex, "PDS01");
      sampleDoor.position.set(-1.5, 0.7, 0);
      sampleDoor.rotation.y = Math.PI / 4;
      group.add(sampleDoor);

      const sampleSafe = this.createSafeMesh(1.0);
      sampleSafe.position.set(1.2, 1.4, 0);
      group.add(sampleSafe);

      this.createWorkerMesh(group, 0, 0, 2, 0xf59e0b);
      this.createFloatingTag(group, "✓ CONFORME", 0x10b981, -2.5, 4, 0);
      this.createFloatingTag(group, "⚠ CON NOVEDAD", 0xef4444, 2.5, 4, 0);
    } else if (id === 4) {
      this.createPallet(group, -3, 0.2, 0, [this.createDoorMesh(PRODUCTS.DOORS.finishes[1].hex, "PDS02 Gris")]);
      this.createPallet(group, 0, 0.2, 0, [this.createSafeMesh(1.2)]);
      this.createWorkerMesh(group, 0, 0, 2.5, 0x10b981);
    } else if (id === 5) {
      this.createStorageRack(group, -12, 0, -4, "SECTOR A: PUERTAS DE SEGURIDAD", PRODUCTS.DOORS.finishes);
      this.createStorageRack(group, 0, 0, -4, "SECTOR B: CAJAS FUERTES", null);
      this.createStorageRack(group, 12, 0, -4, "SECTOR C: CERRADURAS INTELIGENTES", null);
      this.createWorkerMesh(group, -8, 0, -1, 0x10b981);
      this.createWorkerMesh(group, 4, 0, -1, 0x10b981);
    } else if (id === 6) {
      this.createPallet(group, -2, 0.2, 0, [this.createLockBoxGroup()]);
      this.createPallet(group, 2, 0.2, 0, [this.createDoorMesh(PRODUCTS.DOORS.finishes[0].hex, "PDS01 Top")]);
      this.createWorkerMesh(group, 0, 0, 1.8, 0x10b981);
    } else if (id === 9) {
      const pickTable = new THREE.Mesh(new THREE.BoxGeometry(4, 1.4, 2.5), new THREE.MeshStandardMaterial({ color: 0x0284c7 }));
      pickTable.position.set(0, 0.7, 0);
      group.add(pickTable);
      this.createWorkerMesh(group, -1.5, 0, 1.8, 0xef4444);
    } else if (id === 10) {
      const packTable = new THREE.Mesh(new THREE.BoxGeometry(4, 1.4, 2.5), new THREE.MeshStandardMaterial({ color: 0x78350f }));
      packTable.position.set(0, 0.7, 0);
      group.add(packTable);

      const wrapCylinder = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 1.6, 16), new THREE.MeshStandardMaterial({ color: 0xf8fafc, transparent: true, opacity: 0.7 }));
      wrapCylinder.position.set(1.5, 1.8, 0);
      group.add(wrapCylinder);

      this.createWorkerMesh(group, 0, 0, 1.8, 0xef4444);
    } else if (id === 11) {
      this.createPallet(group, 0, 0.2, 0, [this.createWrappedBoxMesh()]);
      this.createWorkerMesh(group, 2, 0, 1, 0xef4444);
    } else if (id === 12) {
      const desk = new THREE.Mesh(new THREE.BoxGeometry(3, 1.4, 2), new THREE.MeshStandardMaterial({ color: 0x1e293b }));
      desk.position.set(0, 0.7, 0);
      group.add(desk);
      this.createWorkerMesh(group, 0, 0, 1.5, 0xef4444);
    } else if (id === 13) {
      const fence = new THREE.Mesh(new THREE.BoxGeometry(8, 3, 6), new THREE.MeshBasicMaterial({ color: 0xf59e0b, wireframe: true }));
      fence.position.set(0, 1.5, 0);
      group.add(fence);
      this.createWorkerMesh(group, -1, 0, 1, 0xf59e0b);
      this.createFloatingTag(group, "DEVOLUCIONES / NOVEDAD", 0xef4444, 0, 3.5, 0);
    }
  }

  createDoorMesh(finishHex, labelText = "") {
    const group = new THREE.Group();
    const doorGeo = new THREE.BoxGeometry(1.6, 3.2, 0.15);
    const doorMat = new THREE.MeshStandardMaterial({ color: finishHex, metalness: 0.4, roughness: 0.3 });
    const door = new THREE.Mesh(doorGeo, doorMat);
    door.position.y = 1.6;
    door.castShadow = true;
    group.add(door);

    const frameGeo = new THREE.BoxGeometry(1.8, 3.4, 0.08);
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8 });
    const frame = new THREE.Mesh(frameGeo, frameMat);
    frame.position.y = 1.6;
    group.add(frame);

    const handleGeo = new THREE.BoxGeometry(0.08, 0.4, 0.15);
    const handleMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9 });
    const handle = new THREE.Mesh(handleGeo, handleMat);
    handle.position.set(0.6, 1.6, 0.1);
    group.add(handle);

    return group;
  }

  createSafeMesh(scale = 1.0) {
    const group = new THREE.Group();
    const safeGeo = new THREE.BoxGeometry(1.5 * scale, 1.5 * scale, 1.5 * scale);
    const safeMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.85, roughness: 0.2 });
    const safe = new THREE.Mesh(safeGeo, safeMat);
    safe.position.y = (1.5 * scale) / 2;
    safe.castShadow = true;
    group.add(safe);

    const dial = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.1, 16), new THREE.MeshStandardMaterial({ color: 0xd4af37 }));
    dial.rotation.x = Math.PI / 2;
    dial.position.set(0, (1.5 * scale) / 2, (1.5 * scale) / 2 + 0.05);
    group.add(dial);

    return group;
  }

  createLockBoxGroup() {
    const group = new THREE.Group();
    for (let i = 0; i < 6; i++) {
      const box = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.4, 0.6), new THREE.MeshStandardMaterial({ color: 0x0284c7 }));
      box.position.set((i % 3) * 0.7 - 0.7, Math.floor(i / 3) * 0.45 + 0.2, 0);
      group.add(box);
    }
    return group;
  }

  createWrappedBoxMesh() {
    const box = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.6 }));
    box.position.y = 1;
    return box;
  }

  createPallet(group, x, y, z, items = []) {
    const palletGeo = new THREE.BoxGeometry(3.5, 0.3, 3.5);
    const palletMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.8 });
    const pallet = new THREE.Mesh(palletGeo, palletMat);
    pallet.position.set(x, y, z);
    group.add(pallet);

    items.forEach((item, idx) => {
      item.position.set(x + (idx * 0.8 - 0.4), y + 0.15, z);
      group.add(item);
    });
  }

  /**
   * MODELADO TRIDIMENSIONAL DE PERSONA / OPERARIO LOGÍSTICO COMPLETO
   */
  createWorkerMesh(group, x, y, z, vestColorHex = 0x3b82f6) {
    const workerGroup = new THREE.Group();
    workerGroup.position.set(x, y, z);

    // 1. Botas / Zapatos de Seguridad
    const bootMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.8 });
    const leftBoot = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.2, 0.45), bootMat);
    leftBoot.position.set(-0.2, 0.1, 0.08);
    const rightBoot = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.2, 0.45), bootMat);
    rightBoot.position.set(0.2, 0.1, 0.08);
    workerGroup.add(leftBoot);
    workerGroup.add(rightBoot);

    // 2. Piernas / Pantalón Industrial
    const pantsMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6 });
    const leftLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.14, 1.0, 12), pantsMat);
    leftLeg.position.set(-0.2, 0.7, 0);
    const rightLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.14, 1.0, 12), pantsMat);
    rightLeg.position.set(0.2, 0.7, 0);
    workerGroup.add(leftLeg);
    workerGroup.add(rightLeg);

    // 3. Torso con Chaleco de Seguridad Reflectivo
    const torsoMat = new THREE.MeshStandardMaterial({ color: vestColorHex, roughness: 0.4 });
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.75, 1.1, 0.45), torsoMat);
    torso.position.y = 1.75;
    workerGroup.add(torso);

    // Franja Reflectiva Plateada
    const stripeMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.8 });
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.77, 0.14, 0.47), stripeMat);
    stripe.position.y = 1.8;
    workerGroup.add(stripe);

    // 4. Cabeza y Tono de Piel Natural
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xe5c158, roughness: 0.5 });
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.28, 16, 16), skinMat);
    head.position.y = 2.5;
    workerGroup.add(head);

    // 5. Casco de Seguridad Industrial
    const hatMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.3 });
    const hatDome = new THREE.Mesh(new THREE.SphereGeometry(0.32, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2), hatMat);
    hatDome.position.y = 2.55;
    workerGroup.add(hatDome);
    const hatBrim = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.04, 16), hatMat);
    hatBrim.position.y = 2.55;
    workerGroup.add(hatBrim);

    // 6. Brazos
    const leftArm = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.1, 0.9, 12), torsoMat);
    leftArm.position.set(-0.48, 1.7, 0);
    leftArm.rotation.z = 0.2;
    const rightArm = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.1, 0.9, 12), torsoMat);
    rightArm.position.set(0.48, 1.7, 0);
    rightArm.rotation.z = -0.2;
    workerGroup.add(leftArm);
    workerGroup.add(rightArm);

    group.add(workerGroup);
  }

  createStorageRack(group, x, y, z, sectorTitle, doorFinishes = null) {
    const rackGroup = new THREE.Group();
    rackGroup.position.set(x, y, z);

    const colMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.8 });
    const colGeo = new THREE.BoxGeometry(0.4, 8, 0.4);
    [[-4, 4, -2], [4, 4, -2], [-4, 4, 2], [4, 4, 2]].forEach(pos => {
      const col = new THREE.Mesh(colGeo, colMat);
      col.position.set(...pos);
      rackGroup.add(col);
    });

    const shelfGeo = new THREE.BoxGeometry(8.4, 0.2, 4.4);
    const shelfMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.6 });
    [0.3, 3.0, 5.5].forEach(height => {
      const shelf = new THREE.Mesh(shelfGeo, shelfMat);
      shelf.position.y = height;
      rackGroup.add(shelf);
    });

    if (doorFinishes) {
      doorFinishes.forEach((finish, i) => {
        const door = this.createDoorMesh(finish.hex, finish.name);
        door.position.set((i - 1) * 2.2, 0.4, 0);
        rackGroup.add(door);
      });
    } else if (sectorTitle.includes("CAJAS")) {
      [-2.2, 0, 2.2].forEach((posX, idx) => {
        const safe = this.createSafeMesh(PRODUCTS.SAFES.sizes[idx].size);
        safe.position.set(posX, 0.4, 0);
        rackGroup.add(safe);
      });
    } else {
      [0.4, 3.1].forEach(height => {
        [-2.5, 0, 2.5].forEach(posX => {
          const lockBoxes = this.createLockBoxGroup();
          lockBoxes.position.set(posX, height, 0);
          rackGroup.add(lockBoxes);
        });
      });
    }

    this.createFloatingTag(rackGroup, sectorTitle, 0xd4af37, 0, 9, 0);
    group.add(rackGroup);
  }

  createFloatingTag(group, text, colorHex, x, y, z) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, 256, 64);
    ctx.strokeStyle = '#' + colorHex.toString(16).padStart(6, '0');
    ctx.lineWidth = 4;
    ctx.strokeRect(2, 2, 252, 60);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 15px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 128, 32);

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMat = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(6, 1.5, 1);
    sprite.position.set(x, y, z);
    group.add(sprite);
  }

  buildUFlowPath3D() {
    const points = [
      new THREE.Vector3(-18, 1, 30),
      new THREE.Vector3(-18, 1, 9),
      new THREE.Vector3(-18, 1, -2),
      new THREE.Vector3(-18, 1, -12),
      new THREE.Vector3(0, 1, -12),
      new THREE.Vector3(18, 1, 6),
      new THREE.Vector3(18, 1, 12),
      new THREE.Vector3(10, 1, 18),
      new THREE.Vector3(18, 1, 18),
      new THREE.Vector3(18, 1, 30)
    ];

    this.uCurve = new THREE.CatmullRomCurve3(points);
    const tubeGeo = new THREE.TubeGeometry(this.uCurve, 64, 0.3, 8, false);
    const tubeMat = new THREE.MeshBasicMaterial({ color: 0xd4af37, transparent: true, opacity: 0.8 });
    this.uTubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
    this.scene.add(this.uTubeMesh);

    const packageGeo = new THREE.BoxGeometry(1.2, 1.2, 1.2);
    const packageMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xd4af37, emissiveIntensity: 0.8 });
    this.packageMesh = new THREE.Mesh(packageGeo, packageMat);
    this.scene.add(this.packageMesh);
  }

  setupEvents() {
    window.addEventListener('resize', () => {
      this.width = this.container.clientWidth || window.innerWidth;
      this.height = this.container.clientHeight || (window.innerHeight - 150);
      this.camera.aspect = this.width / this.height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.width, this.height);
    });

    this.renderer.domElement.addEventListener('click', (e) => {
      const rect = this.renderer.domElement.getBoundingClientRect();
      this.mouse.x = ((e.clientX - rect.left) / this.width) * 2 - 1;
      this.mouse.y = -((e.clientY - rect.top) / this.height) * 2 + 1;

      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObjects(this.scene.children, true);

      for (let hit of intersects) {
        if (hit.object.userData && hit.object.userData.isZoneTrigger) {
          const zoneId = hit.object.userData.zoneId;
          this.focusZone(zoneId);
          if (this.onZoneSelect) this.onZoneSelect(zoneId);
          break;
        }
      }
    });
  }

  focusZone(zoneId) {
    const zoneData = ZONES.find(z => z.id === zoneId);
    if (!zoneData) return;

    const targetPos = zoneData.position3d;
    
    if (window.gsap) {
      window.gsap.to(this.controls.target, {
        x: targetPos.x,
        y: targetPos.y + 2,
        z: targetPos.z,
        duration: 1.5,
        ease: "power2.inOut"
      });

      window.gsap.to(this.camera.position, {
        x: targetPos.x + 8,
        y: targetPos.y + 12,
        z: targetPos.z + 14,
        duration: 1.5,
        ease: "power2.inOut"
      });
    } else {
      if (this.controls) this.controls.target.set(targetPos.x, targetPos.y + 2, targetPos.z);
      this.camera.position.set(targetPos.x + 8, targetPos.y + 12, targetPos.z + 14);
    }
  }

  startGuidedTour(onTourStep) {
    this.tourActive = true;
    this.tourIndex = 0;
    this.nextTourStep(onTourStep);
  }

  nextTourStep(onTourStep) {
    if (!this.tourActive) return;

    if (this.tourIndex >= U_FLOW_STEPS.length - 1) {
      this.tourIndex = 0;
    }

    const currentStep = U_FLOW_STEPS[this.tourIndex];
    if (currentStep && currentStep.zoneId) {
      this.focusZone(currentStep.zoneId);
      if (onTourStep) onTourStep(currentStep, this.tourIndex + 1, U_FLOW_STEPS.length);
    }

    this.tourIndex++;
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    if (this.controls) this.controls.update();

    if (this.uCurve && this.packageMesh) {
      this.packageAnimTime += 0.003;
      if (this.packageAnimTime > 1) this.packageAnimTime = 0;

      const point = this.uCurve.getPoint(this.packageAnimTime);
      this.packageMesh.position.copy(point);
      this.packageMesh.position.y += 0.6;
      this.packageMesh.rotation.y += 0.02;
    }

    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }
}

// ==========================================
// 4. CONTROLADOR PRINCIPAL DE LA APLICACIÓN
// ==========================================

class App {
  constructor() {
    this.currentView = '2d';
    this.selectedZoneId = null;

    this.initUI();
    this.initViews();
  }

  initUI() {
    if (window.lucide) {
      window.lucide.createIcons();
    }

    const btnTab2D = document.getElementById('btnTab2D');
    const btnTab3D = document.getElementById('btnTab3D');

    btnTab2D.addEventListener('click', () => this.switchView('2d'));
    btnTab3D.addEventListener('click', () => this.switchView('3d'));

    const btnStartTour = document.getElementById('btnStartTour');
    btnStartTour.addEventListener('click', () => {
      this.switchView('3d');
      if (this.view3D) {
        this.view3D.startGuidedTour((step) => {
          this.onZoneSelected(step.zoneId);
        });
      }
    });

    // Botón de Descarga Directa (.HTML Standalone)
    const btnDownloadSingleFile = document.getElementById('btnDownloadSingleFile');
    if (btnDownloadSingleFile) {
      btnDownloadSingleFile.addEventListener('click', () => this.downloadSingleFileApp());
    }

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

    const btnCloseDrawer = document.getElementById('btnCloseDrawer');
    btnCloseDrawer.addEventListener('click', () => this.closeDrawer());
  }

  downloadSingleFileApp() {
    const link = document.createElement('a');
    link.href = 'bodega_protecsa_jsd.html';
    link.download = 'bodega_protecsa_jsd.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  initViews() {
    this.view2D = new View2D('view2dContainer', (zoneId) => this.onZoneSelected(zoneId));
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

    if (this.view2D) this.view2D.selectZone(zoneId);
    if (this.view3D) this.view3D.focusZone(zoneId);

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

window.addEventListener('DOMContentLoaded', () => {
  window.appInstance = new App();
});
