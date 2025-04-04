# Instructions for Installation

## Install VS Code editor 

## Set up Node.js
Node version required LTS 20.12.2

NPM version 8.19.2

## Clone the Git repository
```zsh
git clone git@github.com:cole319/final-year-project-may-2024.git
```

## Collect API key, Secret Key and JWT from Pinata IPFS Cloud
(Please Take a screenshot of the details of the keys once shown as it will be shown only once)

## Go to the terminal, navigate to the project folder, and run the following commands:
```bash
npm i

npx hardhat  node

npx hardhat run --network localhost scripts/deploy.js

npm run dev 
```
## Create an .env file in the root directory. Copy and paste the Pinata API KEY and Secret key

```.env	
PINATA_API_KEY =
PINATA_SECRET_KEY = 
```

## Install Metamask and import Hardhat localhost network

Go to Settings -> Networks -> Add Network -> Add Network Manually -> 

And fill the following details: 

RPC URL: https://localhost:8545/

Chain ID: 31337

Go to Settings -> Advanced -> Enable “Show Test Networks”

Switch to Localhost 8545 in Hardhat networks

Import some test accounts from Hardhat node as showing in the terminal to metamask.

The project is ready to run  

