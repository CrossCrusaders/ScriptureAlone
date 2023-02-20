# PocketBase backend

The server for scripture alone uses pocketbase as the primary backend and extends the functionality to add custom api endpoints. 


## Setup

1. ensure go-lang is installed on your machine (https://go.dev/dl/)
2. cd into the /server folder from the root of the project
3. run `go mod tidy` to restore missing dependencies
4. run `go run server.go serve` to start the server

## Testing the server

If you want to test only the server you can use something like POSTMAN
to execute http requests directly against the server.

If you want to test the entire app from your local machine, you will need
to edit the .env file at the root
and set the following values.

```
  VITE_POCKETBASE_URL=http://127.0.0.1:8090/
  
  VITE_BIBLE_API_URL=https://127.0.0.1:8090/api/bible-brain/
```
This will point your web app to your local server instance.

## Testing the bible proxy
To actually make successful requests to the bible brain api, make sure you edit 
the .env file inside the server folder (/server/.env) 
and change the value to the bible brain api key

```
BIBLE_BRAIN_API_KEY={{ the actual key }}
```

DO NOT ACCIDENTALLY COMMIT THIS KEY IT SHOULD REMAIN PRIVATE!!!

The bible brain api proxy is a pass through the the bible brain API

http://127.0.0.1:8090/api/bible-brain/{{ whatever path to their API you want to hit }}

e.g. http://127.0.0.1:8090/api/bible-brain/**bibles/filesets/ENGKJV/JHN/1?v=4**

See the bible brain API documentation for further details (https://documenter.getpostman.com/view/12519377/Tz5p6dp7)






