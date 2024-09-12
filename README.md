# Using Expo Modules in a Bare React Native Workflow

## Installing Expo Modules in Bare Workflow

Follow the official Expo guide to use Expo modules in a bare workflow:  
[Expo Modules Installation Guide](https://docs.expo.dev/bare/installing-expo-modules/)

## Setting Up Ethers for React Native

Ethers 5.x.x is compatible with React Native to get the provider and signer for Ethereum-related operations. 

### Necessary Imports

At the top of your `index.js` file, add the following imports:

```js
import '@ethersproject/shims';
import 'react-native-get-random-values';
import { Buffer } from 'buffer';

// Set global buffer
global.Buffer = Buffer;

## babel config changes
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    '@babel/plugin-proposal-export-namespace-from',
  ],
};

