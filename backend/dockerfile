FROM eclipse-temurin:17-jdk-alpine

VOLUME refero-data

# don't forget to manually run mvn package on host machine
COPY ./target/Refero-0.0.1-SNAPSHOT.jar app.jar
ENTRYPOINT [ "java", "-jar", "app.jar" ]