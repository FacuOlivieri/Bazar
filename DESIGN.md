---
name: Bazar
description: Panel interno del bazar de barrio, impreso como una caja de proveedor
colors:
  ink: "#1d1a17"
  ink-hover: "#3a332c"
  ink-muted: "#5c554d"
  ink-faint: "#6f675e"
  kraft: "#c39a6b"
  kraft-ink: "#2a2119"
  kraft-pale: "#e8d3b6"
  paper: "#fbfaf8"
  sheet: "#ffffff"
  carton-tint: "#efe6da"
  row-hover: "#f6f1ea"
  rule-light: "#e3ddd4"
  rule-dashed: "#d6cec3"
  disabled-bg: "#f4f1ec"
  disabled-border: "#cfc7bc"
  disabled-fill: "#d9d2c8"
  on-dark-muted: "#e9e4dc"
  flexo-red: "#c8102e"
  flexo-red-deep: "#a50d26"
typography:
  display-total:
    fontFamily: "'Big Shoulders Stencil Text', sans-serif"
    fontSize: "56px"
    fontWeight: 800
    lineHeight: 1
    fontFeature: "tnum"
  display-brand:
    fontFamily: "'Big Shoulders Stencil Text', sans-serif"
    fontSize: "42px"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "0.04em"
  headline-stencil:
    fontFamily: "'Big Shoulders Stencil Text', sans-serif"
    fontSize: "26px"
    fontWeight: 800
    letterSpacing: "0.06em"
  action-stencil:
    fontFamily: "'Big Shoulders Stencil Text', sans-serif"
    fontSize: "24px"
    fontWeight: 800
    letterSpacing: "0.12em"
  code:
    fontFamily: "'Big Shoulders Stencil Text', sans-serif"
    fontSize: "16px"
    fontWeight: 700
    letterSpacing: "0.05em"
  stamp:
    fontFamily: "'Big Shoulders Stencil Text', sans-serif"
    fontSize: "13px"
    fontWeight: 800
    letterSpacing: "0.12em"
  headline:
    fontFamily: "'Barlow Condensed', sans-serif"
    fontSize: "30px"
    fontWeight: 700
    letterSpacing: "0.04em"
  title:
    fontFamily: "'Barlow Condensed', sans-serif"
    fontSize: "20px"
    fontWeight: 700
    letterSpacing: "0.04em"
  nav:
    fontFamily: "'Barlow Condensed', sans-serif"
    fontSize: "17px"
    fontWeight: 700
    letterSpacing: "0.06em"
  button:
    fontFamily: "'Barlow Condensed', sans-serif"
    fontSize: "15px"
    fontWeight: 700
    letterSpacing: "0.08em"
  label:
    fontFamily: "'Barlow Condensed', sans-serif"
    fontSize: "13px"
    fontWeight: 700
    letterSpacing: "0.1em"
  figure:
    fontFamily: "'Barlow Condensed', sans-serif"
    fontSize: "16px"
    fontWeight: 700
    fontFeature: "tnum"
  search:
    fontFamily: "Barlow, system-ui, sans-serif"
    fontSize: "22px"
    fontWeight: 500
  body:
    fontFamily: "Barlow, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
  body-small:
    fontFamily: "Barlow, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
  caption:
    fontFamily: "Barlow, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 400
  kbd:
    fontFamily: "Barlow, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 600
rounded:
  none: "0px"
spacing:
  hair: "6px"
  cell-x: "10px"
  cell-y: "12px"
  gutter: "16px"
  stack: "18px"
  panel-x: "26px"
  work-y: "28px"
  work-x: "32px"
