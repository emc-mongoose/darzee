# console
Mongoose Web GUI

# Deployment with Docker
As the server on which webapp rises, nginx is used.
Before running, you need to compile the docker-image:
>docker build -t nginx-webapp . -f docker/Dockerfile 

To start the server on 80 port:
>docker run -p 80:80 nginx-webapp
