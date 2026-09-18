/**
 * Componente de Representación 3D Interactiva de la Bodega PROTECSA JSD S.A.S.
 * Utiliza Three.js, OrbitControls y GSAP para rendering fidedigno, materiales realistas,
 * trayectoria en U, recorrido guiado de cámara y simulación de flujo.
 */

import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js';
import { ZONES, PRODUCTS, U_FLOW_STEPS } from './data/zones.js';

export class View3D {
  constructor(containerId, onZoneSelect) {
    this.container = document.getElementById(containerId);
    this.onZoneSelect = onZoneSelect;
    this.zoneMeshes = new Map();
    this.tourActive = false;
    this.tourIndex = 0;
    this.tourTimer = null;
    this.packageMesh = null;
    this.packageAnimTime = 0;
    this.animatingPackage = false;

    this.initScene();
    this.buildWarehouse();
    this.buildZones3D();
    this.buildUFlowPath3D();
    this.setupEvents();
    this.animate();
  }

  initScene() {
    this.width = this.container.clientWidth || window.innerWidth;
    this.height = this.container.clientHeight || (window.innerHeight - 150);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    this.container.appendChild(this.renderer.domElement);

    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0b1329);
    this.scene.fog = new THREE.FogExp2(0x0b1329, 0.008);

    // Camera
    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.5, 300);
    this.camera.position.set(0, 45, 60);

    // Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.maxPolarAngle = Math.PI / 2 - 0.02; // Don't go below floor
    this.controls.minDistance = 10;
    this.controls.maxDistance = 120;
    this.controls.target.set(0, 2, 0);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfff5ea, 2.0);
    dirLight.position.set(30, 50, 20);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 150;
    const d = 40;
    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;
    this.scene.add(dirLight);

    // Blue & Gold Accent Spotlights
    const spotGold = new THREE.SpotLight(0xd4af37, 3, 60, Math.PI / 4, 0.5);
    spotGold.position.set(-18, 25, -2);
    this.scene.add(spotGold);

    const spotBlue = new THREE.SpotLight(0x3b82f6, 3, 60, Math.PI / 4, 0.5);
    spotBlue.position.set(18, 25, 18);
    this.scene.add(spotBlue);

    // Raycaster for click interaction
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
  }

  buildWarehouse() {
    // Floor
    const floorGeo = new THREE.PlaneGeometry(60, 50);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.3,
      metalness: 0.2
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.scene.add(floor);

    // Safety Floor Stripes (Walkway)
    const stripeGeo = new THREE.PlaneGeometry(48, 4);
    const stripeMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b, opacity: 0.6, transparent: true });
    const stripe = new THREE.Mesh(stripeGeo, stripeMat);
    stripe.rotation.x = -Math.PI / 2;
    stripe.position.set(0, 0.02, 0);
    this.scene.add(stripe);

    // Outer Walls (Transparent Glass-like / Industrial Wireframe structure)
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.5,
      metalness: 0.8,
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide
    });

    // Back Wall
    const backWall = new THREE.Mesh(new THREE.PlaneGeometry(60, 16), wallMat);
    backWall.position.set(0, 8, -25);
    this.scene.add(backWall);

    // Left Wall
    const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(50, 16), wallMat);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.position.set(-30, 8, 0);
    this.scene.add(leftWall);

    // Right Wall
    const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(50, 16), wallMat);
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.position.set(30, 8, 0);
    this.scene.add(rightWall);

    // Roof Trusses & Structural Beams
    const beamGeo = new THREE.BoxGeometry(60, 0.5, 0.5);
    const beamMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.9, roughness: 0.2 });
    for (let z = -20; z <= 20; z += 10) {
      const beam = new THREE.Mesh(beamGeo, beamMat);
      beam.position.set(0, 15, z);
      this.scene.add(beam);
    }

    // Build Supplier Truck (Left Front Dock)
    this.buildTruck(-22, 0, 32, 0x3b82f6, "PROVEEDOR GALEANO");

    // Build Dispatch Truck (Right Front Dock)
    this.buildTruck(22, 0, 32, 0xef4444, "DESPACHO PROTECSA");

    // Office Construction (Zone 15 - Top Right Glass Office)
    this.buildOffice(22, 0, -18);
  }

  buildTruck(x, y, z, colorHex, labelText) {
    const group = new THREE.Group();
    group.position.set(x, y, z);

    // Truck Body / Cargo Container
    const cargoGeo = new THREE.BoxGeometry(7, 5, 12);
    const cargoMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, metalness: 0.3, roughness: 0.4 });
    const cargo = new THREE.Mesh(cargoGeo, cargoMat);
    cargo.position.set(0, 3.5, 0);
    cargo.castShadow = true;
    group.add(cargo);

    // Truck Cabin
    const cabinGeo = new THREE.BoxGeometry(6.8, 4.5, 4);
    const cabinMat = new THREE.MeshStandardMaterial({ color: colorHex, metalness: 0.7, roughness: 0.3 });
    const cabin = new THREE.Mesh(cabinGeo, cabinMat);
    cabin.position.set(0, 3, 7.5);
    cabin.castShadow = true;
    group.add(cabin);

    // Wheels
    const wheelGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.6, 16);
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.9 });
    const wheelPositions = [
      [-3.5, 0.8, 6], [3.5, 0.8, 6],
      [-3.5, 0.8, -2], [3.5, 0.8, -2],
      [-3.5, 0.8, -4], [3.5, 0.8, -4]
    ];
    wheelPositions.forEach(pos => {
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

    // Elevated Floor / Glass Walls
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.3, roughness: 0.1 });
    const officeBox = new THREE.Mesh(new THREE.BoxGeometry(12, 6, 10), wallMat);
    officeBox.position.set(0, 3, 0);
    group.add(officeBox);

    // Desk & Computer inside
    const desk = new THREE.Mesh(new THREE.BoxGeometry(4, 1.2, 2), new THREE.MeshStandardMaterial({ color: 0x78350f }));
    desk.position.set(0, 1.2, 0);
    group.add(desk);

    const pc = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1, 0.2), new THREE.MeshStandardMaterial({ color: 0x0284c7 }));
    pc.position.set(0, 2.2, 0);
    group.add(pc);

    this.scene.add(group);
  }

  buildZones3D() {
    ZONES.forEach(zone => {
      const zoneGroup = new THREE.Group();
      const { x, y, z } = zone.position3d;
      zoneGroup.position.set(x, y, z);

      // Floor Zone Pedestal Base with Zone Colors
      let baseColor = 0x3b82f6;
      if (zone.category === 'Quality') baseColor = 0xf59e0b;
      if (zone.category === 'Storage') baseColor = 0x10b981;
      if (zone.category === 'Outbound') baseColor = 0xef4444;
      if (zone.category === 'Admin') baseColor = 0x8b5cf6;

      const baseGeo = new THREE.BoxGeometry(10, 0.2, 8);
      const baseMat = new THREE.MeshStandardMaterial({
        color: baseColor,
        transparent: true,
        opacity: 0.25,
        roughness: 0.4
      });
      const baseMesh = new THREE.Mesh(baseGeo, baseMat);
      baseMesh.position.y = 0.1;
      baseMesh.userData = { zoneId: zone.id, isZoneTrigger: true };
      zoneGroup.add(baseMesh);

      // Bounding Box Edge Highlight
      const edges = new THREE.EdgesGeometry(baseGeo);
      const lineMat = new THREE.LineBasicMaterial({ color: baseColor, linewidth: 2 });
      const line = new THREE.LineSegments(edges, lineMat);
      line.position.y = 0.1;
      zoneGroup.add(line);

      // Populate 3D Specific Objects for each zone
      this.populateZoneObjects(zone, zoneGroup);

      this.scene.add(zoneGroup);
      this.zoneMeshes.set(zone.id, { group: zoneGroup, baseMesh, data: zone });
    });
  }

  populateZoneObjects(zone, group) {
    const id = zone.id;

    // ZONE 1: Unloading Dock
    if (id === 1) {
      this.createPallet(group, -2, 0.2, 0, [
        this.createDoorMesh(PRODUCTS.DOORS.finishes[0].hex),
        this.createSafeMesh(1.2)
      ]);
      this.createWorkerMesh(group, 2, 0, 1, 0x3b82f6);
    }

    // ZONE 2: Reception
    else if (id === 2) {
      const desk = new THREE.Mesh(new THREE.BoxGeometry(4, 1.4, 2), new THREE.MeshStandardMaterial({ color: 0x475569 }));
      desk.position.set(0, 0.7, 0);
      group.add(desk);
      
      const screen = new THREE.Mesh(new THREE.BoxGeometry(1, 0.8, 0.1), new THREE.MeshStandardMaterial({ color: 0x38bdf8 }));
      screen.position.set(0, 1.8, 0);
      group.add(screen);

      this.createWorkerMesh(group, 0, 0, 1.5, 0x3b82f6);
    }

    // ZONE 3: Inspección de Calidad (MANDATORY & VISIBLE)
    else if (id === 3) {
      const table = new THREE.Mesh(new THREE.BoxGeometry(5, 1.4, 3), new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.5 }));
      table.position.set(0, 0.7, 0);
      group.add(table);

      // Inspected Door finish wood & Safe
      const sampleDoor = this.createDoorMesh(PRODUCTS.DOORS.finishes[0].hex);
      sampleDoor.position.set(-1.5, 0.7, 0);
      sampleDoor.rotation.y = Math.PI / 4;
      group.add(sampleDoor);

      const sampleSafe = this.createSafeMesh(1.0);
      sampleSafe.position.set(1.2, 1.4, 0);
      group.add(sampleSafe);

      // Quality Inspector
      this.createWorkerMesh(group, 0, 0, 2, 0xf59e0b);

      // 3D Status Banners: ✓ CONFORME & ⚠ CON NOVEDAD
      this.createFloatingTag(group, "✓ CONFORME", 0x10b981, -2, 4, 0);
      this.createFloatingTag(group, "⚠ CON NOVEDAD", 0xef4444, 2, 4, 0);
    }

    // ZONE 4: Classification
    else if (id === 4) {
      this.createPallet(group, -3, 0.2, 0, [this.createDoorMesh(PRODUCTS.DOORS.finishes[1].hex)]);
      this.createPallet(group, 0, 0.2, 0, [this.createSafeMesh(1.2)]);
      this.createPallet(group, 3, 0.2, 0, [this.createLockBoxGroup()]);
      this.createWorkerMesh(group, 0, 0, 2.5, 0x10b981);
    }

    // ZONE 5: Main Storage (Divided into 3 Sectors)
    else if (id === 5) {
      // Rack Structures
      this.createStorageRack(group, -12, 0, -4, "SECTOR A: PUERTAS", PRODUCTS.DOORS.finishes);
      this.createStorageRack(group, 0, 0, -4, "SECTOR B: CAJAS FUERTES", null);
      this.createStorageRack(group, 12, 0, -4, "SECTOR C: CERRADURAS", null);
    }

    // ZONE 6: High Rotation
    else if (id === 6) {
      this.createSmallRack(group, -2, 0, 0, 0x10b981);
      this.createPallet(group, 2, 0.2, 0, [this.createLockBoxGroup()]);
    }

    // ZONE 7: Low Rotation
    else if (id === 7) {
      this.createSmallRack(group, 0, 0, 0, 0x64748b);
    }

    // ZONE 9: Order Prep (Picking)
    else if (id === 9) {
      const pickTable = new THREE.Mesh(new THREE.BoxGeometry(4, 1.4, 2.5), new THREE.MeshStandardMaterial({ color: 0x0284c7 }));
      pickTable.position.set(0, 0.7, 0);
      group.add(pickTable);

      this.createWorkerMesh(group, -1.5, 0, 1.8, 0xef4444);
    }

    // ZONE 10: Embalaje
    else if (id === 10) {
      const packTable = new THREE.Mesh(new THREE.BoxGeometry(4, 1.4, 2.5), new THREE.MeshStandardMaterial({ color: 0x78350f }));
      packTable.position.set(0, 0.7, 0);
      group.add(packTable);

      // Bubble wrap cylinder
      const wrapGeo = new THREE.CylinderGeometry(0.5, 0.5, 1.8, 16);
      const wrapMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, transparent: true, opacity: 0.7 });
      const wrap = new THREE.Mesh(wrapGeo, wrapMat);
      wrap.position.set(1.5, 1.8, 0);
      group.add(wrap);

      this.createWorkerMesh(group, 0, 0, 1.8, 0xef4444);
    }

    // ZONE 11: Expedición
    else if (id === 11) {
      this.createPallet(group, 0, 0.2, 0, [
        this.createWrappedBoxMesh()
      ]);
      this.createWorkerMesh(group, 2, 0, 1, 0xef4444);
    }

    // ZONE 12: Control de Salida
    else if (id === 12) {
      const desk = new THREE.Mesh(new THREE.BoxGeometry(3, 1.4, 2), new THREE.MeshStandardMaterial({ color: 0x1e293b }));
      desk.position.set(0, 0.7, 0);
      group.add(desk);
      this.createWorkerMesh(group, 0, 0, 1.5, 0xef4444);
    }

    // ZONE 13: Devoluciones
    else if (id === 13) {
      const fenceMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b, wireframe: true });
      const fence = new THREE.Mesh(new THREE.BoxGeometry(8, 3, 6), fenceMat);
      fence.position.set(0, 1.5, 0);
      group.add(fence);
      this.createFloatingTag(group, "DEVOLUCIONES / NOVEDAD", 0xef4444, 0, 3.5, 0);
    }
  }

  createDoorMesh(finishHex) {
    const group = new THREE.Group();
    // Door Panel
    const doorGeo = new THREE.BoxGeometry(1.6, 3.2, 0.15);
    const doorMat = new THREE.MeshStandardMaterial({ color: finishHex, metalness: 0.4, roughness: 0.3 });
    const door = new THREE.Mesh(doorGeo, doorMat);
    door.position.y = 1.6;
    door.castShadow = true;
    group.add(door);

    // Chrome handle
    const handleGeo = new THREE.BoxGeometry(0.1, 0.4, 0.15);
    const handleMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9, roughness: 0.1 });
    const handle = new THREE.Mesh(handleGeo, handleMat);
    handle.position.set(0.6, 1.6, 0.1);
    group.add(handle);

    return group;
  }

  createSafeMesh(scale = 1.0) {
    const group = new THREE.Group();
    const safeGeo = new THREE.BoxGeometry(1.5 * scale, 1.5 * scale, 1.5 * scale);
    const safeMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.2 });
    const safe = new THREE.Mesh(safeGeo, safeMat);
    safe.position.y = (1.5 * scale) / 2;
    safe.castShadow = true;
    group.add(safe);

    // Keypad dial
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

  createWorkerMesh(group, x, y, z, vestColorHex = 0x3b82f6) {
    const workerGroup = new THREE.Group();
    workerGroup.position.set(x, y, z);

    // Body
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.3, 1.4, 12), new THREE.MeshStandardMaterial({ color: vestColorHex }));
    body.position.y = 1.1;
    workerGroup.add(body);

    // Hard Hat
    const hat = new THREE.Mesh(new THREE.SphereGeometry(0.35, 12, 12), new THREE.MeshStandardMaterial({ color: 0xf59e0b }));
    hat.position.y = 2.0;
    workerGroup.add(hat);

    group.add(workerGroup);
  }

  createStorageRack(group, x, y, z, sectorTitle, doorFinishes = null) {
    const rackGroup = new THREE.Group();
    rackGroup.position.set(x, y, z);

    // Steel Frame Columns
    const colMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.8 });
    const colGeo = new THREE.BoxGeometry(0.4, 8, 0.4);
    [[-4, 4, -2], [4, 4, -2], [-4, 4, 2], [4, 4, 2]].forEach(pos => {
      const col = new THREE.Mesh(colGeo, colMat);
      col.position.set(...pos);
      rackGroup.add(col);
    });

    // Horizontal Shelves
    const shelfGeo = new THREE.BoxGeometry(8.4, 0.2, 4.4);
    const shelfMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.6 });
    [0.3, 3.0, 5.5].forEach(height => {
      const shelf = new THREE.Mesh(shelfGeo, shelfMat);
      shelf.position.y = height;
      rackGroup.add(shelf);
    });

    // Populate Rack Items based on Sector
    if (doorFinishes) {
      // Door Sector A
      doorFinishes.forEach((finish, i) => {
        const door = this.createDoorMesh(finish.hex);
        door.position.set((i - 1) * 2.2, 0.4, 0);
        rackGroup.add(door);
      });
    } else if (sectorTitle.includes("CAJAS")) {
      // Safe Sector B
      [-2.2, 0, 2.2].forEach(posX => {
        const safe = this.createSafeMesh(1.3);
        safe.position.set(posX, 0.4, 0);
        rackGroup.add(safe);
      });
    } else {
      // Lock Sector C
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

  createSmallRack(group, x, y, z, colorHex) {
    const rackMat = new THREE.MeshStandardMaterial({ color: colorHex, metalness: 0.7 });
    const rack = new THREE.Mesh(new THREE.BoxGeometry(6, 5, 2.5), rackMat);
    rack.position.set(x, 2.5, z);
    group.add(rack);
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
    ctx.font = 'bold 16px sans-serif';
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

    // Glowing Animated Package
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

    // Click selection raycaster
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
    
    // Smooth camera transition using GSAP if available or direct lerp target
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
      this.controls.target.set(targetPos.x, targetPos.y + 2, targetPos.z);
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
      this.tourIndex = 0; // Loop or end
    }

    const currentStep = U_FLOW_STEPS[this.tourIndex];
    if (currentStep && currentStep.zoneId) {
      this.focusZone(currentStep.zoneId);
      if (onTourStep) onTourStep(currentStep, this.tourIndex + 1, U_FLOW_STEPS.length);
    }

    this.tourIndex++;
  }

  stopGuidedTour() {
    this.tourActive = false;
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    this.controls.update();

    // Package animation along U path
    if (this.uCurve && this.packageMesh) {
      this.packageAnimTime += 0.003;
      if (this.packageAnimTime > 1) this.packageAnimTime = 0;

      const point = this.uCurve.getPoint(this.packageAnimTime);
      this.packageMesh.position.copy(point);
      this.packageMesh.position.y += 0.6;
      this.packageMesh.rotation.y += 0.02;
    }

    this.renderer.render(this.scene, this.camera);
  }
}
