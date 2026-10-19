# Bazar · Front

Panel interno del bazar (mostrador y stock), hecho con React + Vite. Consume la API Spring Boot de `Desktop/Bazar/BazarV1`.

## Cómo levantarlo

1. Levantar el back (puerto 8080):

   ```bash
   cd ../Bazar/BazarV1 && ./mvnw spring-boot:run
   ```

2. Instalar y arrancar el front (puerto 5173):

   ```bash
   npm install
   npm run dev
   ```

3. Abrir http://localhost:5173.

En desarrollo, Vite reenvía todo `/api` al back (`vite.config.js`), así que no hace falta configurar CORS. Si el back corre en otro lugar: `BACKEND_URL=http://otra-url:8080 npm run dev`.

## Atajos

| Tecla | Acción |
|---|---|
| F1 | Mostrador |
| F2 | Buscar producto |
| F3 | Productos |
| F12 | Cobrar |

## Estructura

```
src/
  api/          un archivo por recurso del back (productsApi, clientsApi, salesApi) + httpClient
  domain/       funciones puras de negocio: formato, stock, búsqueda, armado de la venta
  hooks/        estado y carga de datos (useProducts, useTicket, useClients, ...)
  components/   layout (AppShell) y piezas de UI compartidas (sello de stock, buscador, avisos)
  pages/        mostrador/ y productos/: cada pantalla con sus componentes y su CSS
  styles/       tokens del DESIGN.md, base y componentes
```

Reglas que sigue el código:

- Los componentes solo muestran; la lógica vive en `domain/` (pura) y en `hooks/` (estado).
- Las llamadas HTTP están solo en `api/`.
- Los nombres de campos son los mismos que los DTOs del back (`idProduct`, `idClientDTO`, `stock`).
- Colores, tipografías y espaciados salen de `src/styles/tokens.css`, que replica `DESIGN.md`.

## Documentos del proyecto

- `PRODUCT.md`: para quién es y qué hace.
- `DESIGN.md`: sistema visual («La caja de proveedor»).
- `TODO.md`: pendientes del front y del back.
