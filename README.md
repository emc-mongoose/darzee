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

If you have [Docker Compose](https://docs.docker.com/compose/install/) installed, you could start the server using docker-compose:
>docker-compose up 
Default ports for images are listen in .env file. 
