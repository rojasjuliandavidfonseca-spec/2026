/**
 * Base de Datos Oficial de la Bodega de PROTECSA JSD S.A.S.
 * Empresa Distribuidora y Comercializadora de Productos de Seguridad en Bogotá, Colombia.
 * NOTA: No incluye ningún proceso de fabricación ni transformación industrial.
 */

export const COMPANY_INFO = {
  name: "PROTECSA JSD S.A.S.",
  tagline: "Distribución y Comercialización de Productos de Seguridad",
  location: "Bogotá, Colombia",
  supplierDoors: "Blindajes y Seguridad Galeano",
  flowType: "Distribución en U (Entrada y Salida en el mismo frente)"
};

export const PRODUCTS = {
  DOORS: {
    id: "doors",
    name: "Puertas de Seguridad",
    supplier: "Blindajes y Seguridad Galeano",
    category: "Alta prioridad / Voluminoso",
    finishes: [
      { id: "wood", name: "Café Madera Mate", color: "#653b1b", hex: 0x653b1b },
      { id: "gray", name: "Gris Texturizado", color: "#4b5563", hex: 0x4b5563 },
      { id: "white", name: "Blanco Brillante", color: "#f8fafc", hex: 0xf8fafc }
    ],
    description: "Puertas acorazadas de alta resistencia con sistemas de pivotes y cerraduras multipunto."
  },
  SAFES: {
    id: "safes",
    name: "Cajas Fuertes",
    category: "Productos Pesados",
    sizes: ["Pequeña (Valores)", "Mediana (Oficina)", "Grande (Bancaria / Comercial)"],
    description: "Cajas de alta seguridad resistentes a impactos y ataques térmicos. Almacenadas en posiciones bajas."
  },
  SMART_LOCKS: {
    id: "locks",
    name: "Cerraduras Inteligentes",
    category: "Alta Rotación",
    types: ["Biométrica (Huella)", "Teclado Digital / RFID", "Conexión Wi-Fi / Bluetooth"],
    description: "Cerraduras electrónicas de vanguardia empacadas en cajas de alta rotación en estanterías."
  }
};

