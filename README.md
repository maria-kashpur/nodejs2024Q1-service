# Home Library Service

This project is a web service for managing users' home library. Users can add, view, update and delete information about artists, albums and tracks, as well as add them to their favorites list.

## Used Technologies
* NodeJS
* NestJS
* PostgreSQL
* TypeORM
* Docker
* Jest

## Техническая информация
Приложение создано с использованием TypeScript.
Для хранения данных используется PostgreSQL база данных.
Для взаимодействия с базой данных используется TypeORM.
Запросы и ответы имеют формат application/json.
Валидация входящих запросов осуществляется.
Для запуска сервиса используется Docker и Docker Compose.
Сервис запускается в нескольких контейнерах: контейнер с приложением и контейнер с PostgreSQL базой данных.

## Prerequisites
1. Clone this repository 
2. Rename .env.example to .env
3. Install NPM modules
```
npm сi
```
3. Run Docker
```
npm run docker
```

## Scan images for security vulnerabilities
```
npm rum docker-scan:node
```

```
npm rum docker-scan:db
```


## Testing
To run all tests without authorization
```
npm run docker:test
```

## Auto-fix and format

```
npm run lint
```

```
npm run format
```

## OpenAPI documentation
After starting the app on port (4000 as default) you can open
in your browser OpenAPI documentation
For exaple: http://localhost:4000/doc/

## REST Endpoints
### Users
- GET /user: Get all users
- GET /user/:id: Get a single user by ID
- POST /user: Create a user
- PUT /user/:id: Update a user's password
- DELETE /user/:id: Delete a user
### Tracks
- GET /track: Get all tracks
- GET /track/:id: Get a single track by ID
- POST /track: Create a new track
- PUT /track/:id: Update track info
- DELETE /track/:id: Delete a track
### Artists
- GET /artist: Get all artists
- GET /artist/:id: Get a single artist by ID
- POST /artist: Create a new artist
- PUT /artist/:id: Update artist info
- DELETE /artist/:id: Delete an artist
### Albums
- GET /album: Get all albums
- GET /album/:id: Get a single album by ID
- POST /album: Create a new album
- PUT /album/:id: Update album info
- DELETE /album/:id: Delete an album
### Favorites
- GET /favs: Get all favorites
- POST /favs/track/:id: Add track to favorites
- DELETE /favs/track/:id: Delete track from favorites
- POST /favs/album/:id: Add album to favorites
- DELETE /favs/album/:id: Delete album from favorites
- POST /favs/artist/:id: Add artist to favorites
- DELETE /favs/artist/:id: Delete artist from favorites
