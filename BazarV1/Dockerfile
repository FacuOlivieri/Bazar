# Imagen base con Java 21 (solo JRE, alcanza para ejecutar el .jar)
FROM eclipse-temurin:21-jre

# Ruta del .jar generado por Maven (se puede cambiar con --build-arg JAR_FILE=...)
ARG JAR_FILE=target/BazarV1-0.0.1.jar

# Copiamos el .jar dentro de la imagen con un nombre fijo
COPY ${JAR_FILE} app.jar

# Puerto en el que escucha la aplicacion
EXPOSE 8080

# Comando que se ejecuta al iniciar el contenedor
ENTRYPOINT ["java", "-jar", "/app.jar"]