export const ZONES = [
  {
    id: 1,
    code: "Z-01",
    name: "Entrada / Carga y Descarga",
    shortName: "Carga y Descarga",
    category: "Inbound",
    icon: "truck",
    position2d: { x: 5, y: 72, w: 20, h: 24 },
    position3d: { x: -18, y: 0, z: 18 },
    description: "Recepción de mercancía proveniente de proveedores.",
    whatIsDone: "Un camión del proveedor 'Blindajes y Seguridad Galeano' se estaciona en la berma exterior izquierda. El personal logístico descarga pallets con puertas de seguridad, cajas fuertes y cerraduras inteligentes.",
    importance: "Es el punto inicial del flujo en U donde se realiza la transferencia de responsabilidad física entre el transportador del proveedor y la bodega de PROTECSA JSD.",
    productsPresent: ["Puertas de Seguridad", "Cajas Fuertes", "Cerraduras Inteligentes"],
    workerActivity: "Descarga manual y con carretilla hidráulica de pallets."
  },
  {
    id: 2,
    code: "Z-02",
    name: "Recepción de Mercancía",
    shortName: "Recepción",
    category: "Inbound",
    icon: "file-check",
    position2d: { x: 5, y: 50, w: 20, h: 18 },
    position3d: { x: -18, y: 0, z: 9 },
    description: "Se verifican cantidades, referencias y documentación de la mercancía recibida.",
    whatIsDone: "En el escritorio de recepción equipado con computador y lector de código de barras, se coteja la remisión física contra la orden de compra en el sistema ERP.",
    importance: "Garantiza que solo se ingrese al sistema el inventario exacto que fue solicitado al proveedor.",
    productsPresent: ["Documentos de despacho", "Mercancía recién ingresada", "Lector de código de barras"],
    workerActivity: "Escaneo de etiquetas de código de barras y validación documental."
  },
  {
    id: 3,
    code: "Z-03",
    name: "Inspección de Calidad",
    shortName: "Inspección Calidad",
    category: "Quality",
    isMandatoryHighlight: true,
    icon: "search",
    position2d: { x: 5, y: 26, w: 24, h: 20 },
    position3d: { x: -18, y: 0, z: -2 },
    description: "Se inspecciona el estado físico de los productos para identificar golpes, daños, defectos o inconsistencias antes de almacenarlos.",
    whatIsDone: "Un inspector examina los acabados de las puertas (madera, gris, blanco), el mecanismo de las cajas fuertes y los chips/biometría de las cerraduras.",
    importance: "Evita que productos defectuosos ingresen al inventario disponible para la venta.",
    outcomes: [
      { status: "✓ CONFORME", text: "Pasa a clasificación y almacenamiento.", class: "success" },
      { status: "⚠ CON NOVEDAD", text: "Pasa a la zona de devoluciones / revisión.", class: "warning" }
    ],
    productsPresent: ["Puerta en mesa de prueba", "Caja fuerte en revisión", "Cerraduras sobre mesa", "Lupa & Sello de Calidad"],
    workerActivity: "Evaluación técnica de pintura, cerraduras y embalaje de origen."
  },
  {
    id: 4,
    code: "Z-04",
    name: "Clasificación de Mercancía",
    shortName: "Clasificación",
    category: "Inbound",
    icon: "boxes",
    position2d: { x: 5, y: 5, w: 24, h: 17 },
    position3d: { x: -18, y: 0, z: -12 },
    description: "Los productos se clasifican según tipo, referencia, tamaño, peso y rotación.",
    whatIsDone: "Se agrupan los artículos en 3 familias principales: Puertas de Seguridad, Cajas Fuertes y Cerraduras Inteligentes.",
    importance: "Agiliza la ubicación de almacenamiento adecuada según las características ergonómicas y físicas del producto.",
    productsPresent: ["Lotes de puertas listas", "Pallets de cajas fuertes", "Cajas etiquetadas de cerraduras"],
    workerActivity: "Etiquetado interno de SKU y asignación de pasillo."
  },
  {
    id: 5,
    code: "Z-05",
    name: "Zona Principal de Almacenamiento",
    shortName: "Almacenamiento General",
    category: "Storage",
    icon: "warehouse",
    position2d: { x: 33, y: 5, w: 42, h: 50 },
    position3d: { x: 0, y: 0, z: -8 },
    description: "Esta es la zona MÁS GRANDE de la bodega. Ocupa la parte central y posterior con pasillos claramente visibles.",
    whatIsDone: "Resguardo organizado del stock de PROTECSA en estructuras de estantería pesada e industrial.",
    importance: "Maximiza la capacidad cúbica de la bodega y asegura la integridad física de los productos de seguridad.",
    subSectors: [
      { name: "Sector A: Puertas de Seguridad", desc: "Sector lateral/posterior amplio. Puertas colocadas verticalmente y aseguradas con acabados café madera mate, gris texturizado y blanco brillante." },
      { name: "Sector B: Cajas Fuertes", desc: "Sector central. Cajas fuertes de diferentes tamaños en posiciones bajas y seguras por su peso." },
      { name: "Sector C: Cerraduras Inteligentes", desc: "Sector de estanterías. Cajas pequeñas organizadas para fácil acceso." }
    ],
    workerActivity: "Ubicación en altura y mantenimiento de la organización de inventario."
  },
  {
    id: 6,
    code: "Z-06",
    name: "Zona de Alta Rotación",
    shortName: "Alta Rotación",
    category: "Storage",
    icon: "zap",
    position2d: { x: 45, y: 60, w: 22, h: 16 },
    position3d: { x: 6, y: 0, z: 8 },
    description: "Los productos de mayor rotación se ubican cerca de preparación de pedidos para reducir desplazamientos.",
    whatIsDone: "Conserva las cerraduras inteligentes más vendidas y las referencias de puertas de seguridad de mayor demanda.",
    importance: "Optimiza la productividad operativa reduciendo los tiempos de caminata del personal de picking.",
    productsPresent: ["Cerraduras Top Ventas", "Puertas Estándar 90cm"],
    workerActivity: "Reposición continua desde la zona principal de almacenamiento."
  },
  {
    id: 7,
    code: "Z-07",
    name: "Zona de Baja Rotación",
    shortName: "Baja Rotación",
    category: "Storage",
    icon: "clock",
    position2d: { x: 40, y: 8, w: 18, h: 16 },
    position3d: { x: 2, y: 0, z: -15 },
    description: "Los productos de menor rotación pueden ubicarse en zonas menos cercanas a preparación.",
    whatIsDone: "Almacena referencias especiales de cajas fuertes de gran volumen y puertas con especificaciones poco comunes.",
    importance: "Evita la congestión en la zona frontal y prioriza el espacio cercano al despacho para productos rápidos.",
    productsPresent: ["Cajas fuertes de alta seguridad bancaria", "Puertas blindadas medida especial"],
    workerActivity: "Conteo periódico y auditorías de inventario de baja salida."
  },
  {
    id: 8,
    code: "Z-08",
    name: "Pasillos y Circulación",
    shortName: "Pasillos de Circulación",
    category: "Safety",
    icon: "footprints",
    position2d: { x: 33, y: 32, w: 42, h: 8 },
    position3d: { x: 0, y: 0, z: 0 },
    description: "Pasillos muy visibles con rutas dibujadas, flechas de circulación y señalización.",
    whatIsDone: "Permite el tránsito seguro de trabajadores y carretillas sin obstaculizar las mercancías.",
    importance: "Garantiza la fluidez y la seguridad en los desplazamientos entre zonas.",
    productsPresent: ["Señalización en piso", "Flechas de dirección"],
    workerActivity: "Desplazamiento seguro de personal y equipos."
  },
  {
    id: 9,
    code: "Z-09",
    name: "Preparación de Pedidos (Picking)",
    shortName: "Preparación Pedidos",
    category: "Outbound",
    icon: "shopping-bag",
    position2d: { x: 78, y: 45, w: 18, h: 18 },
    position3d: { x: 18, y: 0, z: 6 },
    description: "Se seleccionan las referencias solicitadas por el cliente y se verifica la cantidad antes del despacho.",
    whatIsDone: "El operario toma productos del almacenamiento y los lleva a la mesa de preparación.",
    importance: "Garantiza que el cliente reciba exactamente el pedido solicitado.",
    productsPresent: ["Mesa de preparación", "Productos seleccionados", "Pedido digital"],
    workerActivity: "Selección y cotejo de referencias de venta."
  },
  {
    id: 10,
    code: "Z-10",
    name: "Zona de Embalaje",
    shortName: "Embalaje",
    category: "Outbound",
    icon: "package-check",
    position2d: { x: 78, y: 66, w: 18, h: 14 },
    position3d: { x: 18, y: 0, z: 12 },
    description: "Los productos se protegen y embalan según sus características antes de ser enviados.",
    whatIsDone: "Las puertas y cajas fuertes se protegen con esquineros, vinipel y cinta para evitar golpes o rayones.",
    importance: "Conserva la estética y calidad del producto de seguridad en el trayecto hacia el cliente.",
    productsPresent: ["Mesa", "Cajas", "Cinta", "Plástico protector"],
    workerActivity: "Embalaje y acondicionamiento protector."
  },
  {
    id: 11,
    code: "Z-11",
    name: "Expedición",
    shortName: "Expedición / Despacho",
    category: "Outbound",
    icon: "truck-shipping",
    position2d: { x: 78, y: 82, w: 18, h: 16 },
    position3d: { x: 18, y: 0, z: 18 },
    description: "Se consolidan y preparan los pedidos para cargarlos en el vehículo de transporte.",
    whatIsDone: "Ubicada en el frente derecho. El camión de despacho espera afuera mientras los trabajadores cargan la mercancía.",
    importance: "Punto de salida directo hacia los clientes.",
    productsPresent: ["Pedidos preparados", "Pallets", "Carretilla manual", "Camión de despacho"],
    workerActivity: "Carga de vehículos de entrega a cliente."
  },
  {
    id: 12,
    code: "Z-12",
    name: "Control de Salida",
    shortName: "Control de Salida",
    category: "Outbound",
    icon: "clipboard-check",
    position2d: { x: 58, y: 82, w: 18, h: 14 },
    position3d: { x: 10, y: 0, z: 18 },
    description: "Se realiza una última verificación de referencias, cantidades y documentación antes de la salida.",
    whatIsDone: "Escaneo final de documentos e inventario listo en computador de control.",
    importance: "Asegura la trazabilidad y evita errores en la entrega final.",
    productsPresent: ["Computador", "Escáner", "Documento de remisión"],
    workerActivity: "Verificación de remisiones y autorización de salida."
  },
  {
    id: 13,
    code: "Z-13",
    name: "Zona de Devoluciones",
    shortName: "Devoluciones",
    category: "Quality",
    icon: "alert-triangle",
    position2d: { x: 1, y: 26, w: 3, h: 20 },
    position3d: { x: -24, y: 0, z: -2 },
    description: "Los productos devueltos permanecen separados hasta determinar si pueden volver al inventario o deben gestionarse con el proveedor.",
    whatIsDone: "Ubicada cerca de recepción pero totalmente SEPARADA del almacenamiento normal.",
    importance: "Evita mezclar productos no conformes con el inventario apto para venta.",
    productsPresent: ["Caja marcada DEVOLUCIONES", "Símbolo de advertencia"],
    workerActivity: "Aislamiento e inspección secundaria de novedades."
  },
  {
    id: 14,
    code: "Z-14",
    name: "Zona de Embalajes",
    shortName: "Materiales Embalaje",
    category: "Outbound",
    icon: "package",
    position2d: { x: 97, y: 66, w: 2, h: 14 },
    position3d: { x: 24, y: 0, z: 12 },
    description: "Almacenamiento de materiales utilizados para proteger y preparar los pedidos.",
    whatIsDone: "Insumos de empaque organizados cerca de la mesa de embalaje.",
    importance: "Abastecimiento constante para la operación de packaging.",
    productsPresent: ["Cajas", "Plástico", "Cinta", "Material protector"],
    workerActivity: "Suministro de cajas y cinta al puesto de embalaje."
  },
  {
    id: 15,
    code: "Z-15",
    name: "Oficina / Administración",
    shortName: "Oficina Administración",
    category: "Admin",
    icon: "building-2",
    position2d: { x: 80, y: 5, w: 18, h: 22 },
    position3d: { x: 20, y: 0, z: -15 },
    description: "Se realizan actividades administrativas, control de inventario, gestión de pedidos y seguimiento de la operación.",
    whatIsDone: "Ubicada en una esquina estratégica con visibilidad total de la bodega.",
    importance: "Gestión estratégica y control operativo del negocio.",
    productsPresent: ["Escritorio", "Computador", "Registros de inventario"],
    workerActivity: "Administración, control WMS y servicio al cliente."
  },
  {
    id: 16,
    code: "Z-16",
    name: "Señalización de Seguridad",
    shortName: "Señalización Seguridad",
    category: "Safety",
    icon: "shield-alert",
    position2d: { x: 1, y: 5, w: 3, h: 17 },
    position3d: { x: -24, y: 0, z: -15 },
    description: "Señales de salida, rutas de circulación, zonas de carga/descarga, inspección y devoluciones.",
    whatIsDone: "Avisos de seguridad industrial colocados estratégicamente en toda la planta.",
    importance: "Cumplimiento normativo y prevención de riesgos laborales.",
    productsPresent: ["Señales de emergencia", "Demarcación de pasillos"],
    workerActivity: "Monitoreo del cumplimiento de medidas de bioseguridad y prevención."
  }
];

