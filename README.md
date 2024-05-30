## Run the Project

To run the project, make sure to modify `web-ui/src/proxy.conf.js` and replace the URL by the URL
of the machine running the database and backend. 

Then run, 

```
docker compose up -d database    # then wait a couple of seconds
docker compose up refero-backend
docker compose up refero-web-ui
```