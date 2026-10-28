# Etapa 1: compila el .jar con Maven y JDK 21
FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /app
# Primero el pom.xml: si no cambian las dependencias, Docker reutiliza esta capa
COPY pom.xml .
RUN mvn -B dependency:go-offline
COPY src ./src
RUN mvn -B package -DskipTests

# Etapa 2: imagen final, solo JRE y el .jar
FROM eclipse-temurin:21-jre-alpine
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]