export const U_FLOW_STEPS = [
  { step: 1, zoneId: 1, title: "1. Carga y Descarga (Proveedor)", desc: "Entrada del camión 'Galeano' por el frente izquierdo." },
  { step: 2, zoneId: 2, title: "2. Recepción de Mercancía", desc: "Cotejo de remisiones e ingreso al sistema." },
  { step: 3, zoneId: 3, title: "3. Inspección de Calidad", desc: "Revisión física minuciosa (✓ Conforme o ⚠ Novedad)." },
  { step: 4, zoneId: 4, title: "4. Clasificación", desc: "Segmentación en Puertas, Cajas Fuertes y Cerraduras." },
  { step: 5, zoneId: 5, title: "5. Almacenamiento Principal", desc: "Ubicación estratégica en pasillos y estanterías del fondo." },
  { step: 6, zoneId: 9, title: "6. Preparación de Pedidos", desc: "Surtido y consolidación de la solicitud del cliente." },
  { step: 7, zoneId: 10, title: "7. Embalaje de Protección", desc: "Envoltorio con vinipel y esquineros de protección." },
  { step: 8, zoneId: 12, title: "8. Control de Salida", desc: "Auditoría final de remisión e ítems antes del despacho." },
  { step: 9, zoneId: 11, title: "9. Expedición / Salida", desc: "Carga en camión de reparto por el frente derecho." },
  { step: 10, zoneId: 11, title: "10. Entrega al Cliente Final", desc: "Salida del camión de despacho hacia el cliente." }
];