components:
  rail:
    backgroundColor: "{colors.kraft}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "28px 20px"
    width: "232px"
  nav-link:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.nav}"
    rounded: "{rounded.none}"
    padding: "0 12px"
    height: "44px"
  nav-link-current:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.kraft-pale}"
  panel-header:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.sheet}"
    typography: "{typography.headline-stencil}"
    padding: "22px 26px"
  search-bar:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink}"
    typography: "{typography.search}"
    rounded: "{rounded.none}"
    padding: "14px 18px"
  input:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "0 12px"
    height: "44px"
  button-pay:
    backgroundColor: "{colors.flexo-red}"
    textColor: "{colors.sheet}"
    typography: "{typography.action-stencil}"
    rounded: "{rounded.none}"
    height: "64px"
    width: "100%"
  button-pay-hover:
    backgroundColor: "{colors.flexo-red-deep}"
  button-pay-disabled:
    backgroundColor: "{colors.disabled-fill}"
    textColor: "{colors.ink-muted}"
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.sheet}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: "0 18px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.ink-hover}"
  button-ghost:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: "0 18px"
    height: "44px"
  button-ghost-hover:
    backgroundColor: "{colors.carton-tint}"
  button-danger-solid:
    backgroundColor: "{colors.flexo-red}"
    textColor: "{colors.sheet}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: "0 18px"
    height: "44px"
  button-danger-solid-hover:
    backgroundColor: "{colors.flexo-red-deep}"
  button-add:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "0 14px"
    height: "40px"
  button-add-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.sheet}"
  button-add-disabled:
    backgroundColor: "{colors.disabled-bg}"
    textColor: "{colors.ink-faint}"
  stepper:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    size: "32px"
  tab:
    backgroundColor: "transparent"
    textColor: "{colors.ink-muted}"
    padding: "0 18px"
    height: "44px"
  tab-active:
    textColor: "{colors.ink}"
  stamp:
    backgroundColor: "transparent"
    textColor: "{colors.flexo-red}"
    typography: "{typography.stamp}"
    rounded: "{rounded.none}"
    padding: "2px 8px"
  in-ticket-badge:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.sheet}"
    padding: "2px 7px"
  notice:
    backgroundColor: "{colors.carton-tint}"
    textColor: "{colors.ink}"
    padding: "12px 16px"
---

# Design System: Bazar

## Overview

**Creative North Star: "La caja de proveedor"**

El panel habla como las cajas que llegan al depósito: cartón corrugado impreso en flexografía, códigos estarcidos, kraft en el lomo y una sola tinta roja para lo que es urgente. No es un POS de SaaS con sidebar blanca y botones azules; es material del local, plano, de tinta y cartón, pensado para usarse detrás del mostrador con un cliente esperando.

La densidad es operativa: tabla de productos con filas de 44px o más, números tabulares, precio alineado a la derecha y el estado del stock estampado en la fila como una marca de cartón. La estructura es un módulo estricto de tres columnas (riel kraft, área de trabajo, columna de ticket o panel) separadas por filetes de tinta de 3px. Todo es en ángulo recto; la profundidad la dan los filetes y el contraste tinta/papel, no las sombras.

La tipografía estarcida (Big Shoulders Stencil Text) se reserva para lo que en una caja iría pintado con plantilla: la marca BAZAR, los N.º, los totales, los títulos del panel oscuro, el botón COBRAR y los sellos. Toda la interfaz de trabajo va en Barlow y Barlow Condensed.

**Key Characteristics:**
- Riel kraft a la izquierda con filete de tinta de 3px; papel cálido como fondo; tinta casi negra para todo el texto y los bordes.
- Un solo rojo flexo, con usos contados: sellos REPONER / SIN STOCK, COBRAR y la confirmación destructiva.
- Esquinas a 0px en todo; bordes de 2px en controles, 3px en estructura, 1px en filas.
- Estarcido solo para códigos, totales, títulos del panel oscuro y sellos.
- Sin sombras en reposo; la única sombra es funcional (pie de cobro fijo en mobile).

## Colors

Una paleta de cartón y tinta: kraft, papel cálido y tinta casi negra, más una sola tinta roja de imprenta.

### Primary
- **Rojo flexo** (`flexo-red`): la tinta de urgencia. Borde y texto de los sellos REPONER / SIN STOCK, fondo del botón COBRAR y fondo del botón "Sí, eliminar". Nada más.
- **Rojo flexo profundo** (`flexo-red-deep`): solo como hover de los dos botones rojos sólidos.

### Secondary
- **Kraft** (`kraft`): el lomo de la caja. Fondo del riel de navegación, color de selección de texto, color de las barras de scroll finas y color del anillo de foco sobre fondo de tinta.
- **Kraft claro** (`kraft-pale`): texto del ítem de navegación actual sobre tinta.
- **Tinta de kraft** (`kraft-ink`): texto secundario dentro del riel (resumen del día, conteo para reponer).

