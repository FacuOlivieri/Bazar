# TODO · Bazar (front + back)

Lista viva para ir mejorando las dos partes de a poco. El diseño actual usa **solo lo que el back ya expone** (`BazarV1`); todo lo demás queda acá.

## Back (`Desktop/Bazar/BazarV1`)

### Bugs / inconsistencias
- [x] Choque de rutas en ventas → el resumen ahora es `GET /api/v1/sales/summary/{fecha_venta}`.
- [x] `Calculator` contaba la cantidad dos veces → ahora suma solo `subtotal`.
- [x] `updateSale` ahora busca productos por `id`, igual que `createSale`.
- [x] Crear una venta descuenta stock y valida disponibilidad (`NotEnoughStock`).
- [x] `ProductController.createClient(...)` → `createProduct`.
- [x] `stock` pasó de `Double` a `Integer`.

### Revisar en los arreglos nuevos (leído en el código, no probado)
- [x] **Vender la última unidad falla:** `Product.stock` tiene `@Positive`, y con `spring-boot-starter-validation` Hibernate valida al guardar. Al dejar el stock en 0, salta una `ConstraintViolationException`. Además, no se podría crear un producto con stock 0. Usar `@PositiveOrZero` en `stock` (entidad y DTO).
- [x] **La validación de stock compara contra el campo equivocado:** `validacionStockProductos` usa `getQuantity()` del producto en vez de `getStock()`. Hoy, con `quantity = 1`, no deja vender más de 1 unidad aunque haya 24.
- [ ] El mensaje de `NotEnoughStock` muestra la cantidad pedida como «STOCK PRESENTE», y `productName` llega `null` porque el front manda solo `{ id, quantity }`. Propuesta: «No hay stock suficiente de Balde plástico 10 L: pediste 3, quedan 2» (con el nombre sacado del producto de la base).
- [x] (Ya tiene `@Transactional`.) El descuento de stock se guardaba solo porque Open Session In View mantiene la entidad gestionada. Conviene `@Transactional` en `createSale` (y `productRepository.save` explícito si hace falta), para que la venta y el stock se guarden o fallen juntos.
- [ ] `updateSale` no devuelve el stock de la venta anterior ni descuenta el de la nueva.
- [ ] El mismo producto repetido en dos líneas de la venta saltea la validación (se valida línea por línea).
- [ ] `@Positive` en `ProductDTO` no se aplica sin `@Valid` en el controller.
- [ ] `ProductDTO.quantity`: definir qué significa (¿unidades por pack?). El front no lo muestra y lo deja como viene.

### Cupones y datos del cliente (probado con el front, back en H2)
- [x] `createClient` ahora guarda la dirección.
- [x] `updateClient` ahora actualiza teléfono, email y dirección.
- [x] El teléfono pasó a `String` (el front lo manda como texto, solo dígitos).
- [x] Validación de teléfono: `ClientService.validatePhone` acepta dígitos, un `+` adelante y separadores (espacios, guiones, paréntesis, puntos), guarda solo dígitos y rechaza letras con 400 (`InvalidClientException`). El front descarta las letras al escribir y avisa debajo del campo.
- [ ] **La columna `client.phone` de MySQL sigue siendo `int(11)`:** `ddl-auto=update` no cambia el tipo de columnas existentes. Hay que correr una vez, en la base `bazarV1`: `ALTER TABLE client MODIFY phone VARCHAR(255);` Si no, los teléfonos largos o con 0 adelante fallan o se cortan en la base real (en H2 funciona porque la tabla se crea de cero).
- [ ] Los archivos de cupones del back (`CouponController`, `CouponDTO`, `CouponService`, `ICouponService`, `ICouponRepository`, `InvalidCouponException`) no están agregados a git: los commits los mencionan, pero no los incluyen.
- [ ] El campo se llama `adress` (falta una d). El front lo traduce en `domain/client.js`; si se renombra a `address`, se cambia solo ahí.
- [ ] `NotFoundException` e `InvalidCouponException` responden 500. Con el `@ControllerAdvice` deberían ser 404 y 409.
- [ ] El identificador del cupón distingue mayúsculas y espacios en el back. El front siempre crea códigos en mayúsculas y sin espacios, y busca ignorando ambos; conviene normalizar también en `CouponService`.
- [ ] Al borrar una venta con cupón, el cupón queda marcado como usado. Decidir si se libera.