export const U_FLOW_JUSTIFICATION = {
  title: "¿POR QUÉ SE UTILIZA UN FLUJO EN U EN PROTECSA JSD?",
  text: "PROTECSA JSD utiliza una distribución en U porque permite organizar de manera sencilla la entrada y salida de mercancías. Los productos ingresan por la zona de recepción, pasan por inspección de calidad, clasificación y almacenamiento. Después, cuando se genera un pedido, la mercancía pasa a preparación, embalaje y expedición, regresando hacia el frente de la bodega para su despacho.\n\nEsta distribución permite reducir desplazamientos innecesarios, facilitar el control de inventario y aprovechar mejor el espacio disponible.",
  benefits: [
    {
      icon: "arrow-right-left",
      title: "REDUCE DESPLAZAMIENTOS",
      description: "Minimiza las distancias recorridas por el personal al tener la recepción y la expedición en el mismo frente de la bodega."
    },
    {
      icon: "check-circle-2",
      title: "FACILITA EL CONTROL DE INVENTARIO",
      description: "Permite un flujo continuo sin cruces de mercancía entre lo que ingresa de proveedores y lo que se despacha a clientes."
    },
    {
      icon: "layout-grid",
      title: "APROVECHA EL ESPACIO",
      description: "Optimiza la profundidad del inmueble ubicando el almacenamiento masivo al fondo y la operación rápida al frente."
    }
  ]
};
