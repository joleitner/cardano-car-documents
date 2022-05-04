# Cardano Car Documents
This project seeks to validate an idea to digitize vehicle documents such as registration certificates and checkbooks. 
This is to be made possible with the help of blockchain technology. 
The documents are to be created as NFTs on the Cardano blockchain.


## Setup
To successfully run the `cardano-node` some config files are mandatory.
To setup the project with all config files needed simple run:
```bash
$ sh ./bin/fetch_config_testnet.sh
```

To enable the simplest possible setup Docker was used for the project.
To start the project only Docker needs to be installed. 
When the node is started for the first time, the complete blockchain is downloaded, so you have to be patient here (approx. 10GB).

Start:
```bash
$ docker-compose up
```