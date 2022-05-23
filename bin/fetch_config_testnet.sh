#!/bin/bash
PROJECT_DIR="$PWD"
CONFIG_DIR=cardano-config/

if test -e $CONFIG_DIR; then
    echo "remove old config files"
    rm -r $CONFIG_DIR
fi

mkdir -p $CONFIG_DIR
cd $CONFIG_DIR
echo "start downloading to '"$CONFIG_DIR"'.."

wget https://hydra.iohk.io/job/Cardano/cardano-node/cardano-deployment/latest-finished/download/1/testnet-config.json
wget https://hydra.iohk.io/job/Cardano/cardano-node/cardano-deployment/latest-finished/download/1/testnet-byron-genesis.json
wget https://hydra.iohk.io/job/Cardano/cardano-node/cardano-deployment/latest-finished/download/1/testnet-shelley-genesis.json
wget https://hydra.iohk.io/job/Cardano/cardano-node/cardano-deployment/latest-finished/download/1/testnet-alonzo-genesis.json
wget https://hydra.iohk.io/job/Cardano/cardano-node/cardano-deployment/latest-finished/download/1/testnet-topology.json

cd $PROJECT_DIR

mkdir -p cardano-node/config && cp -rf $CONFIG_DIR/* cardano-node/config
mkdir -p app/config && cp $CONFIG_DIR/testnet-shelley-genesis.json ./app/config/testnet-shelley-genesis.json

