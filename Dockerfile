# syntax=docker/dockerfile:1

# ============================================================
# Etapa 1: build -> compila el front con Vite (Node 22)
# ============================================================
FROM node:22-alpine AS build
WORKDIR /app

# Primero solo package.json y el lock: mientras no cambien las dependencias,
# Docker reutiliza esta capa y no vuelve a correr npm ci
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci

# Despues el codigo fuente y el build de produccion (genera /app/dist)
COPY . .
RUN npm run build

# ============================================================
# Etapa 2: runtime -> nginx sirve el front y hace de proxy al back
# ============================================================
FROM nginx:1.27-alpine

# La imagen de nginx pasa los *.template por envsubst al arrancar y deja el
# resultado en /etc/nginx/conf.d/, asi BACKEND_URL se elige con -e al ejecutar
COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html

# Donde escucha el back (BazarV1). Por defecto, el servicio "backend" del docker-compose
# (Desktop\Bazar\docker-compose.yml), que no publica puerto: solo se llega por la red interna
ENV BACKEND_URL=http://backend:8080

# Puerto en el que escucha nginx
EXPOSE 80


##Normalmente se levanta con el docker-compose de Desktop\Bazar (servicios frontend y backend).
  #Suelto, con el back corriendo en la PC (IntelliJ):
  #docker build -t bazar-front .
  #docker run -p 5173:80 -e BACKEND_URL=http://host.docker.internal:8080 bazar-front
