# Website Template Marketplace
A marketplace for buying websites templates with codes encrypted

## Technologies
- Vue 2
- Vuex 3
- Vuetify
- Hardhat
- Ethers.js
- nft.storage
- Lit Protocol

## Project setup
- Run `npx hardhat compile` to create ABIs
- Create a file called 'config.js' on the src folder and add the following code 
```
export const NFT_STORAGE_APIKEY = <KEY>;
export const CONTRACT_ADDRESS = <CONTRACT ADDRESS>;
```
- Then run
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```