import { expect } from 'chai'
import { EntryPoint, EntryPoint__factory } from '@account-abstraction/contracts'
import { ethers } from 'hardhat'
import { HttpRpcClient } from '@account-abstraction/sdk/dist/src/HttpRpcClient'
import { ERC4337EthersProvider } from '@account-abstraction/sdk'
import { MyWalletApi } from '.'
import { deployments } from 'hardhat'
import { ComplexWalletDeployer__factory } from '../types'
import { Greeter__factory } from '../types/factories/contracts/Greeter__factory'
import { MyPaymasterApi } from './MyPaymasterApi'

/** Contracts deployed on goerli network */
// const ENTRYPOINT_ADDR = '0x2167fA17BA3c80Adee05D98F0B55b666Be6829d6'
const ENTRYPOINT_ADDR = '0x2DF1592238420ecFe7f2431360e224707e77fA0E'

const runop = async () => {
  console.log('--- starting runop ---')
  const { deploy } = deployments

  const originalProvider = ethers.provider
  const orignalSigner = originalProvider.getSigner()
  const network = await originalProvider.getNetwork()

  console.log('Chain :', network.chainId)

  const entryPointAddress = ENTRYPOINT_ADDR

  const providerConfig = {
    entryPointAddress,
    // bundlerUrl: 'https://eip4337-bundler-goerli.protonapp.io/rpc',
    // bundlerUrl: 'http://155.248.246.134:3000/rpc',
    bundlerUrl: 'http://localhost:3000/rpc',
    chainId: network.chainId,
  }

  console.log('--- entryPoint initialisation ---')
  const entryPoint = EntryPoint__factory.connect(providerConfig.entryPointAddress, originalProvider)

  /** Deploy greeter to test */
  console.log('--- deploying Greeter contract ---')
  const Greeter_factory = await ethers.getContractFactory('Greeter', orignalSigner)

  const { address: GreeterAddress } = await deploy('Greeter', {
    from: await orignalSigner.getAddress(),
    gasLimit: 4000000,
    maxFeePerGas: '50000000000',
    maxPriorityFeePerGas: '50000000000',
    deterministicDeployment: true,
  })

  let Greeter = Greeter__factory.connect(GreeterAddress, orignalSigner)

  console.log('Greeter Address: ', GreeterAddress)
  console.log('--- end deploying Greeter contract ---')
  /** End Deploy greeter to test */

  /** THis is where we create our custom Wallet */
  console.log('--- deploying ComplexWalletDeployer contract ---')

  const { address: ComplexWalletDeployerAddress } = await deploy('ComplexWalletDeployer', {
    from: await orignalSigner.getAddress(),
    gasLimit: 4000000,
    deterministicDeployment: true,
  })

  console.log('ComplexWalletDeployer Address: ', ComplexWalletDeployerAddress)

  const ComplexWalletDeployer = ComplexWalletDeployer__factory.connect(ComplexWalletDeployerAddress, orignalSigner)
  const factoryAddress = ComplexWalletDeployer.address

  console.log('Factory address:', factoryAddress)

  const ownerAddress = await orignalSigner.getAddress()

  const walletAddress = await ComplexWalletDeployer.getDeploymentAddress(entryPointAddress, [ownerAddress], [], '0')
  console.log('--- end deploying MyWalletDeployer contract ---')

  const myPaymasterApi = new MyPaymasterApi()

  const smartWalletAPI = new MyWalletApi({
    provider: originalProvider,
    entryPointAddress: entryPoint.address,
    walletAddress,
    owner: orignalSigner,
    factoryAddress,
    paymasterAPI: myPaymasterApi,
  })

  /** This marks the end of creation of our custom wallet api */
  console.log('--- Erc4337EthersProvider initialisation ---')

  const httpRpcClient = new HttpRpcClient(providerConfig.bundlerUrl, providerConfig.entryPointAddress, network.chainId)

  const aaProvier = await new ERC4337EthersProvider(
    providerConfig,
    orignalSigner,
    originalProvider,
    httpRpcClient,
    entryPoint,
    smartWalletAPI
  ).init()

  const aaSigner = aaProvier.getSigner()

  console.log('SCW address: ', await aaSigner.getAddress())

  Greeter = Greeter.connect(aaSigner)

  const tx = await Greeter.addGreet({
    value: ethers.utils.parseEther('0'),
    gasLimit: 4000000,
  })

  await tx.wait()

  console.log(tx, '=====')
}

runop()
  .then(() => console.log('--- done ---'))
  .catch((e) => console.log(e))
