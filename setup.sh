#! /bin/bash

## 자동으로 도커와 도커 컴포즈를 인스톨해주고,
## 도커 컴포즈를 하여, Nginx + PM2 + MongoDB 스택을 배포해주는 스크립트입니다.

sudo ufw allow 3000 # expose port 3000

# install Docker on server
sudo apt-get update
sudo apt-get install docker.io
sudo curl -L https://github.com/docker/compose/releases/download/1.21.2/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# run docker-compose up
docker-compose up -d
