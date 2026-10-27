# syntax=docker/dockerfile:1

# ============================================================
# Etapa 1: build -> compila el proyecto con Maven y JDK 21
# ============================================================
FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /workspace

# Primero solo el pom.xml: mientras no cambien las dependencias,
# Docker reutiliza esta capa y no las vuelve a descargar
COPY pom.xml .
RUN --mount=type=cache,target=/root/.m2 mvn -B -q dependency:go-offline

# Despues el codigo fuente y el empaquetado del .jar
# (los tests se saltean porque necesitan la base de datos y las variables de entorno)
COPY src ./src
RUN --mount=type=cache,target=/root/.m2 mvn -B -q package -DskipTests

# ============================================================
# Etapa 2: extract -> separa el .jar en capas (layered jar)
# ============================================================
FROM eclipse-temurin:21-jre-alpine AS extract
WORKDIR /workspace
COPY --from=build /workspace/target/BazarV1-0.0.1.jar app.jar
RUN java -Djarmode=tools -jar app.jar extract --layers --launcher --destination extracted

# ============================================================
# Etapa 3: runtime -> imagen final, solo JRE y la aplicacion
# ============================================================
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Usuario sin privilegios para no correr la app como root
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Las capas se copian de la que menos cambia a la que mas cambia,
# asi al modificar el codigo solo se reconstruye la ultima
COPY --from=extract /workspace/extracted/dependencies/ ./
COPY --from=extract /workspace/extracted/spring-boot-loader/ ./
COPY --from=extract /workspace/extracted/snapshot-dependencies/ ./
COPY --from=extract /workspace/extracted/application/ ./

# Opciones de la JVM (se pueden sobreescribir con -e JAVA_OPTS=...)
ENV JAVA_OPTS="-XX:MaxRAMPercentage=75.0"

# Puerto en el que escucha la aplicacion
EXPOSE 8080

# Variables necesarias al ejecutar: DB_URL, DB_USER, DB_PASSWORD, PRIVATE_SEC_KEY, USER_SEC
ENTRYPOINT ["sh", "-c", "exec java $JAVA_OPTS org.springframework.boot.loader.launch.JarLauncher"]


##docker build -t bazarv1 .
  #docker run -p 8080:8080 -e DB_URL=jdbc:mysql://host.docker.internal:3306/bazar
  #-e DB_USER=root -e DB_PASSWORD= -e PRIVATE_SEC_KEY=... -e USER_SEC=... bazarv1