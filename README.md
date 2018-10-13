# console
Mongoose Web GUI

## build
>./gradlew clean dist

## Deployment with Docker
As the server on which webapp rises, nginx is used.

To build image
>./gradlew buildImage

<<<<<<< HEAD
Before pushing image, please, login to your docker account
>docker login

To push image to Docker hub
>./gradlew pushImage
||||||| merged common ancestors
To start the server with custom port: 
>./gradlew -Pport=(port number) runApp
=======
To start the server with custom port: 
>./gradlew -Pport=(port number) runApp

To start the server using docker-compose:
>docker-compose up 
>>>>>>> Add instruction for running with docker-compose to README.md.
