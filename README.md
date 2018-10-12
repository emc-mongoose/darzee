# console
Mongoose Web GUI

## build
>./gradlew clean dist

## Deployment with Docker
As the server on which webapp rises, nginx is used.

To start the server with default port:
>./gradlew runApp

To start the server with custom port: 
>./gradlew -Pport=(port number) runApp

If you have [Docker Compose](https://docs.docker.com/compose/install/) installed, you could start the server using docker-compose:
>docker-compose up 
