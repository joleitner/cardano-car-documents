#!/bin/bash
# this script needs to be executed inside the cardano-node

KEY_DIR=/usr/keys

# create payment key-pair
cardano-cli address key-gen \
--verification-key-file $KEY_DIR/payment1.vkey \
--signing-key-file $KEY_DIR/payment1.skey

# create wallet address 
cardano-cli address build \
--payment-verification-key-file $KEY_DIR/payment1.vkey \
--out-file $KEY_DIR/payment1.addr \
--testnet-magic 1097911063