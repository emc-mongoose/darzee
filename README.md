# console
Mongoose Web GUI

## build
>./gradlew clean dist

## Deployment with Docker
As the server on which webapp rises, nginx is used.

To build image
>./gradlew buildImage

Before pushing image, please, login to your docker account
>docker login

To push image to Docker hub
>./gradlew pushImage
To start the server with custom port: 
>./gradlew -Pport=(port number) runApp

If you have Docker Compose installed, you could start the server using docker-compose:
>docker-compose up 
