FROM eclipse-temurin:21-jre-alpine
ARG JAR_FILE=target/BazarV1.jar
COPY ${JAR_FILE} app_bazar_back.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app_bazar_back.jar"]
