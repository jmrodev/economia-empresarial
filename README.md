# JuanFer Shop S.A.S. — Presentación Economía Empresarial (ISFD N° 166)

Aplicación web interactiva desarrollada con **Astro 5** y **View Transitions** para la defensa oral del proyecto ante el comité evaluador / inversores.

* **Sitio en vivo (GitHub Pages):** [https://jmrodev.github.io/economia-empresarial/](https://jmrodev.github.io/economia-empresarial/)
* **Repositorio oficial:** [https://github.com/jmrodev/economia-empresarial](https://github.com/jmrodev/economia-empresarial)

---

## 🚀 ¿Cómo usar la web para practicar la exposición?

La web está diseñada para navegarse como una presentación interactiva de diapositivas con transiciones fluidas.

### Controles de teclado y pantalla:
* **Flecha Derecha (`→`) / AvPág:** Avanza a la siguiente diapositiva.
* **Flecha Izquierda (`←`) / RePág:** Retrocede a la diapositiva anterior.
* **Barra Espaciadora:** Inicia o pausa el recorrido automático (`▶️ Auto`).
* **Tecla `P` o `G` / Botón `🎙️ Guión`:** Abre el **Prompter / Guión de Práctica** flotante con los textos y métricas divididos por orador:
  - **Juani (0-5 min):** Oportunidad de mercado, software nativo React 19 + Firestore y constitución S.R.L.
  - **Juan M. (5-10 min):** Posicionamiento, Matriz BCG y logística Mercado Envíos Full.
  - **Fer (10-15 min):** Costos fijos ($17M), estructura laboral CCT, margen de contribución ($26.411) y punto de equilibrio.
* **Tecla `F` / Botón `⛶`:** Pantalla completa (ideal para proyector).
* **Tecla `Escape` o `Home`:** Cierra el prompter o vuelve al panel inicial de módulos.

---

## 🛠️ Cómo clonar, modificar con IA y actualizar el sitio

El proyecto utiliza **GitHub Actions**. Cualquier cambio que se suba a la rama `main` compila y **actualiza el sitio web automáticamente en segundos**.

### 1. Clonar el repositorio localmente
```bash
git clone https://github.com/jmrodev/economia-empresarial.git
cd economia-empresarial
```

### 2. Instalar dependencias y levantar el servidor local
Requisitos: Node.js 18 o superior.
```bash
npm install
npm run dev
```
Abre en tu navegador: `http://localhost:4321/economia-empresarial/`

### 3. Modificar o mejorar con Asistentes de IA (Cursor, Claude, Copilot, ChatGPT, etc.)
Si ves algún texto, color, imagen o métrica para corregir:
1. Pídele a la IA en tu editor:
   > *"Quiero corregir el dato X en el módulo de finanzas o cambiar el texto del guión en Layout.astro"*.
2. Verifica los cambios en tu servidor local (`npm run dev`).
3. Comprueba que compile sin errores:
   ```bash
   npm run build
   ```

### 4. Subir los cambios a GitHub
```bash
git add .
git commit -m "feat: ajuste en texto y presentación"
git push origin main
```
¡Listo! GitHub Actions se encargará de compilar y desplegar automáticamente en [jmrodev.github.io/economia-empresarial/](https://jmrodev.github.io/economia-empresarial/).

---

## 📁 Estructura del Proyecto

* `src/pages/` - Rutas de Astro (Home, vista de módulo y vista de detalle en pantalla completa).
* `src/layouts/Layout.astro` - Layout principal con el router de transiciones, barra de controles y modal de prompter.
* `src/data/gallery.ts` - Lógica dinámica que lee los módulos e imágenes de la presentación.
* `public/galeria/` - Carpetas con las diapositivas y gráficos en SVG y PNG por cada módulo temático.
* `material/` - Documentación de respaldo:
  - `Guion Comercial de Venta JuanFer Shop.pdf`: Pitch oral completo para inversores.
  - `proyecto_final_juanfer_shop.docx` / `.pdf`: Plan de negocios y proyecto final.
  - `canvas_modelo_de_negocios.png`: Matriz Canvas de negocio.
