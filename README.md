# Mongoose Console

## To start the app via docker, use: 
> docker-compose up

## To build the UI in development mode, use: 
> ng build --prod  
> docker image build -t *image name* .  
> docker run -p [number of port outside the container]:8080 **image name**  

### 8080 is an NGINX port inside the docker container. 

## To run in development mode, use:
> ng serve 