### Neutral
- **Tinta** (`ink`): todo el texto principal, todos los bordes y filetes estructurales, el encabezado oscuro del ticket/panel, el botón primario, el ítem de navegación actual, la insignia ×N y el anillo de foco.
- **Tinta en hover** (`ink-hover`): hover del botón primario.
- **Tinta apagada** (`ink-muted`): encabezados de tabla, etiquetas de campo, marca del producto, textos de ayuda, pestañas inactivas.
- **Tinta tenue** (`ink-faint`): placeholders y texto de controles deshabilitados.
- **Papel** (`paper`): fondo general de la aplicación y del área de trabajo.
- **Hoja** (`sheet`): superficie blanca del ticket, del panel lateral, de inputs y botones de contorno.
- **Cartón teñido** (`carton-tint`): cliente elegido, aviso de venta registrada o cambio guardado, fila en edición, hover del botón fantasma.
- **Hover de fila** (`row-hover`): fondo de fila al pasar el mouse.
- **Filete liviano** (`rule-light`): divisoria de 1px entre filas de tabla y opciones.
- **Filete punteado** (`rule-dashed`): divisoria punteada de 1px entre líneas del ticket, líneas del pedido y antes de la zona de eliminar.
- **Deshabilitado** (`disabled-bg`, `disabled-border`, `disabled-fill`): fondo y borde de controles chicos deshabilitados; `disabled-fill` es el fondo de COBRAR deshabilitado.
- **Texto apagado sobre tinta** (`on-dark-muted`): subtítulo del encabezado oscuro.

### Named Rules
**La Regla de la Tinta Única.** El rojo flexo es urgencia, no decoración. Solo aparece en sellos de stock (REPONER / SIN STOCK), en COBRAR y en la confirmación de una acción irreversible ("Sí, eliminar"). El enlace "Eliminar producto", el ícono de tacho y los errores comunes van en tinta. Si un rojo nuevo no es urgente en el mismo sentido que REPONER, no va.

**La Regla del Cartón.** No hay azules, verdes de éxito ni grises fríos. La confirmación positiva se marca con cartón teñido, borde de tinta y un tilde dibujado en SVG, no con verde.

## Typography

**Display Font:** Big Shoulders Stencil Text (con sans-serif)
**Body Font:** Barlow (con system-ui, sans-serif)
**Label/Mono Font:** Barlow Condensed (con sans-serif)

**Character:** El estarcido es la plantilla pintada sobre el cartón; Barlow Condensed en mayúsculas es la rotulación impresa de la caja; Barlow es la letra de trabajo, legible y sin pretensiones.

### Hierarchy
- **Display total** (`display-total`): el total del ticket, enorme y tabular. En mobile baja a 40px.
- **Display marca** (`display-brand`): la marca BAZAR en el riel. En mobile baja a 30px.
- **Headline estarcido** (`headline-stencil`): título del encabezado oscuro del ticket/panel (VENTA NUEVA, PEDIDO AL PROVEEDOR, PRODUCTO N.º 0052). Siempre en mayúsculas.
- **Acción estarcida** (`action-stencil`): el texto de COBRAR · F12 (20px en mobile).
- **Código** (`code`): el N.º de producto, el idProduct rellenado a cuatro dígitos (0012).
- **Sello** (`stamp`): REPONER / SIN STOCK.
- **Headline** (`headline`): título de la pantalla (MOSTRADOR, PRODUCTOS Y STOCK), en mayúsculas.
- **Title** (`title`): título de estados vacíos, en mayúsculas.
- **Nav** (`nav`): ítems del riel, en mayúsculas.
- **Botón** (`button`): etiquetas de botones en mayúsculas (14 a 16px según el control; 15px es el valor de referencia).
- **Label** (`label`): encabezados de tabla, etiquetas de campo y encabezados de grupo por marca, en mayúsculas con tracking 0.1em.
- **Cifra** (`figure`): stock en unidades y cantidad en el stepper (18px), tabular.
- **Búsqueda** (`search`): texto del buscador principal del Mostrador (18px en el filtro de Productos y en mobile chico).
- **Body** (`body`, `body-small`, `caption`): texto de filas (nombre del producto en 500, precio en 600, nombre del ítem del ticket en 600), ayudas a 14px y metadatos de línea a 13px.
- **Kbd** (`kbd`): atajos F1, F2, F3 (12–13px; el F2 del buscador lleva borde de 1.5px de tinta).

