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