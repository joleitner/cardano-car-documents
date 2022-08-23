# Cardano Cars

**ATTENTION** runs only on amd64 architecture due to cardano-nodes dependency

This project was developed in the context of a bachelor thesis with the title:

> **Blockchain and NFTs - Meaningful use beyond cryptocurrencies?** <br>
> Conception and prototypical implementation of an NFT-based solution for the safekeeping of digital vehicle documents

A concept was developed for the digitalisation of vehicle documents with the help of blockchain.
This project aims to test the concept developed.
Therefore, this prototype was implemented in which the digital vehicle documents are mapped as NFTs on the Cardano blockchain.

## Prerequisites
In order to successfully experiment with the project and install it locally, a few prerequisites are necessary.

### Docker
Docker is used to enable easy installation of all required components.
If Docker is not yet installed, the official [Docker documentation](https://docs.docker.com/get-docker/) will guide you.

### Pinata - IPFS Service
The IPFS service [Pinata](https://www.pinata.cloud/) is used to store off-chain data.
When minting the NFTs, the data is uploaded and pinned via the Pinata API.
For this purpose, a free account is required
([To the registration](https://app.pinata.cloud/register)). <br>
After the registration process, you can create a new API key via your account.
When asked for the rights, the key can be equipped with admin rights for this purpose.
The created `Pinata Api Key` and the corresponding `Secret Key` are created as environment variables for the webapp.
An example file has already been created under `app/.env_example`.
The variables need to be entered into the file and the ending `_example` needs to be removed.
```bash
# PINATA API KEYS
PINATA_API_KEY="<YOUR_PINATA_API_KEY>"
PINATA_SECRET_API_KEY="<YOUR_PINATA_SECRET_API_KEY>"
```
The Pinata API is now successfully configured.

### Blockfrost.io - Cardano API
To easily retrieve data from the Cardano Blockchain, the API of [Blockfrost.io](https://blockfrost.io/) is used.
The creation of a free account is required and can be done [here](https://blockfrost.io/auth/signin).
After logging in, you can create a new 'Project' via the Dashboard.
Assign a project name and select 'Cardano testnet' as the network.
To use the API with this project, the `PROJECT ID` has to be entered in the `.env` file.
```bash
# BLOCKFROST
BLOCKFROST_PROJECT_ID="<YOUR_BLOCKFROST_PROJECT_ID>"
```

Now that all requirements have been met, the project can be successfully set up.

## Setup

### 1. Database environment variables
To ensure that the database can be set up successfully when the project is first started, there are some additional environment variables.
For this purpose, there is also an `.env_example` file at top level of the project.
The ending `_example` must be removed and, if necessary, the predefined variables can be changed.

In this case, however, the `DATABASE_URL` variable for the app in `app/.env` must be adjusted accordingly so that it can establish a successful connection to the database.
```bash
DATABASE_URL="postgresql://<DB_USER>:<DB_PASSWORD>@db:5432/<DB_NAME>?schema=public"
```

### 2. Cardano-node configuration
In order for the `cardano-node` to establish a successful connection with the testnet, a few config files are mandatory.
These are provided by IOHK - Input Output.

To equip the project with all the required config files, simply execute this command:
```bash
sh ./bin/fetch_config_testnet.sh
```
> In the cardano-node/Dockerfile the last stable version 1.35.2 was selected. 
> In the future, it may be necessary to change the version manually.

### 3. Start project
Since docker is used, the project can be started directly with `docker-compose`. 

```bash
docker-compose up
```

or
```bash
docker-compose up --build
```
to enforce a rebuild of the container (e.g. you changed some inner workings)

First, all images are downloaded.
When the `cardano-node` is started for the first time, the complete blockchain has to be downloaded first, so you have to be patient here (approx. 12GB).
It's best to just let the process run in the background and go have some coffee. ☕

You can use the [Cardano testnet explorer](https://explorer.cardano-testnet.iohkdev.io/en) to compare the latest slot number and check whether you have reached the same state.

After the cardano-node is successfully setup continue with the following steps:

### 4. Adjust node.socket
In order for the webapp to be able to communicate with the cardano-node, a volume got created for cross-container communication via the `node.socket`.
The `node.socket` is created after the successful initialisation of the cardano-node.
However, this gets created as root.
For the webapp to be able to communicate successfully with the cardano-node, the rights must be changed:

```bash
sh ./bin/chown_node_socket.sh
```

It should also be noted that this command must be executed after each restart of the cardano-node. 

### 5. Migrate database
The next step is to migrate the database.
When migrating, a seed script is executed directly so that the database is already filled with the data necessary.

```bash
sh ./bin/migrate_db.sh
```

In the seed script a wallet gets created that is used for crediting wallets that will be created later on.
For this, the wallet must be topped up with some test Ada (tAda).
Copy the printed wallet address out of the console and head over to the [Cardano Testnet Faucet](https://testnets.cardano.org/en/testnets/cardano/tools/faucet/).
Through this page the tAda needed can be requested.

> In case a JSON.parse error message is displayed on the website, it is best to restart the containers. 
<!-- > After that the error is fixed. 
> In order for the prisma client to work, the app container needs to be restarted. -->

### 6. Access prototype
Congrats the project is successfully setup! 🎉 <br>

The project can be accessed via any browser over [localhost:3000](http://localhost:3000).


## Experiment with the protoype
Since the project is now running successfully, it can be used to experiment with.

### Admin
During the migration, an admin user was created.
It is easy to log in as admin with the standard credentials:

 ```bash
username: admin
password: admin
```
As soon as you have successfully registered, you can access the admin area for:
1. Creating a new organisation
2. Setting a user as the manager of an organisation

For example, an organisation could be created. Then a new user could be created via the registration form, who would then be set as manager.

### Minting an NFT
As an organisation manager, it is then possible to manage the organisation's wallet and to mint new NFTs.
This is made possible via the Manage page of the organisation.
1. First a policy has to be created
2. Then a new NFT can be created under the policy
3. There is an `nft-example-data` folder in which sample thumbnails and data are already available

After creating, it is necessary to wait briefly until the NFT has been appended with a new block to the chain (approx. 20sec).
The [Cardano NFT Gallery](https://testnet.adatools.io/nft) can also be used to check whether the minted NFT was successfully created. 

### Remote Wallets
If you want to demo this project, you might want to use [Nami wallet](https://chrome.google.com/webstore/detail/nami/lpfcbjknijpeeillifnkikgncikgfhdo) in the browser for the NFTs to show up in an independent wallet AND viewer.

### Transactions
For example, after creating a new NFT, it could be transferred to a new user.
1. First create a new user via signup
2. Copy the newly created wallet address of the user and log in again as manager
3. Now a new transaction can be created via the Manage page and the NFT can be sent to the user


## Development

### The Webapp
If you want to work on the webapp, you can simply change the contents in the `./app/` folder and wait for the webapp to refresh. The container uses a mapped volume, so the content of `./app/` is considered live for the app container. Because by deafult the container is running a next.js app in development mode, it will recognize changes and refresh automatically.

### Enforcing conatiner rebuild
If you change the different containers themselves, you might want to run `docker-compose up --build` to enforce a rebuild.


<br>
~ By creating the prototype and experimenting with it, it is easy to imagine that NFTs will be used for more than just digital art in the future.