### Named Rules
**La Regla de la Plantilla.** El estarcido solo pinta códigos, totales, la marca, los títulos del encabezado oscuro, COBRAR y los sellos. Nunca texto corrido, nunca etiquetas, nunca botones comunes.

**La Regla del Número Tabular.** Todo precio, cantidad, stock, DNI y N.º usa cifras tabulares (`font-variant-numeric: tabular-nums`). Los precios van alineados a la derecha y sin cortar (`white-space: nowrap`), con formato `$ 4.800` (es-AR).

## Layout

Módulo de tres columnas en una fila flexible que envuelve: riel (base 232px), área de trabajo (base 560px, absorbe el espacio sobrante) y columna de ticket/panel (base 380px), separadas por filetes de tinta de 3px. El área de trabajo tiene `work-y` arriba/abajo y `work-x` a los costados, con `stack` (18px) entre bloques; el ticket y el panel usan `panel-x` (26px) de margen lateral. Las celdas de tabla usan `cell-y` × `cell-x`; la columna de acción usa 8px vertical.

Todos los objetivos táctiles miden 44px de alto como mínimo (navegación, inputs, botones, opciones, pestañas); los secundarios dentro de filas bajan a 40px (Agregar, enlaces), el stepper es de 32px y el tacho de 36px.

**Responsive:**
- **≤ 800px:** el riel pasa a barra superior horizontal con filete inferior de 3px, marca a 30px, se ocultan el subtítulo, el resumen y los atajos F; el ticket/panel se apila debajo con filete superior de 3px; márgenes laterales a `gutter` (16px). En el Mostrador, el pie del ticket (total + COBRAR) queda fijo abajo de la pantalla, COBRAR a 52px de alto y el total a 40px; el contenido reserva 156px abajo.
- **≤ 480px:** se ocultan las columnas N.º y Marca; el sello baja debajo del stock en su propia línea; "Agregar" queda solo con el ícono + en un botón de 44×44 con la etiqueta disponible para lectores de pantalla; la insignia ×N se apila arriba del botón; el padding horizontal de celdas baja a 5–6px.

Las tablas viven en un contenedor con scroll horizontal y barra fina kraft, nunca se rompen.

## Elevation & Depth

Sistema plano. La profundidad se arma con filetes de tinta (3px para estructura, 2px para controles y encabezados de tabla, 1px para filas) y con el contraste entre papel, hoja blanca, kraft y el bloque de tinta del encabezado del ticket. No hay sombras en reposo ni en hover.

### Shadow Vocabulary
- **Pie fijo** (`box-shadow: 0 -8px 24px rgba(29,26,23,.14)`): solo en el pie de cobro fijo en mobile (≤ 800px), para separarlo del contenido que pasa por debajo.

### Named Rules
**La Regla del Filete.** Si algo necesita separarse, se separa con un filete de tinta, no con una sombra. La única sombra del sistema es la del pie fijo en mobile.

## Shapes

Ángulo recto en todo (`rounded.none`): botones, inputs, sellos, insignias, avisos y paneles. Los bordes son de tinta y de grosor jerárquico: 3px para la estructura (filete del riel, columnas, buscador principal, pie del ticket), 2px para controles y encabezados de tabla, 2.5px para el sello, 1px liso entre filas y 1px punteado entre líneas de ticket y pedido. Los íconos son SVG en línea de trazo (2–2.4px), con `currentColor` y extremos cuadrados donde aplica.

El único gesto no ortogonal es el sello: rotado entre −1.5° y −4°.

## Components

