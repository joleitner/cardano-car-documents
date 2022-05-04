FROM node:16

ENV CARDANO_NODE_SOCKET_PATH=/ipc/node.socket

#install cardano-cli
RUN mkdir /usr/download
RUN curl https://hydra.iohk.io/build/13415056/download/1/cardano-node-1.33.0-linux.tar.gz > /usr/download/cardano-node.tar.gz
RUN tar -xzf /usr/download/cardano-node.tar.gz --directory /usr/local/bin  

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

CMD [ "npm", "run", "dev" ]