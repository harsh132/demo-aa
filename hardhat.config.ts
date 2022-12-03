import { HardhatUserConfig } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox'
import 'hardhat-deploy'
import '@nomiclabs/hardhat-ethers'
import 'hardhat-deploy'
import * as dotenv from 'dotenv'
dotenv.config()

let mnemonic = process.env.MNEMONIC || 'test '.repeat(11) + 'junk'

function getNetwork1(url: string): { url: string; accounts: any } {
  return {
    url,
    // accounts: { mnemonic },
    accounts: {
      mnemonic: mnemonic,
    },
  }
}

function getNetwork(name: string): { url: string; accounts: string[] } {
  return getNetwork1(`https://${name}.infura.io/v3/${process.env.INFURA_ID}`)
  // return getNetwork1(`wss://${name}.infura.io/ws/v3/${process.env.INFURA_ID}`)
}

const config: HardhatUserConfig = {
  typechain: {
    outDir: 'types',
    target: 'ethers-v5',
  },
  solidity: '0.8.17',
  networks: {
    localhost: {
      url: 'http://localhost:8545/',
    },
    goerli: getNetwork('goerli'),
    mumbai: getNetwork('polygon-mumbai'),
  },
}

export default config
