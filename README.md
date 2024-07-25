## Run the Project

To run the project, make sure to modify `web-ui/src/proxy.conf.js` and replace the URL by the URL
of the machine running the database and backend. 

Then run, 

```
docker compose up -d database    # then wait a couple of seconds
docker compose up refero-backend
docker compose up refero-web-ui
```

## To Build the Project

Make sure your .m2 configuration is correct. Backup the previous .xml settings file, and delete
.m2 repository, then run `mvn clean && mvn spring-boot:run`. 


## Deploy

To deploy to the VM make sure to build the backend jar with the appropriate application.properties
of the VM environment on the host machine. 

Local properties : 

spring.jpa.show-sql=false
spring.jpa.generate-ddl=true
logging.level.org.springframework.web=DEBUG

spring.datasource.url=jdbc:postgresql://localhost:5432/refero
spring.datasource.username=sample
spring.datasource.password=secret
spring.datasource.driver-class-name=org.postgresql.Driver

Server properties : 

spring.jpa.show-sql=false
spring.jpa.generate-ddl=true
logging.level.org.springframework.web=DEBUG

spring.datasource.url=jdbc:postgresql://${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}
spring.datasource.username=${POSTGRES_USER}
spring.datasource.password=${POSTGRES_PASSWORD}
spring.datasource.driver-class-name=org.postgresql.Driver