### Buttons
Tinta sobre papel, mayúsculas condensadas, sin redondeo; se sienten como rótulos impresos.
- **Shape:** ángulo recto (0px), borde de 2px de tinta.
- **Primary** (`button-primary`): fondo de tinta, texto blanco; hover a `ink-hover`. Para crear y guardar.
- **Ghost** (`button-ghost`): hoja blanca con borde de tinta; hover a cartón teñido. Para Cancelar y No.
- **Agregar** (`button-add`): contorno de tinta con ícono + en SVG; hover invierte a tinta con texto blanco; deshabilitado (sin stock o tope alcanzado) con fondo `disabled-bg`, borde `disabled-border` y texto `ink-faint`.
- **COBRAR** (`button-pay`): rojo flexo a todo el ancho del pie del ticket, 64px de alto, estarcido 24px con tracking 0.12em; hover a rojo profundo; deshabilitado en `disabled-fill` con texto `ink-muted` mientras el ticket esté vacío o falte cliente.
- **Peligro sólido** (`button-danger-solid`): rojo flexo, solo para "Sí, eliminar" dentro de la confirmación en línea. El disparador previo ("Eliminar producto") es un enlace de tinta.
- **Enlace** (link-btn): Barlow Condensed 14px en mayúsculas, subrayado con offset 4px; en hover el subrayado engrosa a 3px. Para Editar, Cambiar, Eliminar producto y el aviso "Elegí un cliente para poder cobrar" (este último en Barlow 15px sin mayúsculas, con flecha SVG).
- **Stepper** (`stepper`): cuadrado de 32px con borde de tinta, − y + en SVG; hover invierte a tinta; + deshabilitado al llegar al stock.
- **Ícono** (icon-btn): 36px, transparente, tinta apagada; en hover aparece el borde de tinta. Para sacar una línea del ticket (tacho).
- **Hover / Focus:** transiciones de fondo y color de 150ms ease-out. Foco visible: contorno de 3px de tinta con offset 2px; sobre fondo de tinta, contorno kraft.

### Chips
- **Insignia en ticket** (`in-ticket-badge`): bloque de tinta con "×N" en Barlow Condensed 13px tabular, junto al botón Agregar cuando el producto ya está en el ticket.

### Cards / Containers
- **Corner Style:** 0px.
- **Background:** el ticket y el panel son hoja blanca con encabezado de tinta (`panel-header`: título estarcido + subtítulo `on-dark-muted` a 14px).
- **Shadow Strategy:** ninguna (ver Elevation & Depth).
- **Border:** filete de 3px de tinta del lado que toca el área de trabajo (arriba en mobile).
- **Internal Padding:** `panel-x` (26px) a los costados; 16px en mobile.
- **Aviso** (`notice`): cartón teñido, borde de 2px de tinta (o filete inferior dentro del ticket), tilde SVG de tinta, `role="status"`.

### Inputs / Fields
- **Buscador principal** (`search-bar`): hoja blanca, borde de 3px de tinta, lupa SVG, texto a 22px y atajo F2 a la derecha. Es el control más grande del área de trabajo.
- **Filtro** (Productos): sin caja, apoyado sobre el filete inferior de 2px de la fila de pestañas; lupa SVG y texto a 18px.
- **Campo** (`input`): 44px, borde de 2px de tinta, etiqueta encima en estilo `label`.
- **Combo de cliente:** igual que el campo, con ícono de persona; las opciones caen en una lista con borde de tinta continuo, filas de 44px separadas por `rule-light`, nombre a la izquierda y DNI tabular a la derecha; hover/foco invierte a tinta. Cliente elegido: bloque de cartón teñido con nombre en negrita, DNI apagado y enlace "Cambiar".
- **Focus:** contorno de 3px de tinta con offset 2–3px sobre todo el contenedor (`:focus-within`).
- **Placeholder:** `ink-faint`.

### Navigation
- **Riel** (`rail`): kraft con filete derecho de 3px; marca BAZAR estarcida arriba con "Gestión del local" debajo; ítems apilados; abajo, separado por filete de 2px, un resumen operativo (ventas del día o productos para reponer) en `kraft-ink`.
- **Ítem** (`nav-link`): 44px, Barlow Condensed 17px en mayúsculas, atajo F a la derecha; hover dibuja un borde de 2px de tinta; actual (`nav-link-current`) es un bloque de tinta con texto `kraft-pale`.
- **Pestañas** (`tab`): Barlow Condensed 16px en mayúsculas con conteo tabular, "Todos (10)"; activa con texto de tinta y subrayado de 4px; inactiva en `ink-muted`.
- **Mobile:** el riel se vuelve barra superior con la navegación a la derecha y sin atajos.

