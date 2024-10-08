## Run the Project

To run the project you need an installation of docker, run the following commands, 

```
docker compose up -d database    # then wait a couple of seconds
docker compose up refero-backend
docker compose up refero-web-ui
```

## Authentication

The default user is `ben`, his password is `benspassword`. 

## Build the Project

Make sure your .m2 configuration is correct. Backup the previous .xml settings file, and delete
.m2 repository, then run `mvn clean && mvn spring-boot:run`. Build the backend jar artefact using 
`mvn clean && mvn compile && mvn package` and rebuild the docker images in `backend/Dockerfile`
and `web-ui/Dockerfile` using docker build -t `refero:refero-backend` and 
`docker build -t refero:refero-web-ui` from inside `backend/` and `web-ui/` folders respectively. 


## Deploy

To deploy this to your own domain, insert said domain instead of `localhost` inside `Application.java` and `nginx.conf`, then
rebuild everything.

