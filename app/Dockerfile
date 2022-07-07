FROM node:16

ENV CARDANO_NODE_SOCKET_PATH=/ipc/node.socket

#install cardano-cli
RUN mkdir /usr/download
# new link for binaries after hard fork needs to be found from https://hydra.iohk.io
RUN curl https://hydra.iohk.io/build/16159630/download/1/cardano-node-1.35.0-linux.tar.gz > /usr/download/cardano-node.tar.gz
RUN tar -xzf /usr/download/cardano-node.tar.gz --directory /usr/local/bin  

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

CMD [ "npm", "run", "dev" ]