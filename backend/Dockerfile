FROM maven:3.9.5-eclipse-temurin-21 as build

COPY backend/src /home/app/src
COPY backend/pom.xml /home/app

RUN mvn -f /home/app/pom.xml clean package

FROM eclipse-temurin:21-jre-jammy

# app
COPY --from=build /home/app/target/*.jar /usr/local/lib/app.jar

ENTRYPOINT ["java", "-jar", "/usr/local/lib/app.jar"]
