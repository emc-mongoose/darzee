# console
Mongoose Web GUI

## build
>./gradlew clean copyLibs

## Deployment with Docker
As the server on which webapp rises, nginx is used.
Before running, you need to compile the docker-image:
>docker build -t console . -f docker/Dockerfile 

To start the server:
>docker run -p \<network port\>:\<container port\> console

or 
>./gradlew runApp
