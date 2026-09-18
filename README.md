# 🏢 Bodega PROTECSA JSD S.A.S. — Layout 2D y Visualización 3D (SENA)

Aplicación web interactiva, moderna y tridimensional para la sustentación del **SENA**, representando la bodega de **20.0 m × 12.0 m (240 m²)** de la empresa distribuidora **PROTECSA JSD S.A.S.** en Bogotá, Colombia.

---

## 🚀 Despliegue Directo en GitHub Pages

Para publicar este proyecto gratis en **GitHub Pages** y obtener tu enlace público (por ejemplo: `https://tu-usuario.github.io/bodega-protecsa/`):

### Opción A: Mediante Arrastrar y Soltar en GitHub.com (Sin usar comandos)
1. Inicia sesión en [GitHub.com](https://github.com/).
2. Crea un nuevo repositorio público haciendo clic en **New** (nómbralo `bodega-protecsa`).
3. En la pantalla inicial, haz clic en **"uploading an existing file"**.
4. Arrastra y suelta **todos los archivos** de esta carpeta:
   - `index.html`
   - `styles.css`
   - `bodega_protecsa_jsd.html`
   - `js/` (carpeta)
   - `.nojekyll`
   - `README.md`
5. Haz clic en **Commit changes**.
6. Ve a **Settings** → **Pages** (en el menú lateral izquierdo).
7. En **Source**, selecciona `Deploy from a branch` → Rama `main` / carpeta `/ (root)` → Haz clic en **Save**.
8. ¡Listo! En 1 o 2 minutos tu sitio estará en vivo en la URL pública.

---

### Opción B: Mediante Git CLI (Consola de comandos)
```bash
git init
git add .
git commit -m "Initial commit - Bodega PROTECSA JSD SENA"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/bodega-protecsa.git
git push -u origin main
```
Luego en GitHub: **Settings** → **Pages** → Seleccionar `main` / `/ (root)` → **Save**.

---

## 📑 Archivos Incluidos

- `index.html`: Página principal optimizada para servidor y GitHub Pages.
- `bodega_protecsa_jsd.html`: Versión **autónoma en un solo archivo** (con CSS y JS inyectados).
- `styles.css`: Estilos visuales con tema azul oscuro, dorado y gris industrial.
- `js/bundle.js`: Lógica unificada 2D/3D con Three.js, GSAP e íconos Lucide.
- `.nojekyll`: Archivo de configuración para evitar filtrado de Jekyll en GitHub Pages.
- `iniciar_bodega.bat`: Ejecutable para servidor local en Windows.
