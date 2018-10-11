# console
Mongoose Web GUI

## build
>./gradlew clean dist

## Deployment with Docker
As the server on which webapp rises, nginx is used.

To build image
>./gradlew buildImage

To push image to Docker hub
>./gradlew pushImage