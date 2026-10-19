# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

React + Vite (chosen by the user). Front consumes the Spring Boot REST API at `Desktop/Bazar/BazarV1` (`/api/v1/products`, `/api/v1/clients`, `/api/v1/sales`). Design only uses what the backend exposes; gaps and validations live in TODO.md. Code must follow clean code: small components, small single-purpose functions, consistent naming, logic separated from presentation (hooks/services).

## Users

The owner and employees of a neighborhood bazaar (bazar de barrio). They use the system behind the counter and in the back room, during the working day, to manage stock, products and sales. Interrupted work: a customer is often waiting.

## Product Purpose

Internal management panel for the bazaar: keep the product catalog and stock under control, register sales quickly, and know what to restock. Success means fewer stock-outs, faster sales at the counter, and the owner knowing how the day went at a glance.

## Positioning

A management tool shaped around how a neighborhood bazaar actually works — hundreds of small, cheap, varied items (cocina, limpieza, regalería, plásticos, librería) — rather than a generic enterprise ERP. _Inferred from the brief; not yet confirmed by the user._

## Operating Context

- Used on a desktop or laptop at the counter; possibly a phone or tablet in the storeroom (assumption).
- Frequent lookups by product name or code while a customer waits.
- Stock is replenished from suppliers; low-stock awareness matters.

## Capabilities and Constraints

Backend today: products (name, brand, price, quantity, stock; low stock = stock < 5), clients (name, surname, dni), sales (date, client required, lines of product id + quantity, totalPrice), daily sales summary. First front screens: Mostrador (venta rápida) and Productos y stock. Currency: Argentine pesos, interface in Spanish rioplatense.

Not in the backend yet (see TODO.md): categories, product codes/barcodes, payment methods, sale without client, stock decrement on sale, authentication/roles.

## Brand Commitments

Name: "Bazar" (final store name not provided). Interface language: Spanish.

## Evidence on Hand

No real products, sales data, logo or assets exist yet. Any data in designs is placeholder and must be labeled as sample data.

## Product Principles

1. Speed at the counter beats completeness: the most frequent action (finding a product, registering a sale) is always one step away.
2. Stock truth is visible: low or zero stock is never hidden.
3. Plain language of the shop, not ERP jargon.
4. Simple, consistent code that one developer can maintain.