### Tabla de productos
- Encabezado en estilo `label`, color `ink-muted`, sobre filete de 2px de tinta; en el Mostrador la tabla arranca con un filete superior de 3px.
- Columnas: N.º (estarcido), Producto (500), Marca (`ink-muted`), Precio (600, derecha, tabular), Stock (cifra + sello), Acción (derecha).
- Filas con filete de 1px `rule-light`, hover en `row-hover` con transición de 150ms; fila en edición en `carton-tint`.
- Estado vacío: título en estilo `title` y una línea de ayuda en `ink-muted`, en lenguaje del local ("Probá con menos palabras o buscá por la marca.").

### Línea de ticket
- Grilla de dos columnas: nombre (600) con marca y precio unitario a 13px; subtotal tabular a la derecha; debajo, stepper y tacho. Separación con filete punteado.
- Al agregarse, la línea entra deslizándose 16px desde la derecha con fundido (220ms, `cubic-bezier(.16,1,.3,1)`); se desactiva con `prefers-reduced-motion`.
- Pie: "TOTAL" en Barlow Condensed 18px con tracking 0.1em frente al total estarcido gigante, y COBRAR debajo; separado por filete de 3px.

### Sello de stock (componente firma)
La marca de cartón que dice la verdad del stock.
- **Texto:** REPONER (stock entre 1 y 4) o SIN STOCK (stock 0). Con stock de 5 o más no hay sello.
- **Forma** (`stamp`): contorno de 2.5px en rojo flexo, texto rojo flexo estarcido 13px con tracking 0.12em, sin relleno, ángulo recto.
- **Rotación:** cada producto tiene una inclinación fija tomada de `[-4°, -2.5°, -3.5°, -1.5°, -3°]` según `idProduct % 5`, como un sello aplicado a mano que no cambia entre renders.
- **Ubicación:** a continuación de la cifra de stock en la misma celda (10px de separación); en ≤ 480px baja a su propia línea.
- **Uso:** solo para estado de stock. No se reutiliza como etiqueta, insignia ni decoración.

## Do's and Don'ts

### Do:
- **Do** reservar el rojo flexo para sellos REPONER / SIN STOCK, COBRAR y "Sí, eliminar"; todo lo demás en tinta.
- **Do** usar ángulo recto (0px) en todos los elementos y separar con filetes de tinta de 3px (estructura), 2px (controles) y 1px (filas).
- **Do** mostrar el N.º como idProduct rellenado a cuatro dígitos en estarcido, y toda cifra en números tabulares.
- **Do** mantener los objetivos táctiles en 44px como mínimo, y bajar a 40px solo dentro de filas.
- **Do** dar foco visible con contorno de 3px de tinta (kraft sobre fondos de tinta).
- **Do** dibujar los íconos como SVG en línea de trazo con `currentColor`.
- **Do** rotular con "Datos de ejemplo" toda pantalla que muestre datos de muestra.
- **Do** confirmar acciones irreversibles en línea, con el disparador en tinta y solo el botón final en rojo sólido.

### Don't:
- **Don't** armar el clásico POS de SaaS: sidebar blanca, acentos azules, tarjetas redondeadas con sombra.
- **Don't** usar el rojo flexo para errores comunes, enlaces de borrado, íconos o decoración.
- **Don't** usar el estarcido en texto corrido, etiquetas o botones que no sean COBRAR.
- **Don't** usar sombras para separar superficies; la única sombra es la del pie de cobro fijo en mobile.
- **Don't** usar verdes de éxito ni grises fríos; la confirmación es cartón teñido con borde de tinta.
- **Don't** usar caracteres Unicode o emoji como íconos (flechas, tildes, cruces); siempre SVG.
- **Don't** poner etiquetas cortas en mayúsculas encima de los títulos de pantalla; el título va solo.
- **Don't** reutilizar la forma del sello para otra cosa que el estado de stock.