### Validaciones (fuera del diseño por ahora)
- [ ] Pasar validaciones a Bean Validation (`@Valid`, `@NotBlank`, `@Positive`) en los DTOs.
- [ ] `@ControllerAdvice` global que devuelva errores en JSON uniforme (`{ status, message, field }`) para mostrarlos en el front.
- [ ] Mensajes de error en español (los ve el usuario del local).
- [ ] Validar que la venta tenga al menos un producto y cantidades > 0.

### Mejoras
- [ ] CORS para el front en desarrollo (`http://localhost:5173`).
- [ ] Endpoints REST sin `/create`: `POST /api/v1/products`, `POST /api/v1/sales`, etc.
- [ ] Búsqueda en servidor: `GET /api/v1/products?q=balde`.
- [ ] `/low_stock`: hacer la consulta en el repositorio en lugar de `findAll()` + filtro; evaluar stock mínimo por producto en vez del 5 fijo.
- [ ] Agregar **rubro/categoría** y **código o código de barras** al producto (el diseño original los tenía y ayudan a buscar en el mostrador).
- [ ] Permitir venta sin cliente (“Consumidor final”); hoy `client` es obligatorio.
- [ ] Guardar **medio de pago** en la venta (efectivo, débito, transferencia).
- [ ] La fecha de la venta debería ponerla el servidor, no el front.
- [ ] Renombrar `ClientDTO.idClientDTO` → `id`.
- [ ] Borrar un cliente con ventas responde 500 (`DataIntegrityViolationException` por la clave foránea). Devolver 409 con un mensaje claro, o desactivar el cliente en lugar de borrarlo. Hoy el front lo traduce a «tiene ventas registradas».
- [ ] Validar DNI en el back (obligatorio, solo números, sin repetidos).
- [x] Base persistente: MySQL (XAMPP). H2 queda comentado en `application.properties`.

## Front (React + Vite)

### Para arrancar
- [x] Proyecto React + Vite con `api/`, `domain/`, `hooks/`, `components/` y `pages/` (Mostrador y Productos), conectado al back.
- [x] Tokens del diseño en `src/styles/tokens.css`.
- [x] Atajos de teclado: F1 Mostrador, F2 buscar, F3 Productos, F12 cobrar. (F12 puede abrir las herramientas de desarrollo en algunos navegadores; probarlo en la PC del local.)
- [x] Fuentes incluidas en el proyecto (`@fontsource`), sin Google Fonts.
- [x] Proxy de Vite a `localhost:8080` para desarrollo (sin CORS). Para producción sigue haciendo falta CORS o servir el front desde el mismo dominio.
- [ ] El back devuelve el stack trace completo en los errores (`trace` en el JSON): desactivarlo fuera de desarrollo (`server.error.include-stacktrace=never`).
- [ ] Mostrar el mensaje de `NotEnoughStock` tal cual: hoy el back responde 500, y el front muestra un aviso genérico de stock. Con un `@ControllerAdvice` que devuelva 409 y el mensaje, el front ya lo muestra sin cambios.

### Validaciones y estados (fuera del diseño por ahora)
- [ ] Validación de formularios de producto (obligatorios, precio > 0, sin negativos) y mostrar los errores que devuelva la API.
- [ ] Estados de carga (skeletons) y de error de red en tablas y ticket.
- [ ] Revalidar stock al cobrar: si el back responde `NotEnoughStock`, avisar en el ticket sobre la línea afectada.
- [x] Resumen del día del riel con `GET /api/v1/sales/summary/{fecha}`.

### Cupones y clientes (hecho)
- [x] Pantalla Cupones (F6): disponibles / usados / todos, alta, edición (incluye marcar como usado) y borrado.
- [x] Cupón opcional en el ticket: se valida contra `/coupons/unused`, muestra subtotal, descuento y total con el mismo redondeo que el back.
- [x] Clientes: teléfono, email y dirección en el formulario; teléfono y email en la tabla; búsqueda también por teléfono y email.

### Próximas pantallas
- [x] Clientes (CRUD sobre `/api/v1/clients`), atajo F4.
- [ ] Historial de ventas (`GET /api/v1/sales`) con detalle (`/products/specificSale/{id}`).
- [ ] Pantalla de resumen por fecha (la ruta ya está resuelta en el back).

### Diseño (impeccable)
- [x] Revisión final de diseño (finish review) y `DESIGN.md` con el sistema visual.
- [x] Adaptación a celular (barra superior, total fijo abajo, tabla compacta).
- [x] Grises sueltos del boceto unificados en los tokens del front (stepper deshabilitado y subtítulo del riel).
- [x] Fuentes autoalojadas.
- [ ] Mostrar la lista de clientes abierta y el estado «sin coincidencias» en una prueba visual (hoy solo verificado en código).
